const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');

// Generate PDF in memory (for serverless)
function generateChecklistPDFBuffer() {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      });

      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header
      doc.fontSize(24)
         .fillColor('#6366f1')
         .text('Website Speed Optimization', 50, 50, { align: 'center' })
         .text('Checklist 2025', 50, 80, { align: 'center' });

      doc.fontSize(12)
         .fillColor('#64748b')
         .text('A comprehensive guide to improve your website performance', 50, 120, { align: 'center' });

      // Line separator
      doc.moveTo(50, 150)
         .lineTo(545, 150)
         .strokeColor('#e2e8f0')
         .lineWidth(1)
         .stroke();

      let yPosition = 180;

      // Section 1: Image Optimization
      doc.fontSize(16)
         .fillColor('#1e293b')
         .text('1. Image Optimization', 50, yPosition, { bold: true });
      yPosition += 30;

      const imageOptimization = [
        'Compress images before uploading (use tools like TinyPNG, ImageOptim)',
        'Use modern formats (WebP, AVIF) instead of JPEG/PNG',
        'Implement lazy loading for images below the fold',
        'Set proper image dimensions (avoid oversized images)',
        'Use responsive images with srcset attribute',
        'Optimize image alt text for SEO',
        'Remove unused images from your website'
      ];

      imageOptimization.forEach((item) => {
        doc.fontSize(11)
           .fillColor('#475569')
           .text(`☐ ${item}`, 70, yPosition);
        yPosition += 25;
      });

      yPosition += 10;

      // Section 2: Code Optimization
      doc.fontSize(16)
         .fillColor('#1e293b')
         .text('2. Code Optimization', 50, yPosition, { bold: true });
      yPosition += 30;

      const codeOptimization = [
        'Minify CSS, JavaScript, and HTML files',
        'Remove unused CSS and JavaScript code',
        'Enable Gzip or Brotli compression on server',
        'Combine multiple CSS/JS files into single files',
        'Use CSS/JS bundlers (Webpack, Vite, Parcel)',
        'Remove inline styles and scripts where possible',
        'Optimize critical CSS (above-the-fold content)',
        'Defer non-critical JavaScript loading'
      ];

      codeOptimization.forEach((item) => {
        doc.fontSize(11)
           .fillColor('#475569')
           .text(`☐ ${item}`, 70, yPosition);
        yPosition += 25;
      });

      yPosition += 10;

      // Section 3: Caching
      doc.fontSize(16)
         .fillColor('#1e293b')
         .text('3. Browser & Server Caching', 50, yPosition, { bold: true });
      yPosition += 30;

      const caching = [
        'Set proper cache headers (Cache-Control, Expires)',
        'Implement browser caching for static assets',
        'Use CDN (Content Delivery Network) for global reach',
        'Enable server-side caching (Redis, Memcached)',
        'Cache database queries when possible',
        'Set cache expiration times appropriately'
      ];

      caching.forEach((item) => {
        doc.fontSize(11)
           .fillColor('#475569')
           .text(`☐ ${item}`, 70, yPosition);
        yPosition += 25;
      });

      yPosition += 10;

      // Section 4: Performance Monitoring
      doc.fontSize(16)
         .fillColor('#1e293b')
         .text('4. Performance Monitoring', 50, yPosition, { bold: true });
      yPosition += 30;

      const monitoring = [
        'Use Google PageSpeed Insights regularly',
        'Monitor Core Web Vitals (LCP, FID, CLS)',
        'Set up Google Analytics for performance tracking',
        'Use tools like GTmetrix, WebPageTest',
        'Monitor server response times',
        'Track page load times and optimize slow pages'
      ];

      monitoring.forEach((item) => {
        doc.fontSize(11)
           .fillColor('#475569')
           .text(`☐ ${item}`, 70, yPosition);
        yPosition += 25;
      });

      yPosition += 10;

      // Section 5: SEO Improvements
      doc.fontSize(16)
         .fillColor('#1e293b')
         .text('5. SEO & User Experience', 50, yPosition, { bold: true });
      yPosition += 30;

      const seo = [
        'Optimize meta tags and descriptions',
        'Improve mobile responsiveness',
        'Ensure fast mobile page speeds',
        'Use semantic HTML5 elements',
        'Optimize font loading (use font-display: swap)',
        'Reduce HTTP requests (combine resources)',
        'Optimize third-party scripts loading'
      ];

      seo.forEach((item) => {
        doc.fontSize(11)
           .fillColor('#475569')
           .text(`☐ ${item}`, 70, yPosition);
        yPosition += 25;
      });

      // Footer
      const pageHeight = doc.page.height;
      doc.fontSize(10)
         .fillColor('#94a3b8')
         .text('Generated by NEXORA DIGITAL', 50, pageHeight - 80, { align: 'center' })
         .text('www.nexoradigital.com', 50, pageHeight - 60, { align: 'center' })
         .text('© 2025 NEXORA DIGITAL. All rights reserved.', 50, pageHeight - 40, { align: 'center' });

      doc.end();

    } catch (error) {
      reject(error);
    }
  });
}

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

    // Generate PDF in memory
    let pdfBuffer;
    try {
      pdfBuffer = await generateChecklistPDFBuffer();
      console.log(`✅ PDF generated in memory`);
    } catch (pdfError) {
      console.error('Error generating PDF:', pdfError);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to generate checklist. Please try again later.' 
      });
    }

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
              content: pdfBuffer
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
      }
    } else {
      console.log('⚠️  Email not configured. PDF generated but not sent.');
    }

    // Return success response
    res.json({ 
      success: true, 
      message: 'Checklist sent to your email!'
    });

  } catch (error) {
    console.error('Lead magnet error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'An error occurred. Please try again later.' 
    });
  }
};

