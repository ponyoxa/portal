import { DateTime } from 'luxon';

const JST_ZONE = 'Asia/Tokyo';

/**
 * 現在のJST日時を取得
 */
export function nowJST(): DateTime {
  return DateTime.now().setZone(JST_ZONE);
}

/**
 * DateオブジェクトをJST DateTimeに変換
 */
export function toJST(date: Date): DateTime {
  return DateTime.fromJSDate(date, { zone: JST_ZONE });
}

/**
 * YYYY-MM-DD形式でフォーマット（JST基準）
 */
export function formatDateJST(date: Date | undefined): string {
  if (!date) return '';
  return DateTime.fromJSDate(date, { zone: JST_ZONE }).toFormat('yyyy-MM-dd');
}

/**
 * ISO8601形式で出力（JST基準）
 */
export function toISOStringJST(date: Date): string {
  return DateTime.fromJSDate(date, { zone: JST_ZONE }).toISO() || '';
}

/**
 * 日付を比較（JST基準）
 * @returns aがbより大きければ正の数、小さければ負の数、同じなら0
 */
export function compareDatesJST(a: Date | undefined, b: Date | undefined): number {
  if (!a && !b) return 0;
  if (!a) return -1;
  if (!b) return 1;

  const dateTimeA = DateTime.fromJSDate(a, { zone: JST_ZONE });
  const dateTimeB = DateTime.fromJSDate(b, { zone: JST_ZONE });

  return dateTimeA.toMillis() - dateTimeB.toMillis();
}
