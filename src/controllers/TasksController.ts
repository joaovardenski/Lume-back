import { Request, Response } from "express";
import { TasksService } from "../services/TasksService";

export class TasksController {
  private tasksService: TasksService;

  constructor() {
    this.tasksService = new TasksService();

    this.createTask = this.createTask.bind(this);
    this.getTasks = this.getTasks.bind(this);
    this.toggleCompletedTask = this.toggleCompletedTask.bind(this);
    this.toggleImportantTask = this.toggleImportantTask.bind(this);
    this.updateTask = this.updateTask.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
  }

  async createTask(req: Request, res: Response) {
    const userId = req.userId!;
    const { title, important, date } = req.body;

    const task = await this.tasksService.createTask(
      userId,
      title,
      Boolean(important),
      Boolean(date),
    );

    return res.status(201).json(task);
  }

  async getTasks(req: Request, res: Response) {
    const userId = req.userId!;

    const tasks = await this.tasksService.getTasks(userId);
    return res.status(200).json(tasks);
  }

  async toggleCompletedTask(req: Request, res: Response) {
    const taskId = Number(req.params.task_id);

    await this.tasksService.toggleCompletedTask(taskId);

    return res.status(200).json({
      message: "Task completed status toggled successfully",
    });
  }

  async toggleImportantTask(req: Request, res: Response) {
    const taskId = Number(req.params.task_id);

    await this.tasksService.toggleImportantTask(taskId);

    return res.status(200).json({
      message: "Task important status toggled successfully",
    });
  }

  async updateTask(req: Request, res: Response) {
    const taskId = Number(req.params.task_id);
    const { title, description, due_date } = req.body;

    const task = await this.tasksService.updateTask(
      taskId,
      title,
      description,
      due_date ?? null,
    );

    return res.status(200).json(task);
  }

  async deleteTask(req: Request, res: Response) {
    const taskId = Number(req.params.task_id);

    await this.tasksService.deleteTask(taskId);

    return res.status(200).json({
      message: "Task deleted successfully",
    });
  }
}
