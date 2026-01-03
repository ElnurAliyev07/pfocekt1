export function formatByteSize(byteSize: number): string {
    if (byteSize < 0) {
        throw new Error("Byte boyutu negatif olamaz!");
    }

    const units = ["B", "KB", "MB", "GB", "TB"];
    let size = byteSize;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
}