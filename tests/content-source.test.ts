import assert from "node:assert/strict";
import { test } from "node:test";
import type { NextApiRequest, NextApiResponse } from "next";
import handler from "../pages/api/content-source";
import type { LinkMetadata } from "../tina/link-metadata";

test("extracts YouTube player JSON without treating description text as script structure", async () => {
  const originalFetch = globalThis.fetch;
  const id = "mf6fv78L5BQ";
  const image = `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
  const page = (description: string, videoId = id) => `<script>var ytInitialPlayerResponse = ${JSON.stringify({
    playabilityStatus: { status: "OK" },
    videoDetails: {
      videoId, title: "JavaScript tutorial", shortDescription: description, author: "Author",
      thumbnail: { thumbnails: [{ url: image, width: 1280 }] },
    },
    microformat: { playerMicroformatRenderer: { publishDate: "2026-11-17" } },
  })}; var otherData = {};</script>`;

  async function read(html: string) {
    globalThis.fetch = async (url, options) => {
      assert.equal(url, `https://www.youtube.com/watch?v=${id}`);
      assert.equal(options?.redirect, "error");
      return new Response(html);
    };
    let status: number;
    let body: LinkMetadata;
    const response = {
      setHeader() { return this; },
      status(value: number) { status = value; return this; },
      end() { return this; },
      json(value: LinkMetadata) { body = value; },
    };
    await handler({ method: "GET", query: { kind: "youtube", id } } as unknown as NextApiRequest, response as unknown as NextApiResponse);
    return { status, body };
  }

  try {
    const description = "An introduction.\n\nA second paragraph.";
    assert.deepEqual(await read(page(description)), {
      status: 200,
      body: { title: "JavaScript tutorial", description, publisher: "Author", image, date: "2026-11-17", category: "media" },
    });

    const code = 'const data = {}; var next = { nested: { value: "}" } };\nQuotes: "hello"; backslash: \\; escaped quote: \\"; unmatched brace: {';
    const withCode = await read(page(code));
    assert.equal(withCode.status, 200);
    assert.equal(withCode.body.description, code);

    assert.deepEqual(await read('<script>var ytInitialPlayerResponse = {"invalid":};</script>'), { status: 502, body: undefined });
    assert.deepEqual(await read(page(description, "abcdefghijk")), { status: 204, body: undefined });
  } finally {
    globalThis.fetch = originalFetch;
  }
});
