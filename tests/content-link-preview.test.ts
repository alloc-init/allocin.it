import assert from "node:assert/strict";
import { test } from "node:test";
import { fetchLinkMetadata } from "../tina/link-preview";

test("fills X broadcast covers and articles through Jina while preserving YouTube descriptions", async () => {
  const originalFetch = globalThis.fetch;
  const requests: string[] = [];
  const article = "https://publisher.org/news/new-research?edition=2";
  const videoId = "mf6fv78L5BQ";
  const postUrl = "https://x.com/btcplusplus/status/2120915395557081431";
  const broadcastUrl = "https://x.com/i/broadcasts/2EmPXWyYalWdVv";
  const xArticle = "https://x.com/blockspace/status/2019411844553675066";
  const description = "The speaker's introduction.\n\nThe second paragraph.";
  const videoSource = `/api/content-source?kind=youtube&id=${videoId}`;
  let missingVideoDetails = false;
  let broadcastInReply = false;
  let broadcastUnavailable = false;
  let wrongPost = false;
  globalThis.fetch = async (input, options) => {
    const url = String(input);
    requests.push(url);
    if (url === "https://r.jina.ai/") {
      const source = (options.body as URLSearchParams).get("url");
      if (source === article) return Response.json({ code: 200, data: { title: "New research", metadata: { "og:site_name": "Publisher" } } });
      if (source === xArticle) return Response.json({ code: 200, data: {
        title: 'Blockspace on X: "New research" / X', description: "New research",
        content: "[](https://x.com/)\n\n## Conversation\n\n# New research\n\n1 min read\n\nA description of the research.\n\nThe rest of the article.",
      } });
      if (source === postUrl) {
        const link = `[](${broadcastUrl})`;
        const permalink = `[4:23 PM · Nov 12, 2026](${postUrl})`;
        return Response.json({ code: 200, data: {
          title: "bitcoin++ (@btcplusplus) on X", description: "Watch the broadcast.",
          finalUrl: wrongPost ? "https://x.com/another/status/999" : postUrl,
          publishedTime: "2026-11-12T16:23:29.000Z",
          metadata: { "og:image": "https://pbs.twimg.com/profile_images/123/avatar.jpg" },
          content: broadcastInReply ? `${permalink}\nReply: ${link}` : `${link}\n${permalink}`,
        } });
      }
      if (source === broadcastUrl) {
        if (broadcastUnavailable) return new Response(null, { status: 429 });
        return Response.json({ code: 200, data: {
          title: "bitcoin++", description: "A different broadcast description.",
          metadata: { "og:image": "https://pbs.twimg.com/media/HW8BD01WIAAFbHq?format=webp&name=medium" },
        } });
      }
    }
    if (url === videoSource) {
      return Response.json(missingVideoDetails ? { description } : {
        title: "Lecture", description, publisher: "Berkeley", image: "https://i.ytimg.com/vi/mf6fv78L5BQ/maxresdefault.jpg",
      });
    }
    if (url.startsWith("https://www.youtube.com/oembed?")) return Response.json({ title: "Lecture", author_name: "Berkeley" });
    return new Response(null, { status: 404 });
  };
  try {
    const { signal } = new AbortController();
    assert.equal((await fetchLinkMetadata(article, signal)).publisher, "Publisher");
    const video = await fetchLinkMetadata(`https://youtu.be/${videoId}`, signal);
    assert.equal(video.description, description);
    assert.equal(video.publisher, "Berkeley");
    const post = await fetchLinkMetadata(postUrl, signal);
    assert.equal(post.description, "Watch the broadcast.");
    assert.equal(post.title, "Watch the broadcast.");
    assert.equal(post.publisher, "bitcoin++");
    assert.equal(post.date, "2026-11-12");
    assert.equal(post.image, "https://pbs.twimg.com/media/HW8BD01WIAAFbHq.jpg?format=webp&name=medium");
    assert.deepEqual(requests, ["https://r.jina.ai/", videoSource, "https://r.jina.ai/", "https://r.jina.ai/"]);

    const longform = await fetchLinkMetadata(xArticle, signal);
    assert.equal(longform.description, "A description of the research.");
    assert.equal(longform.publisher, "Blockspace");
    assert.equal(longform.category, "news");

    broadcastInReply = true;
    requests.length = 0;
    assert.equal((await fetchLinkMetadata(postUrl, signal)).image, undefined);
    assert.equal(requests.length, 1);

    broadcastInReply = false;
    broadcastUnavailable = true;
    const incompletePost = await fetchLinkMetadata(postUrl, signal);
    assert.equal(incompletePost.image, undefined);
    assert.equal(incompletePost.description, "Watch the broadcast.");

    wrongPost = true;
    await assert.rejects(fetchLinkMetadata(postUrl, signal), /Couldn't read details/);

    missingVideoDetails = true;
    const partial = await fetchLinkMetadata(`https://www.youtube.com/watch?v=${videoId}`, signal);
    assert.equal(partial.description, description);
    assert.equal(partial.publisher, "Berkeley");
    assert.match(requests.at(-1), /^https:\/\/www\.youtube\.com\/oembed\?/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("preserves X post details when the publisher and post heading are absent", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => Response.json({ code: 200, data: {
    title: "A public post", description: "Full post text",
    metadata: { "og:image": ["https://pbs.twimg.com/profile_images/123/avatar.jpg", "https://pbs.twimg.com/media/cover.jpg"] },
  } });
  try {
    const preview = await fetchLinkMetadata("https://x.com/user/status/1234567890", new AbortController().signal);
    assert.equal(preview.title, "Full post text");
    assert.equal(preview.description, "Full post text");
    assert.equal(preview.image, "https://pbs.twimg.com/media/cover.jpg");
    assert.equal(preview.publisher, undefined);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("uses the first valid values from repeated Jina metadata tags", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => Response.json({ code: 200, data: {
    title: "Fallback page title",
    metadata: {
      "og:title": ["", "Research announcement", "Another title"],
      "og:description": ["Research summary", "Another summary"],
      "og:site_name": ["Publisher", "Another publisher"],
      "og:type": ["article", "video"],
      "article:published_time": ["invalid", "2026-11-17T12:00:00Z"],
      "og:image:secure_url": ["http://[invalid", "http://127.0.0.1/cover.jpg"],
      "og:image": ["", "data:image/png;base64,invalid", "/cover.jpg", "/cover-wide.jpg"],
    },
  } });
  try {
    const preview = await fetchLinkMetadata("https://publisher.org/news/article", new AbortController().signal);
    assert.deepEqual(preview, {
      title: "Research announcement",
      description: "Research summary",
      image: "https://publisher.org/cover.jpg",
      publisher: "Publisher",
      date: "2026-11-17",
      category: "news",
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
});
