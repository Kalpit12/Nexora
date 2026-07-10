// Project page URLs mapping
const projectPages = {
    corporate: 'projects/corporate.html',
    akshar: 'projects/aksharjobs.html',
    aksharevents: 'projects/aksharevents.html',
    inventory: 'projects/inventory.html',
    velora: 'projects/velora.html',
    restaurant: 'projects/restaurant.html',
    healthcare: 'projects/healthcare.html',
    analytics: 'projects/analytics.html',
    leadora: 'projects/leadora.html',
    ecommerce: 'projects/ecommerce.html',
    webapp: 'projects/webapp.html',
    mobile: 'projects/mobile.html'
};

// Navigate portfolio items to detail pages
document.addEventListener('DOMContentLoaded', () => {
    const portfolioItems = document.querySelectorAll('.portfolio-item[data-project]');

    portfolioItems.forEach(item => {
        const projectId = item.getAttribute('data-project');
        const pageUrl = item.getAttribute('data-url') || projectPages[projectId];

        if (!pageUrl) return;

        item.addEventListener('click', (e) => {
            if (e.target.closest('a')) return;
            window.location.href = pageUrl;
        });
    });
});
