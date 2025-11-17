import satori from 'satori';
import sharp from 'sharp';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * OGP画像を生成
 */
export class OGPGenerator {
  async generate(content) {
    const { title, description } = content;

    // Satoriを使ってSVGを生成
    const svg = await satori(
      {
        type: 'div',
        props: {
          style: {
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            padding: '0',
            fontFamily: 'Noto Sans JP',
            position: 'relative',
          },
          children: [
            // オレンジのアクセントバー（左上）
            {
              type: 'div',
              props: {
                style: {
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  width: '16px',
                  height: '100%',
                  background: 'linear-gradient(180deg, #ff6b35 0%, #ff8c42 100%)',
                },
              },
            },
            // コンテンツエリア
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  padding: '80px 100px',
                  height: '100%',
                },
                children: [
                  // タイトル
                  {
                    type: 'div',
                    props: {
                      style: {
                        fontSize: '64px',
                        fontWeight: 'bold',
                        color: '#2d3748',
                        marginBottom: '24px',
                        lineHeight: '1.3',
                        letterSpacing: '-0.02em',
                      },
                      children: title || 'ponyoxa portal',
                    },
                  },
                  // 説明文
                  {
                    type: 'div',
                    props: {
                      style: {
                        fontSize: '32px',
                        color: '#718096',
                        lineHeight: '1.6',
                        marginBottom: '60px',
                      },
                      children: description || '',
                    },
                  },
                  // フッター
                  {
                    type: 'div',
                    props: {
                      style: {
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: 'auto',
                      },
                      children: [
                        // オレンジの装飾ドット
                        {
                          type: 'div',
                          props: {
                            style: {
                              width: '12px',
                              height: '12px',
                              borderRadius: '50%',
                              backgroundColor: '#ff6b35',
                              marginRight: '16px',
                            },
                          },
                        },
                        // サイト名
                        {
                          type: 'div',
                          props: {
                            style: {
                              fontSize: '28px',
                              color: '#a0aec0',
                              letterSpacing: '0.05em',
                            },
                            children: 'ponyoxa.com',
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
            // 右下の装飾（オレンジのグラデーション円）
            {
              type: 'div',
              props: {
                style: {
                  position: 'absolute',
                  bottom: '-100px',
                  right: '-100px',
                  width: '300px',
                  height: '300px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255,107,53,0.15) 0%, rgba(255,140,66,0) 70%)',
                },
              },
            },
          ],
        },
      },
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Noto Sans JP',
            data: await this.getFont(),
            weight: 400,
            style: 'normal',
          },
        ],
      }
    );

    // SVGをPNGに変換
    const pngBuffer = await sharp(Buffer.from(svg))
      .png()
      .toBuffer();

    return pngBuffer;
  }

  async getFont() {
    // プロジェクトにバンドルされた日本語フォントを使用
    const bundledFontPath = join(__dirname, 'fonts', 'NotoSansJP-Regular.ttf');

    try {
      const fontData = await readFile(bundledFontPath);
      return fontData;
    } catch (e) {
      console.error('❌ フォント読み込みエラー:', e.message);
      console.error('パス:', bundledFontPath);
      throw new Error('Noto Sans JP フォントが見つかりません');
    }
  }
}
