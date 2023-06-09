import { Cookies } from "react-cookie";

export const TIME_OUT_API = 30000;
export const API_URL = import.meta.env.VITE_API_URL;
export const COOKIES = new Cookies();
export const TOKEN: any = COOKIES.get("transcriptor_token") || "";

export enum HttpStatusCodes {
  All = 0,
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
}

export const HOMECONF = {
  HEADER_HEIGHT: 60
}