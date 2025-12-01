export interface OGPData {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
}

const ogpCache = new Map<string, OGPData>();

export async function fetchOGP(url: string): Promise<OGPData> {
  // キャッシュをチェック
  if (ogpCache.has(url)) {
    return ogpCache.get(url)!;
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; OGPBot/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const ogpData = parseOGP(html, url);

    // キャッシュに保存
    ogpCache.set(url, ogpData);

    return ogpData;
  } catch (error) {
    console.error(`Failed to fetch OGP for ${url}:`, error);

    // フォールバック
    const fallbackData: OGPData = {
      url,
      title: url,
    };

    ogpCache.set(url, fallbackData);
    return fallbackData;
  }
}

function parseOGP(html: string, url: string): OGPData {
  const ogpData: OGPData = { url };

  // OGPメタタグを抽出
  const ogpMatches = html.matchAll(
    /<meta\s+property=["']og:([^"']+)["']\s+content=["']([^"']+)["']\s*\/?>/gi
  );

  for (const match of ogpMatches) {
    const property = match[1];
    const content = match[2];

    switch (property) {
      case 'title':
        ogpData.title = content;
        break;
      case 'description':
        ogpData.description = content;
        break;
      case 'image':
        ogpData.image = content;
        break;
      case 'site_name':
        ogpData.siteName = content;
        break;
    }
  }

  // OGPタグがない場合のフォールバック
  if (!ogpData.title) {
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    if (titleMatch) {
      ogpData.title = titleMatch[1];
    }
  }

  if (!ogpData.description) {
    const descMatch = html.match(
      /<meta\s+name=["']description["']\s+content=["']([^"']+)["']\s*\/?>/i
    );
    if (descMatch) {
      ogpData.description = descMatch[1];
    }
  }

  // 相対URLを絶対URLに変換
  if (ogpData.image && !ogpData.image.startsWith('http')) {
    try {
      const baseUrl = new URL(url);
      ogpData.image = new URL(ogpData.image, baseUrl.origin).toString();
    } catch (e) {
      // URLのパースに失敗した場合は画像をクリア
      ogpData.image = undefined;
    }
  }

  return ogpData;
}
