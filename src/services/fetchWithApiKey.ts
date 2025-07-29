/**
 * 공통 fetch 래퍼 – 모든 요청에 X-API-KEY 헤더 자동 추가
 *
 * 사용 예시:
 *   import { fetchWithApiKey } from './fetchWithApiKey';
 *   const res = await fetchWithApiKey('/api/foo');
 */
export const fetchWithApiKey = (
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const headers = new Headers(init.headers);

  if (apiKey) {
    headers.set('X-API-KEY', apiKey);
  }

  return fetch(input, { ...init, headers });
};

export default fetchWithApiKey;
