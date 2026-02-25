import { TasksService } from "./TasksService";
import { AppError } from "../errors/AppError";


const mockTasksRepository = {
  createTask: jest.fn(),
  getTasks: jest.fn(),
  toggleCompletedTask: jest.fn(),
  toggleImportantTask: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
};

jest.mock("../repositories/TasksRepository", () => ({
  TasksRepository: jest.fn().mockImplementation(() => mockTasksRepository),
}));


const makeTask = (overrides = {}) => ({
  id: 1,
  userId: 1,
  title: "Test Task",
  description: "Description",
  important: false,
  completed: false,
  dueDate: null,
  ...overrides,
});

describe("TasksService", () => {
  let service: TasksService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new TasksService();
  });


  describe("createTask", () => {
    it("should throw if user not authenticated", async () => {
      await expect(
        service.createTask(0, "Test", false, false)
      ).rejects.toThrow("User not authenticated");
    });

    it("should throw if title is missing", async () => {
      await expect(
        service.createTask(1, "", false, false)
      ).rejects.toThrow("Title is required");
    });

    it("should throw if title is too short", async () => {
      await expect(
        service.createTask(1, "ab", false, false)
      ).rejects.toThrow("Title must be between 3 and 150 characters");
    });

    it("should create task successfully without due date", async () => {
      mockTasksRepository.createTask.mockResolvedValue(makeTask());

      const result = await service.createTask(
        1,
        "Valid Title",
        false,
        false
      );

      expect(mockTasksRepository.createTask).toHaveBeenCalledWith(
        1,
        "Valid Title",
        false,
        null
      );

      expect(result).toEqual(makeTask());
    });

    it("should create task with due date when hasDate is true", async () => {
      mockTasksRepository.createTask.mockResolvedValue(makeTask());

      await service.createTask(1, "Valid Title", false, true);

      expect(mockTasksRepository.createTask).toHaveBeenCalled();

      const dueDateArg =
        mockTasksRepository.createTask.mock.calls[0][3];

      expect(dueDateArg).toBeInstanceOf(Date);
    });
  });


  describe("getTasks", () => {
    it("should throw if user not authenticated", async () => {
      await expect(service.getTasks(0))
        .rejects
        .toThrow("User not authenticated");
    });

    it("should return tasks successfully", async () => {
      mockTasksRepository.getTasks.mockResolvedValue([
        makeTask(),
      ]);

      const result = await service.getTasks(1);

      expect(mockTasksRepository.getTasks).toHaveBeenCalledWith(1);
      expect(result).toHaveLength(1);
    });
  });


  describe("toggleCompletedTask", () => {
    it("should throw if taskId is invalid", async () => {
      await expect(
        service.toggleCompletedTask(0)
      ).rejects.toThrow("Invalid task id");
    });

    it("should call repository toggleCompletedTask", async () => {
      mockTasksRepository.toggleCompletedTask.mockResolvedValue(
        makeTask({ completed: true })
      );

      await service.toggleCompletedTask(1);

      expect(
        mockTasksRepository.toggleCompletedTask
      ).toHaveBeenCalledWith(1);
    });
  });


  describe("toggleImportantTask", () => {
    it("should throw if taskId is invalid", async () => {
      await expect(
        service.toggleImportantTask(0)
      ).rejects.toThrow("Invalid task id");
    });

    it("should call repository toggleImportantTask", async () => {
      mockTasksRepository.toggleImportantTask.mockResolvedValue(
        makeTask({ important: true })
      );

      await service.toggleImportantTask(1);

      expect(
        mockTasksRepository.toggleImportantTask
      ).toHaveBeenCalledWith(1);
    });
  });


  describe("updateTask", () => {
    it("should throw if taskId is invalid", async () => {
      await expect(
        service.updateTask(0, "Valid", "", null)
      ).rejects.toThrow("Invalid task id");
    });

    it("should throw if title is invalid", async () => {
      await expect(
        service.updateTask(1, "ab", "", null)
      ).rejects.toThrow("Title must be between 3 and 150 characters");
    });

    it("should call repository updateTask", async () => {
      mockTasksRepository.updateTask.mockResolvedValue(
        makeTask({ title: "Updated" })
      );

      await service.updateTask(
        1,
        "Updated",
        "Desc",
        null
      );

      expect(
        mockTasksRepository.updateTask
      ).toHaveBeenCalledWith(
        1,
        "Updated",
        "Desc",
        null
      );
    });
  });


  describe("deleteTask", () => {
    it("should throw if taskId is invalid", async () => {
      await expect(
        service.deleteTask(0)
      ).rejects.toThrow("Invalid task id");
    });

    it("should call repository deleteTask", async () => {
      mockTasksRepository.deleteTask.mockResolvedValue(
        makeTask()
      );

      await service.deleteTask(1);

      expect(
        mockTasksRepository.deleteTask
      ).toHaveBeenCalledWith(1);
    });
  });
});