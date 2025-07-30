import { Leaf, Twitter, Facebook, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  const footerSections = [
    {
      title: "Features",
      links: [
        "AI Item Analysis",
        "Eco Alternatives", 
        "CO2 Calculator",
        "Rewards System",
      ],
    },
    {
      title: "Resources",
      links: [
        "Sustainability Guide",
        "Environmental News",
        "Community Events", 
        "API Documentation",
      ],
    },
    {
      title: "Company",
      links: [
        "About Us",
        "Privacy Policy",
        "Terms of Service",
        "Contact",
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-eco-primary rounded-full flex items-center justify-center">
                <Leaf className="text-white" size={16} />
              </div>
              <span className="text-xl font-bold text-white">Eco Guardian</span>
            </div>
            <p className="text-gray-400 mb-4">
              AI-powered waste reduction for a sustainable future. Making eco-friendly choices easier, one item at a time.
            </p>
            <div className="flex space-x-4">
              <button className="text-gray-400 hover:text-eco-primary transition-colors">
                <Twitter size={20} />
              </button>
              <button className="text-gray-400 hover:text-eco-primary transition-colors">
                <Facebook size={20} />
              </button>
              <button className="text-gray-400 hover:text-eco-primary transition-colors">
                <Instagram size={20} />
              </button>
              <button className="text-gray-400 hover:text-eco-primary transition-colors">
                <Linkedin size={20} />
              </button>
            </div>
          </div>
          
          {footerSections.map((section, index) => (
            <div key={index}>
              <h5 className="text-white font-semibold mb-4">{section.title}</h5>
              <ul className="space-y-2 text-gray-400">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <button className="hover:text-eco-primary transition-colors">
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Eco Guardian. All rights reserved. Built with sustainability in mind.</p>
        </div>
      </div>
    </footer>
  );
}
