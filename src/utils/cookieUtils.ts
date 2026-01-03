export function setCookie(name: string, value: string, days?: number, path: string = "/", secure: boolean = false): void {
    if (!name || !value) {
        console.error("Cookie name and value are required");
        return;
    }

    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }

    const secureFlag = secure ? "; Secure" : "";
    document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=${path}${secureFlag}`;
}

export function getCookie(name: string): string | null {
    if (!name) {
        console.error("Cookie name is required");
        return null;
    }

    const nameEQ = name + "=";
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const c = cookie.trim(); // Changed from let to const
        if (c.indexOf(nameEQ) === 0) {
            return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
    }
    return null;
}

export function deleteCookie(name: string, path: string = "/"): void {
    if (!name) {
        console.error("Cookie name is required");
        return;
    }

    document.cookie = `${name}=; Max-Age=-1; path=${path}`;
}
