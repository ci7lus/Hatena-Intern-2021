import React from "react";
import type { Page } from "@progfay/scrapbox-parser";
import { LineNodeRenderer } from "./nodeRenderer";

export const ContentRenderer: React.VFC<{ page: Page }> = ({ page }) => {
  return (
    <>
      {page.map((line, lineIdx) => {
        switch (line.type) {
          case "title":
            return <span key={lineIdx}>{line.text}</span>;
          case "line":
            if (line.nodes.length === 0) {
              return <br key={`line-${lineIdx}`} />;
            }
            if (line.indent === 0) {
              return (
                <div style={{ paddingLeft: `${line.indent}rem` }} key={`line-${lineIdx}`}>
                  {line.nodes.map((node, k) => (
                    <LineNodeRenderer node={node} key={k} />
                  ))}
                </div>
              );
            } else {
              return (
                <ul style={{ paddingLeft: `${line.indent}rem` }} key={`line-${lineIdx}`}>
                  <li>
                    {line.nodes.map((node, k) => (
                      <LineNodeRenderer node={node} key={k} />
                    ))}
                  </li>
                </ul>
              );
            }
          case "codeBlock": {
            const ext = line.fileName.trim().split(".").pop();
            if (!ext) return <p>Load error!</p>;
            return (
              <div>
                <code>{line.fileName}</code>
                <pre>{line.content}</pre>
              </div>
            );
          }
          default:
            return <></>;
        }
      })}
    </>
  );
};
