import { pool } from "../config/database";

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

export class UserRepository {
  async createUser(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> {
    const query = `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const result = await pool.query(query, [
      userData.name,
      userData.email,
      userData.password,
    ]);

    return result.rows[0];
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = `
      SELECT *
      FROM users
      WHERE email = $1
    `;

    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  async findById(id: number): Promise<User | null> {
    const query = `
    SELECT *
    FROM users
    WHERE id = $1
  `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  async invalidatePreviousTokens(userId: number): Promise<void> {
    const query = `
      UPDATE password_resets
      SET valid = FALSE
      WHERE user_id = $1 AND valid = TRUE
    `;

    await pool.query(query, [userId]);
  }

  async storePasswordResetToken(
    userId: number,
    token: string,
    expiresAt: Date,
  ): Promise<void> {
    const query = `
      INSERT INTO password_resets (user_id, token, expires_at, valid)
      VALUES ($1, $2, $3, TRUE)
    `;

    await pool.query(query, [userId, token, expiresAt]);
  }
}
