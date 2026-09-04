const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export interface FetchOptions extends Omit<RequestInit, 'body'> {
  token?: string;
  body?: any;
}

export async function fetchApi<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<{ success: boolean; data?: T; error?: string; total?: number; page?: number; totalPages?: number }> {
  const { token, headers = {}, body, ...customConfig } = options;

  let serializedBody: BodyInit | undefined = undefined;
  if (body !== undefined && body !== null) {
    serializedBody = typeof body === 'string' ? body : JSON.stringify(body);
  }

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: serializedBody,
    ...customConfig,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: data.error || `Error ${response.status}: ${response.statusText}` };
    }
    return data;
  } catch (error: any) {
    console.error(`API Fetch Error (${endpoint}):`, error);
    return { success: false, error: error.message || 'Network error' };
  }
}
