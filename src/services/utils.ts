/**
 * File 객체를 base64 문자열로 변환하는 유틸리티 함수
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // "data:image/jpeg;base64," 부분을 제거하고 순수 base64 문자열만 반환
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Failed to read file as base64'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * 분석 텍스트를 마크다운 형식으로 포맷팅하는 유틸리티 함수
 */
export const formatAnalysisText = (text: string): string => {
  if (!text) return '';
  
  // 1. 번호가 있는 목록 형식 (1. 2. 3. 또는 ① ② ③)을 처리
  let formattedText = text
    // 1. 2. 3. 형식의 목록을 마크다운 목록으로 변환
    .replace(/^(\d+)\.\s*/gm, (_, num) => `\n${num}. `)
    // ① ② ③ 형식의 목록을 마크다운 목록으로 변환
    .replace(/^([①②③④⑤⑥⑦⑧⑨⑩])\s*/gm, (_, mark) => `\n${mark} `);
    
  // 2. 괄호로 감싸진 텍스트를 볼드 처리
  formattedText = formattedText.replace(/\(([^)]+)\)/g, '**($1)**');
  
  // 3. 줄바꿈이 2번 이상 연속된 경우 하나로 정규화
  formattedText = formattedText.replace(/\n{2,}/g, '\n\n');
  
  return formattedText.trim();
};