import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { TasksController } from "../controllers/TasksController";

const router = Router();
const tasksController = new TasksController();

router.use(authMiddleware);

router.post("/tasks", tasksController.createTask);

router.get("/tasks", tasksController.getTasks);

router.patch("/tasks/:task_id/toggle-completed", tasksController.toggleCompletedTask);
router.patch("/tasks/:task_id/toggle-important", tasksController.toggleImportantTask);
router.patch("/tasks/:task_id", tasksController.updateTask);

router.delete("/tasks/:task_id", tasksController.deleteTask);

export default router;
