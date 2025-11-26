
// const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3555').replace(/\/+$/, '');
interface HttpOptions extends RequestInit {
    auth?: boolean;
    json?: unknown;
    retry?: boolean;
}



export async function httpRequest<T>(url: string, options: HttpOptions = {}): Promise<T> {
    const res = await fetch(url, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(options.headers ?? {}),
        },
        body: options.json ? JSON.stringify(options.json) : undefined,
    });

    if (!res.ok) throw new Error(await res.text());

    return res.status === 204 ? undefined as T : res.json();
}
