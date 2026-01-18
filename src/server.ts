import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { corsOptions } from "./config/cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes";
import tasksRoutes from "./routes/tasksRoutes";

dotenv.config();

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Lume API',
    timestamp: new Date(),
  });
});

app.use("/api", userRoutes);
app.use("/api", tasksRoutes);

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}!`);
});
