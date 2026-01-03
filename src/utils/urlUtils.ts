export const updateURLParam = (key: string, value: string) => {
    const url = new URL(window.location.href);
    if (url.searchParams.get(key) === value) return; // Eğer parametre zaten aynıysa hiçbir şey yapma

    url.searchParams.set(key, value);
    window.history.pushState({}, '', url.toString());
};

export function removeURLParam(key: string): void {
    const url = new URL(window.location.href);
    url.searchParams.delete(key);
    window.history.replaceState(null, '', url.toString());
}

export function getURLParam(key: string): string | null {
    const url = new URL(window.location.href);
    return url.searchParams.get(key);
}

export function getAllURLParams(): Record<string, string> {
    const url = new URL(window.location.href);
    const params: Record<string, string> = {};
    url.searchParams.forEach((value, key) => {
        params[key] = value;
    });
    return params;
}

export function hasURLParam(key: string): boolean {
    const url = new URL(window.location.href);
    return url.searchParams.has(key);
}

export function clearURLParams(): void {
    const url = new URL(window.location.href);
    url.searchParams.forEach((_, key) => url.searchParams.delete(key));
    history.replaceState(null, '', url.toString());
}

export function upsertURLParam(key: string, value: string): void {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    history.replaceState(null, '', url.toString());
}

export function countURLParams(): number {
    const url = new URL(window.location.href);
    return Array.from(url.searchParams.keys()).length;
}

export function getURLSegmentAfter(key: string): string | null {
    const urlSegments = window.location.pathname.split('/').filter(Boolean); // Remove empty segments
    const keyIndex = urlSegments.indexOf(key);

    return keyIndex !== -1 && keyIndex < urlSegments.length - 1 
        ? urlSegments[keyIndex + 1] 
        : null;
}

export function getLastSegment(pathname: string = window.location.pathname): string {
    const segments = pathname.split('/').filter(Boolean); // ["dashboard", "files", "documents"]
    return segments.pop() || ''; // Son segmenti döndürür, yoksa boş string
  }