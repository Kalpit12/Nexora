// Case Studies Data and Modal Functionality
const caseStudies = {
    corporate: {
        title: "Corporate Website",
        category: "Web Development",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&q=80",
        challenge: "The client needed a modern, professional website to establish their online presence and attract new customers. The previous website was outdated and not mobile-responsive.",
        solution: "We designed and developed a fully responsive corporate website with a clean, professional design. Implemented a content management system for easy updates, optimized for search engines, and integrated contact forms and social media.",
        results: [
            "40% increase in website traffic",
            "60% improvement in mobile user engagement",
            "25% increase in contact form submissions"
        ],
        technologies: ["HTML5", "CSS3", "JavaScript", "WordPress", "PHP"]
    },
    akshar: {
        title: "AKSHAR JOBS",
        category: "Web App Development",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&q=80",
        challenge: "Creating a job portal that connects job seekers with employers efficiently, with features for job posting, application management, and user profiles.",
        solution: "Built a comprehensive job portal with user authentication, advanced search filters, resume builder, application tracking system, and employer dashboard for managing job postings and candidates.",
        results: [
            "500+ active job listings",
            "1,200+ registered users",
            "85% user satisfaction rate"
        ],
        technologies: ["React", "Node.js", "MongoDB", "Express", "JWT"]
    },
    inventory: {
        title: "Business Inventory Management System",
        category: "Web App for SMEs",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&q=80",
        challenge: "Small businesses needed an affordable, easy-to-use inventory management system to track stock, manage orders, and generate reports without complex software.",
        solution: "Developed a cloud-based inventory management system with real-time stock tracking, automated alerts for low inventory, sales reporting, and multi-user access with role-based permissions.",
        results: [
            "30% reduction in inventory costs",
            "50% faster order processing",
            "Real-time inventory visibility"
        ],
        technologies: ["React", "Node.js", "PostgreSQL", "REST API", "Chart.js"]
    },
    velora: {
        title: "VELORA",
        category: "Skincare Website",
        image: "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800&h=600&fit=crop&q=80",
        challenge: "A skincare brand needed an elegant, modern e-commerce website to showcase their products and provide an exceptional shopping experience that reflects their premium brand.",
        solution: "Created a beautiful, conversion-optimized e-commerce website with product galleries, detailed product pages, secure checkout, customer reviews, and integrated payment gateway. Focused on visual appeal and user experience.",
        results: [
            "35% increase in online sales",
            "45% improvement in conversion rate",
            "60% increase in average order value"
        ],
        technologies: ["React", "Next.js", "Stripe", "Shopify API", "Tailwind CSS"]
    },
    restaurant: {
        title: "Restaurant Ordering System",
        category: "Online Menu & Booking Platform",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop&q=80",
        challenge: "A restaurant needed an online ordering and table booking system to streamline operations, reduce phone orders, and improve customer experience.",
        solution: "Built a comprehensive platform with online menu, real-time table availability, online ordering with payment integration, order tracking, and admin dashboard for managing bookings and orders.",
        results: [
            "50% reduction in phone orders",
            "30% increase in online orders",
            "Improved customer satisfaction"
        ],
        technologies: ["Vue.js", "Node.js", "MongoDB", "Socket.io", "Payment Gateway"]
    },
    healthcare: {
        title: "Healthcare Appointment Booking",
        category: "Patient Portal & Scheduling",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop&q=80",
        challenge: "A healthcare facility needed a secure, user-friendly system for patients to book appointments online, reducing phone calls and administrative workload.",
        solution: "Developed a secure patient portal with appointment scheduling, patient registration, medical history access, appointment reminders via SMS/email, and integration with existing healthcare systems.",
        results: [
            "70% reduction in phone bookings",
            "40% improvement in appointment attendance",
            "Enhanced patient satisfaction"
        ],
        technologies: ["React", "Node.js", "PostgreSQL", "Twilio API", "HIPAA Compliance"]
    },
    analytics: {
        title: "Analytics Dashboard",
        category: "Data Visualization & Reporting",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&q=80",
        challenge: "A business needed a comprehensive analytics dashboard to visualize data from multiple sources, track KPIs, and make data-driven decisions.",
        solution: "Created an interactive dashboard with real-time data visualization, customizable charts and graphs, data export capabilities, automated reports, and multi-user access with different permission levels.",
        results: [
            "Faster decision-making with real-time data",
            "30% improvement in data accessibility",
            "Automated reporting saves 10+ hours/week"
        ],
        technologies: ["React", "D3.js", "Python", "REST API", "Chart.js"]
    }
};

// Initialize case study modals
document.addEventListener('DOMContentLoaded', () => {
    const portfolioItems = document.querySelectorAll('.portfolio-item[data-project]');
    const modal = document.getElementById('caseStudyModal');
    const modalOverlay = modal.querySelector('.modal-overlay');
    const modalClose = modal.querySelector('.modal-close');
    
    portfolioItems.forEach(item => {
        const viewDetailsBtn = item.querySelector('.view-details-btn');
        if (viewDetailsBtn) {
            viewDetailsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const projectId = item.getAttribute('data-project');
                openCaseStudy(projectId);
            });
        }
        
        // Also allow clicking the whole item
        item.addEventListener('click', () => {
            const projectId = item.getAttribute('data-project');
            if (projectId) {
                openCaseStudy(projectId);
            }
        });
    });
    
    function openCaseStudy(projectId) {
        const study = caseStudies[projectId];
        if (!study) return;
        
        document.getElementById('caseStudyImage').src = study.image;
        document.getElementById('caseStudyTitle').textContent = study.title;
        document.getElementById('caseStudyCategory').textContent = study.category;
        document.getElementById('caseStudyChallenge').textContent = study.challenge;
        document.getElementById('caseStudySolution').textContent = study.solution;
        
        const resultsHtml = '<ul>' + study.results.map(r => `<li>${r}</li>`).join('') + '</ul>';
        document.getElementById('caseStudyResults').innerHTML = resultsHtml;
        
        const techHtml = study.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('');
        document.getElementById('caseStudyTech').innerHTML = techHtml;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeCaseStudy() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    modalClose.addEventListener('click', closeCaseStudy);
    modalOverlay.addEventListener('click', closeCaseStudy);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeCaseStudy();
        }
    });
});

