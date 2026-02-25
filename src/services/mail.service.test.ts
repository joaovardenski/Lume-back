import { MailService } from "./MailService";
import { Resend } from "resend";

jest.mock("resend");

describe("MailService", () => {
  const sendMock = jest.fn();

  beforeEach(() => {
    process.env.RESEND_API_KEY = "fake-api-key";
    process.env.MAIL_FROM = "test@email.com";

    (Resend as jest.Mock).mockImplementation(() => ({
      emails: {
        send: sendMock,
      },
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call resend with correct parameters", async () => {
    const mailService = new MailService();

    await mailService.send({
      to: "user@email.com",
      subject: "Test Subject",
      html: "<p>Hello</p>",
    });

    expect(sendMock).toHaveBeenCalledWith({
      from: "test@email.com",
      to: "user@email.com",
      subject: "Test Subject",
      html: "<p>Hello</p>",
    });

    expect(sendMock).toHaveBeenCalledTimes(1);
  });
});