import { TasksRepository } from "../repositories/TasksRepository";

export class TasksService {
  private tasksRepository: TasksRepository;

  constructor() {
    this.tasksRepository = new TasksRepository();
  }

  async createTask(user_id: number, title: string) {
    if (!title) {
      throw new Error("Title is required");
    }

    if (title.length < 3 || title.length > 100) {
      throw new Error("Title must be between 3 and 100 characters");
    }

    return await this.tasksRepository.createTask(user_id, title);
  }

  async getTasks(user_id: number) {
    return await this.tasksRepository.getTasks(user_id);
  }

  async toggleCompletedTask(taskId: number) {
    await this.tasksRepository.toggleCompletedTask(taskId);
  }

  async toggleImportantTask(taskId: number) {
    await this.tasksRepository.toggleImportantTask(taskId);
  }

  async updateTask(
    taskId: number,
    title: string,
    description: string,
    due_date: Date | null,
  ) {
    await this.tasksRepository.updateTask(taskId, title, description, due_date);
  }

  async deleteTask(taskId: number) {
    await this.tasksRepository.deleteTask(taskId);
  }
}
