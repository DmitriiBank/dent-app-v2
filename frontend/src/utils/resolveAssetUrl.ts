export const resolveAssetUrl = (asset?: string | null) => {
    if (!asset) return "";

    const trimmed = asset.trim();
    if (!trimmed) return "";

    if (/^(https?:|data:|blob:)/i.test(trimmed)) {
        return trimmed;
    }

    const baseUrl = import.meta.env.BASE_URL ?? "/";
    const normalizedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    const normalizedPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;

    return `${normalizedBase}${normalizedPath}`;
};
