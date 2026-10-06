const blockTypes = new Set([
  "root", "p", "h1", "h2", "h3", "h4", "h5", "h6",
  "blockquote", "ul", "ol", "li", "table", "tr", "td", "th", "code_block",
]);

// Read only text leaves and children; rich-text links, markup and embeds stay inert.
export const richTextToPlainText = (value: unknown): string => {
  const readText = (node: unknown): string => {
    if (typeof node === "string") return node;
    if (Array.isArray(node)) return node.map(readText).join(" ");
    if (!node || typeof node !== "object") return "";

    const record = node as { text?: unknown; children?: unknown; type?: unknown };
    if (typeof record.text === "string") return record.text;
    if (!Array.isArray(record.children)) return "";

    const text = record.children.map(readText).join("");
    return typeof record.type === "string" && blockTypes.has(record.type) ? `${text} ` : text;
  };

  return readText(value).replace(/\s+/g, " ").trim();
};
