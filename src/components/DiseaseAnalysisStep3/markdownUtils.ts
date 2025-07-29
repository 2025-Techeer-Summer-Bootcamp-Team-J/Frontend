// markdownUtils.ts
// 마크다운 관련 유틸리티 함수들을 모아둡니다.
// react-refresh 제약으로 인해 컴포넌트 파일이 아닌 별도의 유틸 파일에 위치시켰습니다.

/**
 * 긴 한국어/영어 텍스트를 줄 단위로 파싱하여 마크다운 리스트 형태로 변환합니다.
 * @param text 원본 텍스트 (선택)
 * @returns 마크다운 문자열
 */
export const convertLinesToMarkdown = (text?: string): string => {
  if (!text) return '';
  // '정의:', '특징:' 등의 키가 나오기 전에 줄바꿈을 삽입
  const preSection = text.replace(/\s*(?=(정의|특징|원인|증상)\s*[:：])/g, '\n');
  // 문장 단위 줄바꿈 처리
  const preProcessed = preSection.replace(/([.!?])\s+/g, '$1\n');
  // 빈 줄 제거 후 배열로 분리
  const lines = preProcessed.split('\n').filter(l => l.trim() !== '');
  // 각 줄을 마크다운 포맷으로 변환
  return lines
    .map((line) => {
      const trimmed = line.trim();
      // 번호가 이미 붙은 경우 그대로 사용
      if (/^(\d+\.|[①②③④⑤⑥⑦⑧⑨⑩])/.test(trimmed)) {
        return trimmed;
      }
      if (trimmed.includes(':')) {
        const splitIndex = trimmed.indexOf(':');
        const key = trimmed.slice(0, splitIndex).trim();
        const value = trimmed.slice(splitIndex + 1).trim();
        if (!value) {
          return `- **${key}**`;
        }
        return `- **${key}**:\n  ${value}`;
      }
      return `- ${trimmed}`;
    })
    .join('\n');
};
