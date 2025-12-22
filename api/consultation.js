const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  try {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, phone, projectType, message } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !projectType || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'All fields are required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid email format' 
      });
    }

    // Validate phone format (basic validation)
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid phone number format' 
      });
    }

    console.log(`📞 Consultation request: ${name} (${email}) - ${phone} - ${projectType}`);

    // Initialize Nodemailer for email sending
    let transporter = null;
    if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT || 587,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    }

    // Send email notification to admin
    if (transporter) {
      try {
        // Email to admin
        const adminMailOptions = {
          from: `"NEXORA DIGITAL" <${process.env.EMAIL_USER}>`,
          to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
          subject: `New Consultation Request: ${projectType}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
                .field { margin-bottom: 15px; }
                .field-label { font-weight: 600; color: #6366f1; }
                .field-value { margin-top: 5px; color: #333; }
                .message-box { background: white; padding: 15px; border-left: 4px solid #6366f1; margin-top: 10px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>New Consultation Request</h1>
                </div>
                <div class="content">
                  <div class="field">
                    <div class="field-label">Name:</div>
                    <div class="field-value">${name}</div>
                  </div>
                  <div class="field">
                    <div class="field-label">Email:</div>
                    <div class="field-value"><a href="mailto:${email}">${email}</a></div>
                  </div>
                  <div class="field">
                    <div class="field-label">Phone:</div>
                    <div class="field-value"><a href="tel:${phone}">${phone}</a></div>
                  </div>
                  <div class="field">
                    <div class="field-label">Project Type:</div>
                    <div class="field-value">${projectType}</div>
                  </div>
                  <div class="field">
                    <div class="field-label">Message:</div>
                    <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
                  </div>
                  <div class="field">
                    <div class="field-label">Date:</div>
                    <div class="field-value">${new Date().toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </body>
            </html>
          `
        };

        await transporter.sendMail(adminMailOptions);
        console.log(`✅ Admin notification sent for consultation request from ${email}`);

        // Confirmation email to user
        const userMailOptions = {
          from: `"NEXORA DIGITAL" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: 'Thank You for Your Consultation Request - NEXORA DIGITAL',
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
                .button { display: inline-block; padding: 12px 30px; background: #6366f1; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Thank You, ${name}!</h1>
                </div>
                <div class="content">
                  <p>We've received your consultation request for <strong>${projectType}</strong> and we're excited to help you transform your digital presence!</p>
                  <p>Our team will review your request and get back to you within <strong>24 hours</strong> to schedule your free 30-minute consultation.</p>
                  <p>In the meantime, feel free to:</p>
                  <ul>
                    <li>Visit our website: <a href="https://nexora-gilt.vercel.app/">nexora-gilt.vercel.app</a></li>
                    <li>Check out our portfolio and case studies</li>
                    <li>Use our cost calculator to get an instant estimate</li>
                  </ul>
                  <p>If you have any urgent questions, you can reach us at:</p>
                  <p>
                    📧 Email: info@nexoradigital.com<br>
                    📞 Phone: +254 112440306, +254 789098686
                  </p>
                  <p>We look forward to working with you!</p>
                  <p>Best regards,<br><strong>The NEXORA DIGITAL Team</strong></p>
                </div>
                <div class="footer">
                  <p>NEXORA DIGITAL | <a href="https://nexora-gilt.vercel.app/">nexora-gilt.vercel.app</a></p>
                  <p>You received this email because you requested a free consultation.</p>
                </div>
              </div>
            </body>
            </html>
          `
        };

        await transporter.sendMail(userMailOptions);
        console.log(`✅ Confirmation email sent to ${email}`);

      } catch (emailError) {
        console.error('Error sending consultation emails:', emailError);
        // Still return success if email fails, but log the error
      }
    } else {
      console.log('⚠️  Email not configured. Consultation request logged but not sent.');
    }

    // Return success response
    res.json({ 
      success: true, 
      message: 'Thank you for your consultation request! We will contact you within 24 hours.' 
    });

  } catch (error) {
    console.error('Consultation API error:', error);
    res.status(500).json({ 
      success: false,
      error: 'An error occurred while processing your request. Please try again later.' 
    });
  }
};

