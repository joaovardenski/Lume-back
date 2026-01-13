import { Request, Response } from "express";
import { TasksService } from "../services/TasksService";
import { getErrorMessage } from "../utils/ErrorMessage";

export class TasksController {
  private tasksService: TasksService;

  constructor() {
    this.tasksService = new TasksService();
  }

  async createTask(req: Request, res: Response) {
    try {
      const user_id = req.userId!;
      const { title } = req.body;
      const task = await this.tasksService.createTask(user_id, title);
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  async getTasks(req: Request, res: Response) {
    try {
      const user_id = req.userId!;

      const tasks = await this.tasksService.getTasks(user_id);
      res.json(tasks);
    } catch (error) {
      res.status(404).json({ error: getErrorMessage(error) });
    }
  }

  async toggleCompletedTask(req: Request, res: Response) {
    try {
      const { task_id } = req.params;
      await this.tasksService.toggleCompletedTask(parseInt(task_id));
      res.json({ message: "Task completed status toggled successfully" });
    } catch (error) {
      res.status(404).json({ error: getErrorMessage(error) });
    }
  }

  async toggleImportantTask(req: Request, res: Response) {
    try {
      const { task_id } = req.params;
      await this.tasksService.toggleImportantTask(parseInt(task_id));
      res.json({ message: "Task important status toggled successfully" });
    } catch (error) {
      res.status(404).json({ error: getErrorMessage(error) });
    }
  }

  async updateTask(req: Request, res: Response) {
    try {
      const { task_id } = req.params;
      const { title, description, due_date } = req.body;

      const parsedDueDate = due_date ? new Date(due_date) : null;

      const task = await this.tasksService.updateTask(
        Number(task_id),
        title,
        description,
        parsedDueDate,
      );

      res.json(task);
    } catch (error) {
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  async deleteTask(req: Request, res: Response) {
    try {
      const { task_id } = req.params;
      await this.tasksService.deleteTask(parseInt(task_id));
      res.json({ message: "Task deleted successfully" });
    } catch (error) {
      res.status(404).json({ error: getErrorMessage(error) });
    }
  }
}
