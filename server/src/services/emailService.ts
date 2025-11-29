import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASSWORD || 'your-app-password',
    },
  });
};

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    // If email credentials are not configured, log and return false
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log('Email not configured. Email would be sent to:', options.to);
      console.log('Subject:', options.subject);
      console.log('Body:', options.html);
      return false;
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', options.to);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export const sendRequestStatusEmail = async (
  email: string,
  fullname: string,
  status: string,
  assessment: string
): Promise<boolean> => {
  const statusMessages: { [key: string]: { subject: string; message: string; color: string } } = {
    approved: {
      subject: 'Request Approved - UCC Clinic',
      message: 'Your request has been approved. You can proceed with your assessment.',
      color: '#10b981', // green
    },
    rejected: {
      subject: 'Request Rejected - UCC Clinic',
      message: 'Your request has been rejected. Please contact the clinic for more information.',
      color: '#ef4444', // red
    },
    pending: {
      subject: 'Request Status Updated - UCC Clinic',
      message: 'Your request status has been reset to pending. It will be reviewed again.',
      color: '#f59e0b', // yellow
    },
    processing: {
      subject: 'Request Processing - UCC Clinic',
      message: 'Your request is now being processed. We will notify you once it is completed.',
      color: '#3b82f6', // blue
    },
  };

  const statusInfo = statusMessages[status] || {
    subject: 'Request Status Updated - UCC Clinic',
    message: `Your request status has been updated to ${status}.`,
    color: '#6b7280',
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h1 style="color: #2d5016; margin: 0;">University of Caloocan City Clinic</h1>
      </div>
      
      <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: ${statusInfo.color}; margin-top: 0;">Request Status Update</h2>
        
        <p>Dear ${fullname},</p>
        
        <p>We are writing to inform you about the status of your request:</p>
        
        <div style="background-color: ${statusInfo.color}15; border-left: 4px solid ${statusInfo.color}; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0;"><strong>Assessment:</strong> ${assessment}</p>
          <p style="margin: 10px 0 0 0;"><strong>Status:</strong> <span style="color: ${statusInfo.color}; font-weight: bold; text-transform: uppercase;">${status}</span></p>
        </div>
        
        <p>${statusInfo.message}</p>
        
        <p>If you have any questions or concerns, please contact the clinic:</p>
        <ul style="margin: 20px 0; padding-left: 20px;">
          <li>Phone: 8528-4654</li>
          <li>Email: admin@ucc-caloocan.edu.ph</li>
          <li>Location: Biglang Awa Street, Cor 11th Ave Catleya, Caloocan, 1400 Metro Manila</li>
        </ul>
        
        <p style="margin-top: 30px;">Best regards,<br>
        <strong>UCC Clinic Administration</strong></p>
      </div>
      
      <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
        <p>This is an automated email. Please do not reply to this message.</p>
        <p>&copy; ${new Date().getFullYear()} University of Caloocan City Clinic. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: email,
    subject: statusInfo.subject,
    html,
  });
};

