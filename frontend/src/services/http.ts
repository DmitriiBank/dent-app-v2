const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3555').replace(/\/+$/, '');

interface HttpOptions extends RequestInit {
    auth?: boolean;
    json?: unknown;
}


export async function httpRequest<T>(url: string, options: HttpOptions = {}) {
    const requestOptions: RequestInit = {
        method: options.method || "GET",
        credentials: "include",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        }
    };

    if (options.json) requestOptions.body = JSON.stringify(options.json);
    if (options.body) requestOptions.body = options.body;

    const res = await fetch(API_BASE + url, requestOptions);

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Request failed");
    }

    return res.json() as Promise<T>;
}
