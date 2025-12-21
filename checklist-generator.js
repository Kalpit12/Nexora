const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Generates a Website Speed Optimization Checklist PDF
 * @param {string} outputPath - Path where the PDF should be saved
 * @returns {Promise<string>} - Path to the generated PDF
 */
function generateChecklistPDF(outputPath) {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                size: 'A4',
                margins: { top: 50, bottom: 50, left: 50, right: 50 }
            });

            // Create directory if it doesn't exist
            const dir = path.dirname(outputPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            const stream = fs.createWriteStream(outputPath);
            doc.pipe(stream);

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

            imageOptimization.forEach((item, index) => {
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

            stream.on('finish', () => {
                resolve(outputPath);
            });

            stream.on('error', (error) => {
                reject(error);
            });

        } catch (error) {
            reject(error);
        }
    });
}

module.exports = { generateChecklistPDF };

