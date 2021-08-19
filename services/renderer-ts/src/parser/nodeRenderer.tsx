import React from "react";
import type { Node } from "@progfay/scrapbox-parser";

export const LineNodeRenderer: React.VFC<{ node: Node; _key: string | number }> = ({
  node,
  _key,
}) => {
  switch (node.type) {
    case "blank":
      return <p></p>;
    case "code":
      return <code>{node.text}</code>;
    case "decoration": {
      let Bold: keyof JSX.IntrinsicElements = "div";
      let Tag: keyof JSX.IntrinsicElements = "span";
      node.decos.map((deco) => {
        switch (deco) {
          case "/":
            Tag = "i";
            break;
          case "-":
            Tag = "s";
            break;
          default:
            if (deco.includes("*")) {
              Bold = "b";
              const size = parseInt(deco.replace("*-", ""));
              if (!Number.isNaN(size)) {
                if (8 <= size) {
                  Tag = "h2";
                } else if (5 <= size) {
                  Tag = "h3";
                } else if (4 <= size) {
                  Tag = "h4";
                } else if (3 <= size) {
                  Tag = "h5";
                } else if (2 <= size) {
                  Tag = "h6";
                }
              }
            }
        }
      });
      return (
        <Bold>
          <Tag>
            {node.nodes.map((childNode, k) => (
              <LineNodeRenderer
                node={childNode}
                key={[_key, k].join("-")}
                _key={[_key, k].join("-")}
              />
            ))}
          </Tag>
        </Bold>
      );
    }
    case "hashTag":
      return (
        <a href={`/tags/${node.href}`}>
          <button type="button" aria-label={`${node.href} の投稿一覧`}>
            #{node.href}
          </button>
        </a>
      );
    case "link":
      if (node.href.startsWith("http")) {
        return (
          <a href={node.href} target="_blank" rel="noopener">
            {node.content.length === 0 ? node.href : node.content}
          </a>
        );
      } else {
        return <a href={`./${encodeURIComponent(node.href)}`}>{node.href}</a>;
      }
    case "icon":
      if (node.path.includes("[")) {
        return <></>;
      }
      switch (node.pathType) {
        case "relative":
          return (
            <img
              src={`./${encodeURIComponent(node.path)}/icon`}
              loading="lazy"
              alt={`${node.path} のアイコン`}
            />
          );
        case "root":
          return (
            <a href={`https://scrapbox.io${node.path}`} target="_blank" rel="noopener">
              <img
                src={`https://scrapbox.io/api/pages${node.path}/icon`}
                loading="lazy"
                alt={`${node.path} のアイコン`}
              />
            </a>
          );
        default:
          return <p>not supported icon</p>;
      }
    case "image":
      return (
        <div>
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
      return <span>{node.text}</span>;
    case "quote":
      return (
        <blockquote>
          {node.nodes.map((childNode, k) => (
            <LineNodeRenderer
              node={childNode}
              key={[_key, k].join("-")}
              _key={[_key, k].join("-")}
            />
          ))}
        </blockquote>
      );
    case "strong":
      return (
        <b>
          {node.nodes.map((childNode, k) => (
            <LineNodeRenderer
              node={childNode}
              key={[_key, k].join("-")}
              _key={[_key, k].join("-")}
            />
          ))}
        </b>
      );
    default:
      return <p>not supported ({node?.type})</p>;
  }
};
