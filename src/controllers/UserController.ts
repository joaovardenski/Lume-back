import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { getErrorMessage } from "../utils/ErrorMessage";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      const user = await this.userService.register(name, email, password);

      return res.status(201).json(user);
    } catch (error) {
      return res.status(400).json({
        error: getErrorMessage(error),
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const { user, token } = await this.userService.login(email, password);

      res.cookie("access_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 30,
      });

      return res.status(200).json({
        user,
      });
    } catch (error) {
      return res.status(400).json({
        error: getErrorMessage(error),
      });
    }
  }

  async logout(req: Request, res: Response) {
    res.clearCookie("access_token", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(204).send();
  }

  async createRecoverToken(req: Request, res: Response) {
    try {
      const { email } = req.body;

      await this.userService.createRecoverToken(email);

      return res.status(200).json({
        message: "If this email exists, a recovery link was sent.",
      });
    } catch (error) {
      return res.status(200).json({
        message: "If this email exists, a recovery link was sent.",
      });
    }
  }

  async me(req: Request, res: Response) {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({
          error: "User not authenticated",
        });
      }

      const user = await this.userService.getMe(userId);

      return res.status(200).json(user);
    } catch (error) {
      return res.status(401).json({
        error: getErrorMessage(error),
      });
    }
  }
}
