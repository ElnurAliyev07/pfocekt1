export function capitalize(text: string) {
    if (!text) return ""; // Boş bir metin kontrolü
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}