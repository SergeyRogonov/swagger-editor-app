import { describe, it, expect, vi, beforeEach } from "vitest";
import sendEmail from "./sendEmail";
import nodemailer from "nodemailer";

vi.mock("nodemailer");

describe("sendEmail", () => {
  const mockSendMail = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(nodemailer.createTransport).mockReturnValue({
      sendMail: mockSendMail,
    } as unknown as nodemailer.Transporter);
    process.env.EMAIL_USER = "test@server.com";
  });

  it("sends email successfully", async () => {
    mockSendMail.mockResolvedValue({});

    await sendEmail("test@example.com", "Subject", "<p>HTML</p>");

    expect(mockSendMail).toHaveBeenCalledWith({
      from: `Server <${process.env.EMAIL_USER}>`,
      to: "test@example.com",
      subject: "Subject",
      html: "<p>HTML</p>",
    });
  });
});
