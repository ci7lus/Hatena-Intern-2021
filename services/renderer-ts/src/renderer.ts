import { parse } from "@progfay/scrapbox-parser";
import ReactDOM from "react-dom/server";
import { ContentRenderer } from "./parser/contentRenderer";

/**
 * 受け取った文書を HTML に変換する
 */
export async function render(src: string): Promise<string> {
  const parsed = parse(src.replace(/\r\n/g, "\n"));
  const apply = ContentRenderer({ page: parsed });
  if (!apply) throw new Error("cant applied");
  const html = ReactDOM.renderToStaticMarkup(apply);
  return html;
}
