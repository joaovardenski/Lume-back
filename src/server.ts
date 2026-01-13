import express from "express";
import cors from "cors";
import { corsOptions } from "./config/cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes";
import tasksRoutes from "./routes/tasksRoutes";

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use("/api", userRoutes);
app.use("/api", tasksRoutes);

app.listen(3333, () => {
  console.log("Servidor rodando na porta 3333");
});
