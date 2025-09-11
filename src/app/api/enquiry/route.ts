import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

/**
 * Enquiry API Route
 * Handles consultation form submissions and sends emails via SMTP
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, mobileNumber, email, whatsappUpdates, userType } = body;

    // Validate required fields
    if (!fullName || !mobileNumber || !email || !userType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Mobile number validation - exactly 10 digits starting with 6-9
    const cleanMobile = mobileNumber.replace(/\D/g, '');
    if (cleanMobile.length !== 10 || !/^[6-9]\d{9}$/.test(cleanMobile)) {
      return NextResponse.json(
        { error: 'Invalid mobile number format. Please enter a valid 10-digit Indian mobile number starting with 6-9.' },
        { status: 400 }
      );
    }

    // Create transporter using Gmail SMTP (same as contact route)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'princekumarshah12@gmail.com',
        pass: 'dbkoucndnlutnkbu' // App password without spaces
      }
    });

    // Email content for admin notification
    const adminEmailContent = `
      <h2>New Consultation Request</h2>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Mobile:</strong> ${mobileNumber}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>User Type:</strong> ${userType.charAt(0).toUpperCase() + userType.slice(1)}</p>
      <p><strong>WhatsApp Updates:</strong> ${whatsappUpdates ? 'Yes' : 'No'}</p>
      <p><strong>Submitted At:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
    `;

    // Email content for user confirmation
    const userEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f97316, #ea580c); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">NewAspireProp</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Thank you for your interest!</p>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Consultation Request Received</h2>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
            Dear ${fullName},
          </p>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
            Thank you for requesting our FREE expert consultation! We have received your request and our team will contact you within 24 hours.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f97316;">
            <h3 style="color: #1f2937; margin-bottom: 15px;">Your Details:</h3>
            <p style="margin: 5px 0; color: #4b5563;"><strong>Name:</strong> ${fullName}</p>
            <p style="margin: 5px 0; color: #4b5563;"><strong>Mobile:</strong> ${mobileNumber}</p>
            <p style="margin: 5px 0; color: #4b5563;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 5px 0; color: #4b5563;"><strong>User Type:</strong> ${userType.charAt(0).toUpperCase() + userType.slice(1)}</p>
            ${whatsappUpdates ? '<p style="margin: 5px 0; color: #4b5563;"><strong>WhatsApp Updates:</strong> Enabled</p>' : ''}
          </div>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
            Our expert team will provide personalized guidance based on your requirements and help you make informed decisions about your real estate needs.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="tel:+918080190190" style="background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
              Call Us: +91 8080 190190
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
            If you have any immediate questions, feel free to call us directly. We're here to help you with all your real estate needs.
          </p>
        </div>
        
        <div style="background: #1f2937; padding: 20px; text-align: center; color: #9ca3af;">
          <p style="margin: 0; font-size: 14px;">
            © 2025 NewAspireProp Management. All rights reserved.
          </p>
        </div>
      </div>
    `;

    // Send notification to admin
    const adminMailOptions = {
      from: 'princekumarshah12@gmail.com',
      to: 'princekumarshah12@gmail.com', // Admin email
      subject: `New Consultation Request - ${fullName} (${userType})`,
      html: adminEmailContent,
    };

    await transporter.sendMail(adminMailOptions);

    // Send confirmation to user
    const userMailOptions = {
      from: 'princekumarshah12@gmail.com',
      to: email,
      subject: 'Thank you for your consultation request - NewAspireProp',
      html: userEmailContent,
    };

    await transporter.sendMail(userMailOptions);

    return NextResponse.json(
      { message: 'Enquiry submitted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing enquiry:', error);
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