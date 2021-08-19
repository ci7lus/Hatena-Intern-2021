import { handleRender } from "./server";
import { RenderRequest } from "../pb/renderer/renderer_pb";

describe("handleRender", () => {
  it("記法変換リクエストを受けて変換できる", async () => {
    const req = new RenderRequest();
    req.setSrc("title\nhttps://google.com/ [google https://google.com/]");
    const ctx = new Map<string, unknown>();
    const reply = await handleRender(req, ctx);
    expect(reply.getHtml()).toBe(
      '<div style="padding-left:0rem"><a href="https://google.com/" target="_blank" rel="noopener">https://google.com/</a><span> </span><a href="https://google.com/" target="_blank" rel="noopener">google</a></div>'
    );
  });
});
