export const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (reader.result) {
                resolve(reader.result as string);
            } else {
                reject(new Error("Dosya okunamadı"));
            }
        };
        reader.onerror = (error) => reject(error);

        reader.readAsDataURL(file);
    });
};
