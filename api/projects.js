module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

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
};

