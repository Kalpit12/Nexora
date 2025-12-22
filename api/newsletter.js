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

    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email is required' 
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

    console.log(`📧 Newsletter subscription: ${email}`);

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

    // Send welcome email to subscriber
    if (transporter) {
      try {
        const welcomeMailOptions = {
          from: `"NEXORA DIGITAL" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: 'Welcome to NEXORA DIGITAL Newsletter! 🎉',
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
                .benefits { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .benefits ul { margin: 10px 0; padding-left: 20px; }
                .benefits li { margin-bottom: 8px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Welcome to Our Newsletter! 🎉</h1>
                </div>
                <div class="content">
                  <p>Thank you for subscribing to the <strong>NEXORA DIGITAL</strong> newsletter!</p>
                  <p>We're excited to share the latest updates, insights, and tips about web development, digital marketing, and growing your online presence.</p>
                  
                  <div class="benefits">
                    <h3 style="color: #6366f1; margin-top: 0;">What you'll receive:</h3>
                    <ul>
                      <li>📊 Latest web development trends and technologies</li>
                      <li>💡 Digital marketing tips and strategies</li>
                      <li>🚀 Website optimization techniques</li>
                      <li>📈 Case studies and success stories</li>
                      <li>🎁 Exclusive offers and early access to new services</li>
                      <li>📝 Free resources and guides</li>
                    </ul>
                  </div>

                  <p>Stay tuned for our first newsletter coming soon!</p>
                  <p>In the meantime, check out our website to learn more about our services:</p>
                  <p style="text-align: center;">
                    <a href="https://nexora-gilt.vercel.app/" class="button">Visit Our Website</a>
                  </p>
                  <p>If you have any questions or need help with your digital presence, feel free to reach out:</p>
                  <p>
                    📧 Email: info@nexoradigital.com<br>
                    📞 Phone: +254 112440306, +254 789098686
                  </p>
                  <p>Best regards,<br><strong>The NEXORA DIGITAL Team</strong></p>
                </div>
                <div class="footer">
                  <p>NEXORA DIGITAL | <a href="https://nexora-gilt.vercel.app/">nexora-gilt.vercel.app</a></p>
                  <p>You can unsubscribe at any time by replying to this email.</p>
                </div>
              </div>
            </body>
            </html>
          `
        };

        await transporter.sendMail(welcomeMailOptions);
        console.log(`✅ Welcome email sent to ${email}`);

        // Optional: Send notification to admin
        if (process.env.ADMIN_EMAIL) {
          const adminMailOptions = {
            from: `"NEXORA DIGITAL" <${process.env.EMAIL_USER}>`,
            to: process.env.ADMIN_EMAIL,
            subject: 'New Newsletter Subscription',
            html: `
              <h2>New Newsletter Subscriber</h2>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            `
          };
          await transporter.sendMail(adminMailOptions);
        }

      } catch (emailError) {
        console.error('Error sending newsletter emails:', emailError);
        // Still return success if email fails, but log the error
      }
    } else {
      console.log('⚠️  Email not configured. Newsletter subscription logged but welcome email not sent.');
    }

    // Return success response
    res.json({ 
      success: true, 
      message: 'Successfully subscribed to our newsletter! Check your email for a welcome message.' 
    });

  } catch (error) {
    console.error('Newsletter API error:', error);
    res.status(500).json({ 
      success: false,
      error: 'An error occurred while processing your subscription. Please try again later.' 
    });
  }
};

