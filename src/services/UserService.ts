import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";

import { AppError } from "../errors/AppError";
import { MailService } from "./MailService";
import { UserRepository } from "../repositories/UserRepository";
import { passwordRecoveryEmailTemplate } from "../utils/MailUtils";

dotenv.config();

export class UserService {
  private userRepository: UserRepository;
  private mailService: MailService;

  constructor() {
    this.userRepository = new UserRepository();
    this.mailService = new MailService();
  }

  async register(name: string, email: string, password: string) {
    if (!name || !email || !password) {
      throw new AppError("Invalid credentials", 400);
    }

    const userAlreadyExists = await this.userRepository.findByEmail(email);
    if (userAlreadyExists) {
      throw new AppError("User already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepository.createUser({
      name,
      email,
      password: hashedPassword,
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(email: string, password: string) {
    if (!email || !password) {
      throw new AppError("Invalid credentials", 400);
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "30d" },
    );

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async createRecoverToken(email: string) {
    if (!email) {
      return;
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user) return;

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15);

    await this.userRepository.invalidatePreviousTokens(user.id);
    await this.userRepository.storePasswordResetToken(
      user.id,
      token,
      expiresAt,
    );

    const resetLink = `${process.env.FRONT_URL}/recover-password?token=${token}`;

    await this.mailService.send({
      to: user.email,
      subject: "Lume Password recovery",
      html: passwordRecoveryEmailTemplate(user.name, resetLink),
    });
  }

  async resetPassword(token: string | null, newPassword: string) {
    if (!token || !newPassword) {
      throw new AppError("Invalid request", 400);
    }

    if (newPassword.length < 8) {
      throw new AppError("Password must be at least 8 characters", 400);
    }

    const user = await this.userRepository.findByValidResetToken(token);
    if (!user) {
      throw new AppError("Invalid or expired token", 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.userRepository.updatePassword(user.id, hashedPassword);
    await this.userRepository.invalidatePreviousTokens(user.id);
  }

  async getMe(userId?: number) {
    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
