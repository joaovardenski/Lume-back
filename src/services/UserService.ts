import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { MailService } from "./MailService";
import { UserRepository } from "../repositories/UserRepository";
import dotenv from "dotenv";

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
      throw new Error("Invalid credentials");
    }

    const userAlreadyExists = await this.userRepository.findByEmail(email);
    if (userAlreadyExists) {
      throw new Error("User alredy exists");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

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
      throw new Error("Invalid credentials");
    }

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
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
      throw new Error("Email is required");
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user) return

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15); // 15 min

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
      html: `
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">Reset password</a>
        <p>This link expires in 15 minutes.</p>
      `,
    });
  }

  async getMe(userId: number) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const { password: _, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }
}
