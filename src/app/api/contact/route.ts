import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER || 'princekumarshah12@gmail.com',
        pass: process.env.SMTP_PASS || 'dbko ucnd nlut nkbu'
      }
    });

    // Email content
    const mailOptions = {
      from: process.env.SMTP_FROM || 'princekumarshah12@gmail.com',
      to: process.env.SMTP_TO || 'princekumarshah12@gmail.com', // Send to yourself
      replyTo: email, // User's email for replies
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f97316; border-bottom: 2px solid #f97316; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Contact Details</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h3 style="color: #333; margin-top: 0;">Message</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #fef3c7; border-radius: 8px;">
            <p style="margin: 0; color: #92400e; font-size: 14px;">
              <strong>Note:</strong> This message was sent from the Aspire Prop Management contact form.
            </p>
          </div>
        </div>
      `,
      text: `
        New Contact Form Submission
        
        Name: ${name}
        Email: ${email}
        Phone: ${phone || 'Not provided'}
        Subject: ${subject}
        
        Message:
        ${message}
        
        ---
        This message was sent from the Aspire Prop Management contact form.
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Send confirmation email to user
    const confirmationMailOptions = {
      from: process.env.SMTP_FROM || 'princekumarshah12@gmail.com',
      to: email,
      subject: 'Thank you for contacting Aspire Prop Management',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f97316; border-bottom: 2px solid #f97316; padding-bottom: 10px;">
            Thank You for Contacting Us!
          </h2>
          
          <p>Dear ${name},</p>
          
          <p>Thank you for reaching out to Aspire Prop Management. We have received your message and will get back to you within 24 hours.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Your Message Details</h3>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          
          <p>In the meantime, feel free to:</p>
          <ul>
            <li>Browse our <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/properties-listing" style="color: #f97316;">property listings</a></li>
            <li>Check out our <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/services" style="color: #f97316;">services</a></li>
            <li>Call us directly at <strong>+91 92262 54182</strong></li>
          </ul>
          
          <p>Best regards,<br>
          <strong>Aspire Prop Management Team</strong></p>
          
          <div style="margin-top: 30px; padding: 15px; background-color: #f3f4f6; border-radius: 8px; font-size: 12px; color: #6b7280;">
            <p style="margin: 0;">This is an automated response. Please do not reply to this email.</p>
          </div>
        </div>
      `,
      text: `
        Thank You for Contacting Aspire Prop Management!
        
        Dear ${name},
        
        Thank you for reaching out to Aspire Prop Management. We have received your message and will get back to you within 24 hours.
        
        Your Message Details:
        Subject: ${subject}
        Message: ${message}
        
        In the meantime, feel free to:
        - Browse our property listings
        - Check out our services  
        - Call us directly at +91 92262 54182
        
        Best regards,
        Aspire Prop Management Team
        
        ---
        This is an automated response. Please do not reply to this email.
      `
    };

    // Send confirmation email
    await transporter.sendMail(confirmationMailOptions);

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error sending email:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: (error as any)?.code,
      response: (error as any)?.response
    });
    return NextResponse.json(
      { 
        error: 'Failed to send email',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
      },
      { status: 500 }
    );
  }
}
