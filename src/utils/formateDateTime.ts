export const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);

    // Gün, Ay ve Yıl
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    // Saat ve Dakika
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}.${month}.${year} ${hours}:${minutes}`;
};

export const formatDateTimeString = (isoDate: string): string => {
    const date = new Date(isoDate);

    const day = date.getDate().toString().padStart(2, "0");
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
};

export const formatDateOnly = (isoDate: string): string => {
    const date = new Date(isoDate);

    // Gün, Ay ve Yıl
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
};


export const formatTime = (isoDate: string): string => {
    const date = new Date(isoDate);

    // Saat ve Dakika
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${hours}:${minutes}`;
};


export const getCurrentTimeISO = (): string => {
    const currentTime = new Date();
    return currentTime.toISOString();
  };


export  const formatDateToString = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };