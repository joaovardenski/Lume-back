import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { corsOptions } from "./config/cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes";
import tasksRoutes from "./routes/tasksRoutes";
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/api", userRoutes);
app.use("/api", tasksRoutes);

app.use(errorHandler);

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}!`);
});
