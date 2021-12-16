import {  } from "../../types";

declare module 'express-session' {
  interface SessionData {
      userId: number;
  }
}
