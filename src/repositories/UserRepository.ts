import { pool } from "../config/database";

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

interface PasswordResetInfo {
  id: number;
  reset_token_expires_at: Date;
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

  async findById(id: number | undefined): Promise<User | null> {
    if (id === undefined) return null;
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

  async findByValidResetToken(token: string): Promise<PasswordResetInfo | null> {
    const query = `
      SELECT u.id, pr.expires_at as reset_token_expires_at
      FROM users u
      JOIN password_resets pr ON u.id = pr.user_id
      WHERE pr.token = $1 AND pr.expires_at > NOW() AND pr.valid = TRUE
    `;

    const result = await pool.query(query, [token]);

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

  async updatePassword(userId: number, newPassword: string): Promise<void> {
    const query = `
      UPDATE users
      SET password = $1, updated_at = NOW()
      WHERE id = $2
    `;

    await pool.query(query, [newPassword, userId]);
  }
}
