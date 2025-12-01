import type { Root, Paragraph, Link, Text } from 'mdast';
import { visit } from 'unist-util-visit';
import { fetchOGP } from './ogp.js';

export function remarkLinkCard() {
  return async (tree: Root) => {
    const promises: Promise<void>[] = [];

    visit(tree, 'paragraph', (node: Paragraph, index, parent) => {
      // 段落に単一のリンクのみが含まれているかチェック
      if (
        node.children.length === 1 &&
        node.children[0].type === 'link'
      ) {
        const linkNode = node.children[0] as Link;
        const url = linkNode.url;

        // 内部リンクかどうかをチェック
        const isExternal =
          url.startsWith('http://') || url.startsWith('https://');

        if (isExternal) {
          // 外部リンクの場合、OGP情報を取得
          const promise = fetchOGP(url).then((ogpData) => {
            // HTMLノードに変換
            const cardHtml = `
<div class="link-card-wrapper">
  <a href="${escapeHtml(url)}" class="link-card" target="_blank" rel="noopener noreferrer">
    <div class="link-card-content">
      <div class="link-card-text">
        <div class="link-card-title">${escapeHtml(ogpData.title || url)}</div>
        ${
          ogpData.description
            ? `<div class="link-card-description">${escapeHtml(ogpData.description)}</div>`
            : ''
        }
        <div class="link-card-url">
          <span class="link-card-domain">${escapeHtml(ogpData.siteName || new URL(url).hostname)}</span>
        </div>
      </div>
      ${
        ogpData.image
          ? `<div class="link-card-image"><img src="${escapeHtml(ogpData.image)}" alt="${escapeHtml(ogpData.title || 'Link preview')}" loading="lazy" /></div>`
          : ''
      }
    </div>
  </a>
</div>`;

            // 段落ノードをHTMLノードに置き換え
            if (parent && typeof index === 'number') {
              (parent.children as any)[index] = {
                type: 'html',
                value: cardHtml,
              };
            }
          });

          promises.push(promise);
        } else {
          // 内部リンクの場合、シンプルなカード形式に変換
          const linkText =
            linkNode.children.length > 0 &&
            linkNode.children[0].type === 'text'
              ? (linkNode.children[0] as Text).value
              : url;

          const cardHtml = `
<div class="link-card-wrapper">
  <a href="${escapeHtml(url)}" class="link-card link-card-internal">
    <div class="link-card-content">
      <div class="link-card-text">
        <div class="link-card-title">${escapeHtml(linkText)}</div>
        <div class="link-card-url">
          <span class="link-card-domain">ponyoxa.com</span>
        </div>
      </div>
    </div>
  </a>
</div>`;

          if (parent && typeof index === 'number') {
            (parent.children as any)[index] = {
              type: 'html',
              value: cardHtml,
            };
          }
        }
      }
    });

    // すべてのOGP取得を待つ
    await Promise.all(promises);
  };
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
