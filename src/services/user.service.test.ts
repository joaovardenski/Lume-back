import { UserService } from "./UserService";
import { AppError } from "../errors/AppError";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

const mockUserRepository = {
  findByEmail: jest.fn(),
  createUser: jest.fn(),
  findByValidResetToken: jest.fn(),
  updatePassword: jest.fn(),
  invalidatePreviousTokens: jest.fn(),
  storePasswordResetToken: jest.fn(),
  findById: jest.fn(),
};

const mockMailService = {
  send: jest.fn(),
};

jest.mock("../repositories/UserRepository", () => ({
  UserRepository: jest.fn().mockImplementation(() => mockUserRepository),
}));

jest.mock("./MailService", () => ({
  MailService: jest.fn().mockImplementation(() => mockMailService),
}));


const makeUser = (overrides = {}) => ({
  id: 1,
  name: "John",
  email: "john@email.com",
  password: "hashed",
  ...overrides,
});

describe("UserService", () => {
  let service: UserService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new UserService();

    process.env.JWT_SECRET = "secret";
    process.env.FRONT_URL = "http://localhost:3000";
  });


  describe("register", () => {
    it("should throw if missing credentials", async () => {
      await expect(service.register("", "", ""))
        .rejects
        .toThrow(AppError);
    });

    it("should throw if user already exists", async () => {
      mockUserRepository.findByEmail.mockResolvedValue(makeUser());

      await expect(
        service.register("John", "john@email.com", "12345678")
      ).rejects.toThrow("User already exists");
    });

    it("should create user successfully", async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashed");

      mockUserRepository.createUser.mockResolvedValue(makeUser());

      const result = await service.register(
        "John",
        "john@email.com",
        "12345678"
      );

      expect(mockUserRepository.createUser).toHaveBeenCalled();
      expect(result).not.toHaveProperty("password");
    });
  });


  describe("login", () => {
    it("should throw if invalid credentials", async () => {
      await expect(service.login("", ""))
        .rejects
        .toThrow("Invalid credentials");
    });

    it("should throw if user not found", async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(
        service.login("john@email.com", "123")
      ).rejects.toThrow("Invalid credentials");
    });

    it("should throw if password is incorrect", async () => {
      mockUserRepository.findByEmail.mockResolvedValue(makeUser());
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login("john@email.com", "123")
      ).rejects.toThrow("Invalid credentials");
    });

    it("should login successfully", async () => {
      mockUserRepository.findByEmail.mockResolvedValue(makeUser());
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("token");

      const result = await service.login(
        "john@email.com",
        "12345678"
      );

      expect(result.token).toBe("token");
      expect(result.user).not.toHaveProperty("password");
    });
  });


  describe("resetPassword", () => {
    it("should throw if password too short", async () => {
      await expect(
        service.resetPassword("token", "123")
      ).rejects.toThrow("Password must be at least 8 characters");
    });

    it("should throw if token is invalid", async () => {
      mockUserRepository.findByValidResetToken.mockResolvedValue(null);

      await expect(
        service.resetPassword("token", "12345678")
      ).rejects.toThrow("Invalid or expired token");
    });

    it("should reset password successfully", async () => {
      mockUserRepository.findByValidResetToken.mockResolvedValue({ id: 1 });
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashed");

      await service.resetPassword("token", "12345678");

      expect(mockUserRepository.updatePassword).toHaveBeenCalled();
      expect(mockUserRepository.invalidatePreviousTokens).toHaveBeenCalled();
    });
  });


  describe("getMe", () => {
    it("should throw if not authenticated", async () => {
      await expect(service.getMe())
        .rejects
        .toThrow("User not authenticated");
    });

    it("should throw if user not found", async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(service.getMe(1))
        .rejects
        .toThrow("User not found");
    });

    it("should return user without password", async () => {
      mockUserRepository.findById.mockResolvedValue(makeUser());

      const result = await service.getMe(1);

      expect(result).not.toHaveProperty("password");
    });
  });
});