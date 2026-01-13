import { CorsOptions } from "cors";

const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Permite chamadas sem origin (Postman, mobile, SSR)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};
