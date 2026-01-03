// utils/jwtUtils.ts

export interface JWTPayload {
    exp: number;
    [key: string]: any;
  }
  
  export const decodeJWT = (token: string): JWTPayload => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    );
    return JSON.parse(jsonPayload) as JWTPayload;
  };
  
  export const getTokensMaxAges = (access: string, refresh: string) => {
    if (!access || !refresh) {
      throw new Error("Tokens are undefined");
    }
  
    const accessPayload = JSON.parse(atob(access.split(".")[1]));
    const refreshPayload = JSON.parse(atob(refresh.split(".")[1]));
  
    return {
      accessMaxAge: accessPayload.exp - Math.floor(Date.now() / 1000),
      refreshMaxAge: refreshPayload.exp - Math.floor(Date.now() / 1000),
    };
  };