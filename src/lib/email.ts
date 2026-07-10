import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendWelcomeEmail(to: string, name?: string) {
  const subject = "Welcome back to Twitter XI Five"
  const html = `
    <div style="background-color: #f7f9f9; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); text-align: center;">
        <h1 style="color: #1d9bf0; font-size: 28px; margin-bottom: 20px; font-weight: 700;">Welcome back!</h1>
        <p style="color: #0f1419; font-size: 18px; margin-bottom: 20px;">Hi ${name || 'there'},</p>
        <p style="color: #536471; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">Thanks for signing in to <strong>Twitter XI Five</strong>. We're thrilled to have you back! Enjoy the latest updates and personalized content waiting for you on your dashboard.</p>
        <a href="https://twitter-xi-five.vercel.app/" style="display: inline-block; background-color: #1d9bf0; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 9999px; font-weight: 700; font-size: 16px; transition: background-color 0.2s;">Go to Dashboard</a>
        <hr style="border: none; border-top: 1px solid #eff3f4; margin: 40px 0;" />
        <p style="color: #536471; font-size: 14px;">If you didn't sign in, please secure your account immediately.</p>
        <p style="color: #536471; font-size: 14px;">&copy; ${new Date().getFullYear()} Twitter XI Five. All rights reserved.</p>
      </div>
    </div>
  `

  return transporter.sendMail({
    from: process.env.EMAIL_FROM ?? `"Twitter XI Five" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  })
}

export async function sendOTPEmail(to: string, otp: string, type: string) {
  const subject = type === 'sign-in' ? "Your sign-in code for Twitter XI Five" : "Your verification code for Twitter XI Five";
  const html = `
    <div style="background-color: #f7f9f9; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); text-align: center;">
        <h1 style="color: #1d9bf0; font-size: 28px; margin-bottom: 20px; font-weight: 700;">Verify your email</h1>
        <p style="color: #536471; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">Use the verification code below to complete the process. This code is valid for a limited time.</p>
        <div style="background-color: #f7f9f9; padding: 20px; border-radius: 12px; margin-bottom: 30px; letter-spacing: 4px;">
          <span style="font-size: 32px; font-weight: 700; color: #0f1419;">${otp}</span>
        </div>
        <hr style="border: none; border-top: 1px solid #eff3f4; margin: 40px 0;" />
        <p style="color: #536471; font-size: 14px;">If you didn't request this code, you can safely ignore this email.</p>
        <p style="color: #536471; font-size: 14px;">&copy; ${new Date().getFullYear()} Twitter XI Five. All rights reserved.</p>
      </div>
    </div>
  `

  return transporter.sendMail({
    from: process.env.EMAIL_FROM ?? `"Twitter XI Five" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  })
}
