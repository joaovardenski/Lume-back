import { TasksRepository } from "../repositories/TasksRepository";
import { AppError } from "../errors/AppError";

export class TasksService {
  private tasksRepository: TasksRepository;

  constructor() {
    this.tasksRepository = new TasksRepository();
  }

  async createTask(
    userId: number,
    title: string,
    important: boolean,
    hasDate: boolean,
  ) {
    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    if (!title) {
      throw new AppError("Title is required", 400);
    }

    if (title.length < 3 || title.length > 150) {
      throw new AppError(
        "Title must be between 3 and 150 characters",
        400,
      );
    }

    const dueDate = hasDate ? new Date() : null;

    return await this.tasksRepository.createTask(
      userId,
      title,
      important,
      dueDate,
    );
  }

  async getTasks(userId: number) {
    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    return await this.tasksRepository.getTasks(userId);
  }

  async toggleCompletedTask(taskId: number) {
    if (!taskId || isNaN(taskId)) {
      throw new AppError("Invalid task id", 400);
    }

    const updated = await this.tasksRepository.toggleCompletedTask(taskId);
  }

  async toggleImportantTask(taskId: number) {
    if (!taskId || isNaN(taskId)) {
      throw new AppError("Invalid task id", 400);
    }

    const updated = await this.tasksRepository.toggleImportantTask(taskId);
  }

  async updateTask(
    taskId: number,
    title: string,
    description: string,
    dueDate: string | null,
  ) {
    if (!taskId || isNaN(taskId)) {
      throw new AppError("Invalid task id", 400);
    }

    if (!title || title.length < 3 || title.length > 150) {
      throw new AppError("Title must be between 3 and 150 characters", 400);
    }

    const updatedTask = await this.tasksRepository.updateTask(
      taskId,
      title,
      description,
      dueDate,
    );
  }

  async deleteTask(taskId: number) {
    if (!taskId || isNaN(taskId)) {
      throw new AppError("Invalid task id", 400);
    }

    const deleted = await this.tasksRepository.deleteTask(taskId);
  }
}
