import { marked } from "marked";

export interface ArticleFrontmatter extends Record<string, string> {
  tytuł: string;
  podtytuł: string;
  data: string;
  autor: string;
}

const ARTICLE_SOURCE_URL =
  "https://github.com/pawelmamcarz/procuracost/blob/main/docs/articles/pl/";

export function parseArticle(markdown: string): { frontmatter: ArticleFrontmatter; html: string } {
  const match = markdown.replace(/^\uFEFF/, "").match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw new Error("Article must begin with YAML frontmatter.");

  const fields: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim()) continue;
    const entry = line.match(/^([^:]+):\s*(.*?)\s*$/);
    if (!entry) throw new Error(`Unsupported article frontmatter: ${line}`);
    const [, key, raw] = entry;
    if (Object.hasOwn(fields, key)) throw new Error(`Duplicate article field: ${key}`);
    if (raw.startsWith('"')) {
      fields[key] = JSON.parse(raw);
    } else if (raw.startsWith("'") && raw.endsWith("'")) {
      fields[key] = raw.slice(1, -1).replace(/''/g, "'");
    } else {
      fields[key] = raw;
    }
  }

  function required(key: string) {
    const value = fields[key];
    if (!value || typeof value !== "string") throw new Error(`Missing article field: ${key}`);
    return value;
  }

  const frontmatter = {
    ...fields,
    tytuł: required("tytuł"),
    podtytuł: required("podtytuł"),
    data: required("data"),
    autor: required("autor"),
  };
  const body = markdown.replace(/^\uFEFF/, "").slice(match[0].length);
  const html = marked.parse(body, {
    async: false,
    walkTokens(token) {
      if (token.type !== "link") return;
      const sibling = token.href.match(/^(?:\.\/)?([^/:?#]+\.md)([?#].*)?$/);
      if (sibling) token.href = `${ARTICLE_SOURCE_URL}${encodeURIComponent(sibling[1])}${sibling[2] ?? ""}`;
    },
  });
  return { frontmatter, html };
}
