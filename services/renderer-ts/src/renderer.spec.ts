import { render } from "./renderer";

describe("render", () => {
  it("scrapboxリンクの解釈ができる", async () => {
    const src = "title\nhttps://google.com/ [google https://google.com/]";
    const html = await render(src);
    expect(html).toBe(
      '<div style="padding-left:0rem"><a href="https://google.com/" target="_blank" rel="noopener">https://google.com/</a><span> </span><a href="https://google.com/" target="_blank" rel="noopener">google</a></div>'
    );
  });
});
