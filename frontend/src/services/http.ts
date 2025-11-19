const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3555').replace(/\/+$/, '');

interface HttpOptions extends RequestInit {
    auth?: boolean;
    json?: unknown;
}

async function readText(res: Response) {
    try {
        return await res.text();
    } catch {
        return '';
    }
}

export async function httpRequest<T = unknown>(path: string, options: HttpOptions = {}): Promise<T> {
    const {auth = true, json, headers, ...init} = options;
    const token = auth ? localStorage.getItem('token') : null;

    const finalHeaders: HeadersInit = {
        'Content-Type': 'application/json',
        ...headers,
        ...(auth && token ? {Authorization: `Bearer ${token}`} : {}),
    };

    const body = json !== undefined ? JSON.stringify(json) : init.body;

    const response = await fetch(`${API_BASE}${path}`, {
        ...init,
        headers: finalHeaders,
        body,
    });

    if (response.status === 204) {
        return {} as T;
    }

    const text = await readText(response);
    if (!response.ok) {
        throw new Error(text || `HTTP ${response.status}`);
    }

    if (!text) {
        return {} as T;
    }

    try {
        return JSON.parse(text) as T;
    } catch (err) {
        console.error('Не удалось распарсить JSON', err);
        throw new Error('Невозможно обработать ответ сервера');
    }
}

export {API_BASE as API};