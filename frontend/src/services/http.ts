
const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3555').replace(/\/+$/, '');
interface HttpOptions extends RequestInit {
    auth?: boolean;
    json?: unknown;
    retry?: boolean;
}

async function extractErrorMessage(res: Response) {
    const contentType = res.headers.get("content-type") ?? "";

    try {
        if (contentType.includes("application/json")) {
            const payload = await res.json();
            if (typeof payload?.message === "string" && payload.message.trim()) {
                return payload.message;
            }

            if (payload?.errors && typeof payload.errors === "object") {
                const firstError = Object.values(payload.errors)
                    .flat()
                    .find((value) => typeof value === "string");

                if (typeof firstError === "string" && firstError.trim()) {
                    return firstError;
                }
            }
        }

        const text = await res.text();
        if (text.trim()) return text;
    } catch {
        return `Request failed with status ${res.status}`;
    }

    return `Request failed with status ${res.status}`;
}


export async function httpRequest<T>(url: string, options: HttpOptions = {}): Promise<T> {
    const res = await fetch(API_BASE + url, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(options.headers ?? {}),
        },
        body: options.json ? JSON.stringify(options.json) : undefined,
    });

    if (!res.ok) throw new Error(await extractErrorMessage(res));

    return res.status === 204 ? undefined as T : res.json();
}
