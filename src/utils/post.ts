// created_at('2026-09-14T21:30:00')을 화면에 쓸 연도와 월·일로 나눈다
export function getDateParts(createdAt: string): { year: string; monthDay: string } {
  const date = new Date(createdAt)
  return {
    year: `${date.getFullYear()}년`,
    monthDay: `${date.getMonth() + 1}월 ${date.getDate()}일`,
  }
}

// 본문이 "인용문"으로 시작하면 인용문과 나머지 본문을 나눈다
export function splitLeadingQuote(content: string): { quote: string | null; body: string } {
  const match = content.match(/^\s*"([^"]+)"\s*/)
  if (!match) {
    return { quote: null, body: content }
  }
  return { quote: match[1], body: content.slice(match[0].length) }
}
