import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { TasksController } from "../controllers/TasksController";

const router = Router();
const tasksController = new TasksController();

router.use(authMiddleware);

router.post("/tasks", (req, res) => tasksController.createTask(req, res));

router.get("/tasks", (req, res) => tasksController.getTasks(req, res));

router.patch("/tasks/:task_id/toggle-completed", (req, res) =>
  tasksController.toggleCompletedTask(req, res),
);
router.patch("/tasks/:task_id/toggle-important", (req, res) =>
  tasksController.toggleImportantTask(req, res),
);

router.patch("/tasks/:task_id", (req, res) =>
  tasksController.updateTask(req, res),
);

router.delete("/tasks/:task_id", (req, res) =>
  tasksController.deleteTask(req, res),
);

export default router;
