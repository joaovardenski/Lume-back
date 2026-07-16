import { Request, Response } from "express";
import { UserService } from "../services/UserService";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();

    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.createRecoverToken = this.createRecoverToken.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.me = this.me.bind(this);
  }

  async register(req: Request, res: Response) {
    const { name, email, password } = req.body;

    const user = await this.userService.register(name, email, password);

    return res.status(201).json(user);
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const { user, token } = await this.userService.login(email, password);

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    return res.status(200).json({ user });
  }

  async logout(req: Request, res: Response) {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    return res.status(204).send();
  }

  async createRecoverToken(req: Request, res: Response) {
    const { email } = req.body;

    // Segurança: nunca revela se o email existe
    await this.userService.createRecoverToken(email);

    return res.status(200).json({
      message: "If this email exists, a recovery link was sent.",
    });
  }

  async resetPassword(req: Request, res: Response) {
    const { token, newPassword } = req.body;

    await this.userService.resetPassword(token, newPassword);

    return res.status(200).json({
      message: "Password reset successfully",
    });
  }

  async me(req: Request, res: Response) {
    const userId = req.userId;

    const user = await this.userService.getMe(userId);

    return res.status(200).json(user);
  }
}
