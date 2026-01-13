import { pool } from "../config/database";

export interface Task {
  id: number;
  user_id: number;
  title: string;
  description: string;
  completed: boolean;
  important: boolean;
  due_date: Date | null;
  completed_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export class TasksRepository {
  async createTask(user_id: number, title: string) {
    const query = `
            INSERT INTO tasks (user_id, title)
            VALUES ($1, $2)
            RETURNING *
        `;
    const result = await pool.query(query, [user_id, title]);
    return result.rows[0];
  }

  async getTasks(user_id: number): Promise<Task[]> {
    const query = `
    SELECT *
    FROM tasks
    WHERE user_id = $1
    ORDER BY created_at DESC
  `;

    const result = await pool.query(query, [user_id]);
    return result.rows;
  }

  async toggleCompletedTask(taskId: number): Promise<void> {
    const query = `
            UPDATE tasks
            SET completed = NOT completed, completed_at = CASE WHEN NOT completed THEN NOW() ELSE NULL END
            WHERE id = $1
        `;

    await pool.query(query, [taskId]);
  }

  async toggleImportantTask(taskId: number): Promise<void> {
    const query = `
            UPDATE tasks
            SET important = NOT important
            WHERE id = $1
        `;

    await pool.query(query, [taskId]);
  }

  async updateTask(
    taskId: number,
    title: string,
    description: string,
    due_date: string | null,
  ): Promise<void> {
    const query = `
            UPDATE tasks
            SET title = $2, description = $3, due_date = $4
            WHERE id = $1
        `;

    await pool.query(query, [taskId, title, description, due_date]);
  }

  async deleteTask(taskId: number): Promise<void> {
    const query = `
            DELETE FROM tasks
            WHERE id = $1
        `;

    await pool.query(query, [taskId]);
  }
}
