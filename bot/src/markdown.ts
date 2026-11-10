import { EMarkdownType, type ChannelMessageContent } from "mezon-sdk";

type Mark = { type: EMarkdownType; s: number; e: number };

const TOKEN_RE = /```([\s\S]*?)```|\*\*([^\n]+?)\*\*/g;
const LINK_RE = /https?:\/\/[^\s<>"'`]+[^\s<>"'`.,;:!?)\]]/g;

/**
 * Đổi text W2 gửi (có `**đậm**`, ```code```, link) sang tin Mezon `{t, mk}` như KOMU làm,
 * nhưng tính offset trên chính chuỗi kết quả nên đậm + code + link trộn nhau vẫn đúng vị trí.
 */
export function toMezonText(input: string): ChannelMessageContent {
  let t = "";
  const mk: Mark[] = [];
  const pre: Array<[number, number]> = [];
  let last = 0;

  for (const m of input.matchAll(TOKEN_RE)) {
    t += input.slice(last, m.index);
    const inner = m[1] ?? m[2];
    const s = t.length;
    if (m[1] !== undefined) {
      const code = inner.replace(/^\n/, "").replace(/\n$/, "");
      t += code;
      if (code) {
        mk.push({ type: EMarkdownType.PRE, s, e: t.length });
        pre.push([s, t.length]);
      }
    } else {
      t += inner;
      mk.push({ type: EMarkdownType.BOLD, s, e: t.length });
    }
    last = m.index! + m[0].length;
  }
  t += input.slice(last);

  for (const m of t.matchAll(LINK_RE)) {
    const s = m.index!;
    const e = s + m[0].length;
    if (pre.some(([ps, pe]) => s >= ps && e <= pe)) continue;
    mk.push({ type: EMarkdownType.LINK, s, e });
  }

  mk.sort((a, b) => a.s - b.s);
  return mk.length ? { t, mk } : { t };
}
