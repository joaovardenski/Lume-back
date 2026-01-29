export function passwordRecoveryEmailTemplate(
  name: string,
  resetLink: string
) {
  return `
    <div style="
      font-family: Arial, Helvetica, sans-serif;
      background-color: #f6f7f9;
      padding: 40px 0;
    ">
      <div style="
        max-width: 520px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 8px;
        padding: 32px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      ">
        <h2 style="
          margin-top: 0;
          color: #111827;
          text-align: center;
        ">
          Lume
        </h2>

        <p style="color: #374151; font-size: 15px;">
          Hello <strong>${name}</strong>,
        </p>

        <p style="color: #374151; font-size: 15px; line-height: 1.5;">
          We received a request to reset your password.
          Click the button below to create a new one.
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a
            href="${resetLink}"
            style="
              background-color: #6366f1;
              color: #ffffff;
              padding: 14px 24px;
              border-radius: 6px;
              text-decoration: none;
              font-weight: bold;
              display: inline-block;
            "
          >
            Reset password
          </a>
        </div>

        <p style="color: #374151; font-size: 14px; line-height: 1.5;">
          This link will expire in <strong>15 minutes</strong>.
        </p>

        <p style="color: #6b7280; font-size: 13px; line-height: 1.5;">
          If the button above doesn’t work, copy and paste this link into your browser:
        </p>

        <p style="
          word-break: break-all;
          font-size: 13px;
        ">
          <a href="${resetLink}" style="color: #6366f1;">
            ${resetLink}
          </a>
        </p>

        <p style="color: #6b7280; font-size: 13px; line-height: 1.5;">
          If you didn’t request a password reset, you can safely ignore this email.
        </p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />

        <p style="color: #9ca3af; font-size: 12px; text-align: center;">
          © ${new Date().getFullYear()} Lume. All rights reserved.
        </p>
      </div>
    </div>
  `;
}
