// Email adapter -- placeholder for Resend, SendGrid, or similar.
// All emails are drafted here. The actual sending is gated (Gate E).

interface EmailParams {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

// PLACEHOLDER: Replace with real email provider.
// For Resend: npm install resend
// import { Resend } from "resend";
// const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(params: EmailParams): Promise<boolean> {
  // Placeholder implementation -- logs instead of sending
  console.log(`[Email] DRAFT -> To: ${params.to} | Subject: ${params.subject}`);
  console.log(`[Email] Body: ${params.text.slice(0, 200)}...`);

  // Real implementation would be:
  // await resend.emails.send({
  //   from: "Audit Service <noreply@yourdomain.com>",
  //   to: params.to,
  //   subject: params.subject,
  //   text: params.text,
  //   html: params.html,
  // });

  return true;
}

export async function sendOrderConfirmationEmail(orderId: string, customerEmail: string, intakeUrl: string): Promise<boolean> {
  return sendEmail({
    to: customerEmail,
    subject: "Order received -- next step: complete your intake form",
    text: `Your order ${orderId} has been received.\n\nPlease complete your intake form here: ${intakeUrl}\n\nOnce we receive your intake info, we'll start your audit within 24 hours.`,
  });
}

export async function sendDeliveryEmail(customerEmail: string, packageName: string, artifactUrl: string, followUpDays: number = 7): Promise<boolean> {
  return sendEmail({
    to: customerEmail,
    subject: `Your ${packageName} audit is ready`,
    text: `Your ${packageName} audit report is ready.\n\nDownload your report: ${artifactUrl}\n\nYou have ${followUpDays} days to reply with follow-up questions. After that, the order is considered complete.\n\nIf you need implementation help, reply to let us know about our fixed-price sprint options.`,
  });
}

export async function sendIntakeReminderEmail(customerEmail: string, intakeUrl: string, daysSincePayment: number): Promise<boolean> {
  return sendEmail({
    to: customerEmail,
    subject: "Reminder: Complete your audit intake form",
    text: `It's been ${daysSincePayment} days since your payment. Please complete your intake form so we can start your audit: ${intakeUrl}`,
  });
}
