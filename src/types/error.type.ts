export type ApiError = {
    status: number;
    data?: Record<string, string[] | string | undefined>;
};
