import React from "react";
import type { Node } from "@progfay/scrapbox-parser";

export const LineNodeRenderer: React.VFC<{ node: Node; key: string | number }> = ({
  node,
  key,
}) => {
  switch (node.type) {
    case "blank":
      return <p key={key}></p>;
    case "code":
      return (
        <code key={key} className="text-sm bg-gray-200">
          {node.text}
        </code>
      );
    case "decoration": {
      const decorationTags: string[] = [];
      node.decos.map((deco) => {
        switch (deco) {
          case "/":
            decorationTags.push("italic");
            break;
          case "-":
            decorationTags.push("line-through");
            break;
          default:
            if (deco.includes("*")) {
              decorationTags.push("font-bold");
              const size = parseInt(deco.replace("*-", ""));
              if (!Number.isNaN(size)) {
                if (8 <= size) {
                  decorationTags.push("text-6xl");
                } else if (7 <= size) {
                  decorationTags.push("text-5xl");
                } else if (6 <= size) {
                  decorationTags.push("text-4xl");
                } else if (5 <= size) {
                  decorationTags.push("text-3xl");
                } else if (4 <= size) {
                  decorationTags.push("text-2xl");
                } else if (3 <= size) {
                  decorationTags.push("text-xl");
                } else if (2 <= size) {
                  decorationTags.push("text-lg");
                }
              }
            }
        }
      });
      return (
        <span className={decorationTags.join(" ")} key={key}>
          {node.nodes.map((childNode, k) => (
            <LineNodeRenderer node={childNode} key={k} />
          ))}
        </span>
      );
    }
    case "hashTag":
      return (
        <a href={`/tags/${node.href}`} key={key}>
          <button
            type="button"
            className="inline-block p-2 py-1 text-xs font-semibold mr-2 rounded bg-gray-300"
            aria-label={`${node.href} の投稿一覧`}
          >
            #{node.href}
          </button>
        </a>
      );
    case "link":
      if (node.href.startsWith("http")) {
        return (
          <a key={key} href={node.href} target="_blank" rel="noopener">
            {node.content.length === 0 ? node.href : node.content}
          </a>
        );
      } else {
        return (
          <a key={key} href={`./${encodeURIComponent(node.href)}`}>
            {node.href}
          </a>
        );
      }
    case "icon":
      if (node.path.includes("[")) {
        return <React.Fragment key={key}></React.Fragment>;
      }
      switch (node.pathType) {
        case "relative":
          return (
            <img
              className="w-6 inline"
              src={`./${encodeURIComponent(node.path)}/icon`}
              loading="lazy"
              key={key}
              alt={`${node.path} のアイコン`}
            />
          );
        case "root":
          return (
            <a key={key} href={`https://scrapbox.io${node.path}`} target="_blank" rel="noopener">
              <img
                className="w-6 inline"
                src={`https://scrapbox.io/api/pages${node.path}/icon`}
                loading="lazy"
                alt={`${node.path} のアイコン`}
              />
            </a>
          );
        default:
          return (
            <p className="text-sm texr-gray-400" key={key}>
              not supported icon
            </p>
          );
      }
    case "image":
      return (
        <div key={key}>
          {0 < node.link.length ? (
            <a href={node.link} target="_blank" rel="noopener">
              <img src={node.src} loading="lazy" alt="" />
            </a>
          ) : (
            <img src={node.src} loading="lazy" alt="" />
          )}
        </div>
      );
    case "plain":
      return <span key={key}>{node.text}</span>;
    case "quote":
      return (
        <p key={key} className="border-l-4 pl-2 border-gray-600 bg-gray-200 border-gray-400">
          {node.nodes.map((childNode, k) => (
            <LineNodeRenderer node={childNode} key={k} />
          ))}
        </p>
      );
    case "strong":
      return (
        <b key={key}>
          {node.nodes.map((childNode, k) => (
            <LineNodeRenderer node={childNode} key={k} />
          ))}
        </b>
      );
    default:
      return (
        <p className="text-sm text-gray-400" key={key}>
          not supported ({node?.type})
        </p>
      );
  }
};
