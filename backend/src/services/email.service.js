import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
};

export const sendAppointmentConfirmationToDoctor = async (emailData) => {
  try {
    const {
      doctorEmail,
      doctorName,
      patientName,
      patientEmail,
      patientPhone,
      appointmentDate,
      duration,
      hospitalName,
      notes,
    } = emailData;

    const transporter = createTransporter();

    const formattedDate = new Date(appointmentDate).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; color: white; text-align: center; border-radius: 5px 5px 0 0;">
          <h2 style="margin: 0;">Appointment Confirmed</h2>
          <p style="margin: 5px 0 0 0;">Hospital Management System</p>
        </div>
        
        <div style="padding: 30px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 0 0 5px 5px;">
          <p style="font-size: 16px; color: #333;">Dear <strong>${doctorName}</strong>,</p>
          
          <p style="color: #666; line-height: 1.6;">
            An appointment has been confirmed by the hospital administrator. Please find the details below:
          </p>
          
          <div style="background-color: white; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 4px;">
            <h3 style="margin-top: 0; color: #667eea;">Appointment Details</h3>
            
            <table style="width: 100%; color: #333;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 150px;">Hospital:</td>
                <td style="padding: 8px 0;">${hospitalName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Patient Name:</td>
                <td style="padding: 8px 0;">${patientName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Patient Email:</td>
                <td style="padding: 8px 0;">
                  <a href="mailto:${patientEmail}" style="color: #667eea; text-decoration: none;">${patientEmail}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Patient Phone:</td>
                <td style="padding: 8px 0;">
                  <a href="tel:${patientPhone}" style="color: #667eea; text-decoration: none;">${patientPhone}</a>
                </td>
              </tr>
              <tr style="background-color: #f0f0f0;">
                <td style="padding: 8px 0; font-weight: bold;">Appointment Date & Time:</td>
                <td style="padding: 8px 0; color: #667eea; font-weight: bold;">${formattedDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Duration:</td>
                <td style="padding: 8px 0;">${duration} minutes</td>
              </tr>
              ${notes ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Notes:</td>
                <td style="padding: 8px 0;">${notes}</td>
              </tr>
              ` : ''}
            </table>
          </div>
          
          <div style="background-color: #fffbea; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #856404;">
              <strong>⚠️ Important:</strong> Please ensure you are available at the scheduled time. 
              If you need to reschedule or cancel, please contact the hospital administrator immediately.
            </p>
          </div>
          
          <p style="color: #666; margin: 20px 0; line-height: 1.6;">
            Thank you for your service. If you have any questions, please contact the hospital administrator.
          </p>
          
          <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 20px;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              This is an automated email from the Hospital Management System. 
              Please do not reply to this email.
            </p>
            <p style="color: #999; font-size: 12px; margin: 5px 0 0 0;">
              © ${new Date().getFullYear()} Hospital Management Tenant. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: doctorEmail,
      subject: `Appointment Confirmed - ${patientName}`,
      html: htmlTemplate,
    };

    const result = await transporter.sendMail(mailOptions);

    return {
      success: true,
      messageId: result.messageId,
      message: 'Email sent successfully',
    };
  } catch (error) {
    console.error('Error sending appointment confirmation email:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to send email',
    };
  }
};

export const sendAppointmentCancellationToDoctor = async (emailData) => {
  try {
    const { doctorEmail, doctorName, patientName, appointmentDate, hospitalName, cancellationReason } = emailData;

    const transporter = createTransporter();

    const formattedDate = new Date(appointmentDate).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; color: white; text-align: center; border-radius: 5px 5px 0 0;">
          <h2 style="margin: 0;">Appointment Cancelled</h2>
          <p style="margin: 5px 0 0 0;">Hospital Management System</p>
        </div>
        
        <div style="padding: 30px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 0 0 5px 5px;">
          <p style="font-size: 16px; color: #333;">Dear <strong>${doctorName}</strong>,</p>
          
          <p style="color: #666; line-height: 1.6;">
            An appointment has been cancelled. Please find the details below:
          </p>
          
          <div style="background-color: white; border-left: 4px solid #dc3545; padding: 20px; margin: 20px 0; border-radius: 4px;">
            <h3 style="margin-top: 0; color: #dc3545;">Cancelled Appointment Details</h3>
            
            <table style="width: 100%; color: #333;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 150px;">Hospital:</td>
                <td style="padding: 8px 0;">${hospitalName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Patient Name:</td>
                <td style="padding: 8px 0;">${patientName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Appointment Date & Time:</td>
                <td style="padding: 8px 0;">${formattedDate}</td>
              </tr>
              ${cancellationReason ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Reason:</td>
                <td style="padding: 8px 0;">${cancellationReason}</td>
              </tr>
              ` : ''}
            </table>
          </div>
          
          <p style="color: #666; margin: 20px 0; line-height: 1.6;">
            The appointment slot is now available for other patients. 
            If you have any questions, please contact the hospital administrator.
          </p>
          
          <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 20px;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              This is an automated email from the Hospital Management System. 
              Please do not reply to this email.
            </p>
            <p style="color: #999; font-size: 12px; margin: 5px 0 0 0;">
              © ${new Date().getFullYear()} Hospital Management Tenant. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: doctorEmail,
      subject: `Appointment Cancelled - ${patientName}`,
      html: htmlTemplate,
    };

    const result = await transporter.sendMail(mailOptions);

    return {
      success: true,
      messageId: result.messageId,
      message: 'Cancellation email sent successfully',
    };
  } catch (error) {
    console.error('Error sending appointment cancellation email:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to send cancellation email',
    };
  }
};
