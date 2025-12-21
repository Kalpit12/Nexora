const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const nodemailer = require('nodemailer');
const { generateChecklistPDF } = require('./checklist-generator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Debug: Check if environment variables are loaded
console.log('Environment check:');
console.log('GEMINI_API_KEY present:', !!process.env.GEMINI_API_KEY);
console.log('GEMINI_API_KEY length:', process.env.GEMINI_API_KEY?.length || 0);

// Initialize Google Gemini AI (Free tier available)
const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

if (!genAI) {
  console.warn('⚠️  WARNING: Gemini AI not initialized. Make sure GEMINI_API_KEY is set in .env file.');
}

// Initialize Nodemailer for email sending
let transporter = null;
if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  console.log('✅ Email transporter initialized');
} else {
  console.warn('⚠️  WARNING: Email not configured. Set EMAIL_HOST, EMAIL_USER, and EMAIL_PASS in .env file.');
  console.warn('   Lead magnet emails will be logged to console only.');
}

// Create downloads directory if it doesn't exist
const downloadsDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use('/downloads', express.static(downloadsDir));

// API Routes
app.get('/api/projects', (req, res) => {
  const projects = [
    {
      id: 1,
      title: 'E-commerce Platform',
      description: 'A full-featured online store with payment integration',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      image: 'ecommerce.jpg',
      category: 'fullstack'
    },
    // More projects will be added here
  ];
  res.json(projects);
});

// Contact form endpoint
app.post('/api/contact', (req, res) => {
  // In a real app, you would save this to a database and/or send an email
  console.log('Contact form submission:', req.body);
  res.json({ success: true, message: 'Thank you for your message! We will get back to you soon.' });
});

// Lead Magnet endpoint - Capture email and send PDF
app.post('/api/lead-magnet', async (req, res) => {
  try {
    const { name, email, company } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name and email are required' 
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

    console.log(`📧 Lead captured: ${name} (${email})${company ? ` - ${company}` : ''}`);

    // Generate PDF checklist
    const pdfFileName = `website-speed-checklist-${Date.now()}.pdf`;
    const pdfPath = path.join(downloadsDir, pdfFileName);

    try {
      await generateChecklistPDF(pdfPath);
      console.log(`✅ PDF generated: ${pdfPath}`);
    } catch (pdfError) {
      console.error('Error generating PDF:', pdfError);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to generate checklist. Please try again later.' 
      });
    }

    // Send email with PDF attachment
    if (transporter) {
      try {
        const mailOptions = {
          from: `"NEXORA DIGITAL" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: 'Your Free Website Speed Optimization Checklist',
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
                  <p>We're excited to share your <strong>Website Speed Optimization Checklist</strong> with you!</p>
                  <p>This comprehensive guide includes:</p>
                  <ul>
                    <li>20+ optimization strategies</li>
                    <li>Step-by-step implementation guide</li>
                    <li>Performance monitoring tips</li>
                    <li>SEO improvement techniques</li>
                  </ul>
                  <p>The checklist is attached to this email. Download it and start optimizing your website today!</p>
                  <p>If you have any questions or need help implementing these strategies, feel free to reply to this email.</p>
                  <p>Best regards,<br><strong>The NEXORA DIGITAL Team</strong></p>
                </div>
                <div class="footer">
                  <p>NEXORA DIGITAL | www.nexoradigital.com</p>
                  <p>You received this email because you requested our free checklist.</p>
                </div>
              </div>
            </body>
            </html>
          `,
          attachments: [
            {
              filename: 'Website-Speed-Optimization-Checklist-2025.pdf',
              path: pdfPath
            }
          ]
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully to ${email}`);

        // Also send notification to admin (optional)
        if (process.env.ADMIN_EMAIL) {
          const adminMailOptions = {
            from: `"NEXORA DIGITAL" <${process.env.EMAIL_USER}>`,
            to: process.env.ADMIN_EMAIL,
            subject: 'New Lead: Website Speed Checklist Download',
            html: `
              <h2>New Lead Captured</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
              <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            `
          };
          await transporter.sendMail(adminMailOptions);
        }

      } catch (emailError) {
        console.error('Error sending email:', emailError);
        // Still return success if PDF was generated, but log the error
        // You might want to save the lead to a database here
      }
    } else {
      console.log('⚠️  Email not configured. PDF generated but not sent.');
      // In production, you should save leads to a database
    }

    // Return success response
    res.json({ 
      success: true, 
      message: 'Checklist sent to your email!',
      downloadUrl: `/downloads/${pdfFileName}` // Optional: direct download link
    });

  } catch (error) {
    console.error('Lead magnet error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'An error occurred. Please try again later.' 
    });
  }
});

// Chatbot endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.trim() === '') {
      console.error('Gemini API key is missing or empty');
      return res.status(500).json({ 
        error: 'Gemini API key not configured. Please set GEMINI_API_KEY in your .env file. Get a free API key at: https://makersuite.google.com/app/apikey' 
      });
    }

    if (!genAI) {
      return res.status(500).json({ 
        error: 'Gemini AI not initialized. Please check your GEMINI_API_KEY.' 
      });
    }

    // Get the generative model
    // Try different model names - the API key from Google AI Studio should work with gemini-pro
    // If models are not found, you may need to enable "Generative Language API" in Google Cloud Console
    let model;
    const modelNames = ['gemini-pro', 'models/gemini-pro'];
    
    for (const modelName of modelNames) {
      try {
        model = genAI.getGenerativeModel({ model: modelName });
        console.log(`Successfully initialized model: ${modelName}`);
        break;
      } catch (initError) {
        console.log(`Failed to initialize ${modelName}, trying next...`);
        if (modelNames.indexOf(modelName) === modelNames.length - 1) {
          // Last model failed, throw helpful error
          throw new Error(`Unable to initialize any Gemini model. Please ensure:
1. Your API key is valid
2. "Generative Language API" is enabled in Google Cloud Console (https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com)
3. Your API key has the necessary permissions. Error: ${initError.message}`);
        }
      }
    }

    // Build conversation context
    let conversationContext = 'You are a helpful AI assistant for NEXORA DIGITAL, a web development agency. You help answer questions about web development, digital services, and the company. Be friendly, professional, and concise.\n\n';
    
    // Add conversation history if available
    if (history && Array.isArray(history) && history.length > 0) {
      const recentHistory = history.slice(-6); // Last 6 messages for context
      conversationContext += 'Previous conversation:\n';
      recentHistory.forEach(msg => {
        if (msg.role === 'user') {
          conversationContext += `User: ${msg.content}\n`;
        } else if (msg.role === 'assistant') {
          conversationContext += `Assistant: ${msg.content}\n`;
        }
      });
      conversationContext += '\n';
    }

    // Add current message
    const fullPrompt = conversationContext + `User: ${message}\nAssistant:`;

    console.log('Sending request to Gemini API...');
    console.log('API Key present:', !!process.env.GEMINI_API_KEY);
    console.log('Message length:', message.length);
    
    // Call Gemini API
    console.log('Attempting to generate content with model...');
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const text = response.text();
    console.log('Successfully received response from Gemini API');

    console.log('Gemini API response received');

    res.json({ 
      success: true, 
      response: text 
    });

  } catch (error) {
    console.error('Chat API error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error status:', error.status);
    console.error('Error code:', error.code);
    
    // Handle Gemini API errors
    if (error.status) {
      const errorMessage = error.message || 'Gemini API error occurred';
      console.error('Gemini API Error (status):', errorMessage);
      return res.status(error.status || 500).json({ 
        error: errorMessage
      });
    }
    
    // Handle errors with response property
    if (error.response) {
      const errorData = error.response.data || error.response;
      const errorMessage = errorData?.error?.message || error.message || 'Gemini API error occurred';
      const statusCode = error.response.status || error.status || 500;
      console.error('Gemini API Error (response):', errorMessage);
      return res.status(statusCode).json({ 
        error: errorMessage
      });
    }

    // Handle other errors
    const errorMessage = error.message || 'An error occurred while processing your message. Please try again.';
    console.error('General Error:', errorMessage);
    
    res.status(500).json({ 
      error: errorMessage
    });
  }
});

// Serve static files (CSS, JS, images, etc.)
app.use(express.static(__dirname));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
} else {
  // In development, serve the index.html file
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
