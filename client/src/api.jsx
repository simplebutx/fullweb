export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiFetch(path, options = {}) {
  const url = path.startsWith('http')
    ? path
    : `${API_BASE_URL}${path}`;

  // body가 FormData인지 체크
  const isFormData = options.body instanceof FormData;

  const headers = {
    // FormData가 아니면 JSON 헤더 세팅
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers || {}),
  };

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  return res;
}
