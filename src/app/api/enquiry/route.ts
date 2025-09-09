import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, 
      email, 
      phone, 
      subject, 
      message, 
      propertyType, 
      budget, 
      location, 
      bhkType, 
      preferredContact,
      type 
    } = body;

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

    // Email content for enquiry
    const mailOptions = {
      from: process.env.SMTP_FROM || 'princekumarshah12@gmail.com',
      to: process.env.SMTP_TO || 'princekumarshah12@gmail.com',
      replyTo: email,
      subject: `Property Enquiry: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f97316; border-bottom: 2px solid #f97316; padding-bottom: 10px;">
            New Property Enquiry
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Contact Details</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Preferred Contact:</strong> ${preferredContact || 'Email'}</p>
          </div>

          <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Property Requirements</h3>
            <p><strong>Property Type:</strong> ${propertyType || 'Not specified'}</p>
            <p><strong>BHK Type:</strong> ${bhkType || 'Not specified'}</p>
            <p><strong>Budget Range:</strong> ${budget || 'Not specified'}</p>
            <p><strong>Preferred Location:</strong> ${location || 'Not specified'}</p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h3 style="color: #333; margin-top: 0;">Message</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #fef3c7; border-radius: 8px;">
            <p style="margin: 0; color: #92400e; font-size: 14px;">
              <strong>Note:</strong> This property enquiry was submitted from the Aspire Property Management website.
            </p>
          </div>
        </div>
      `,
      text: `
        New Property Enquiry
        
        Contact Details:
        Name: ${name}
        Email: ${email}
        Phone: ${phone || 'Not provided'}
        Subject: ${subject}
        Preferred Contact: ${preferredContact || 'Email'}
        
        Property Requirements:
        Property Type: ${propertyType || 'Not specified'}
        BHK Type: ${bhkType || 'Not specified'}
        Budget Range: ${budget || 'Not specified'}
        Preferred Location: ${location || 'Not specified'}
        
        Message:
        ${message}
        
        ---
        This property enquiry was submitted from the Aspire Property Management website.
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Send confirmation email to user
    const confirmationMailOptions = {
      from: process.env.SMTP_FROM || 'princekumarshah12@gmail.com',
      to: email,
      subject: 'Thank you for your Property Enquiry - Aspire Property Management',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f97316; border-bottom: 2px solid #f97316; padding-bottom: 10px;">
            Thank You for Your Property Enquiry!
          </h2>
          
          <p>Dear ${name},</p>
          
          <p>Thank you for your interest in our property services. We have received your enquiry and our expert team will get back to you within 24 hours with personalized property recommendations.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Your Enquiry Details</h3>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Property Type:</strong> ${propertyType || 'Not specified'}</p>
            <p><strong>BHK Type:</strong> ${bhkType || 'Not specified'}</p>
            <p><strong>Budget Range:</strong> ${budget || 'Not specified'}</p>
            <p><strong>Preferred Location:</strong> ${location || 'Not specified'}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          
          <p>In the meantime, feel free to:</p>
          <ul>
            <li>Browse our <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/properties-listing" style="color: #f97316;">property listings</a></li>
            <li>Use our <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/tools/property-valuation" style="color: #f97316;">property valuation tool</a></li>
            <li>Check out our <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/services" style="color: #f97316;">services</a></li>
            <li>Call us directly at <strong>+91 8080 190190</strong></li>
          </ul>
          
          <div style="background-color: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #1976d2; margin-top: 0;">What happens next?</h4>
            <ol style="color: #333;">
              <li>Our property expert will review your requirements</li>
              <li>We'll shortlist properties matching your criteria</li>
              <li>We'll contact you via ${preferredContact || 'email'} to discuss options</li>
              <li>We'll arrange site visits for properties of interest</li>
            </ol>
          </div>
          
          <p>Best regards,<br>
          <strong>Aspire Property Management Team</strong></p>
          
          <div style="margin-top: 30px; padding: 15px; background-color: #f3f4f6; border-radius: 8px; font-size: 12px; color: #6b7280;">
            <p style="margin: 0;">This is an automated response. Please do not reply to this email.</p>
          </div>
        </div>
      `,
      text: `
        Thank You for Your Property Enquiry - Aspire Property Management!
        
        Dear ${name},
        
        Thank you for your interest in our property services. We have received your enquiry and our expert team will get back to you within 24 hours with personalized property recommendations.
        
        Your Enquiry Details:
        Subject: ${subject}
        Property Type: ${propertyType || 'Not specified'}
        BHK Type: ${bhkType || 'Not specified'}
        Budget Range: ${budget || 'Not specified'}
        Preferred Location: ${location || 'Not specified'}
        Message: ${message}
        
        What happens next?
        1. Our property expert will review your requirements
        2. We'll shortlist properties matching your criteria
        3. We'll contact you via ${preferredContact || 'email'} to discuss options
        4. We'll arrange site visits for properties of interest
        
        In the meantime, feel free to:
        - Browse our property listings
        - Use our property valuation tool
        - Check out our services
        - Call us directly at +91 8080 190190
        
        Best regards,
        Aspire Property Management Team
        
        ---
        This is an automated response. Please do not reply to this email.
      `
    };

    // Send confirmation email
    await transporter.sendMail(confirmationMailOptions);

    return NextResponse.json(
      { message: 'Enquiry submitted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error sending enquiry:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      response: error.response
    });
    return NextResponse.json(
      { 
        error: 'Failed to submit enquiry',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
