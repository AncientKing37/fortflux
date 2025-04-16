import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return <footer className="bg-white text-black border-t border-yellow-500/20">      
      {/* Main Footer */}
      <div className="border-t border-yellow-500/20">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Column 1 - Logo and Info */}
            <div className="col-span-1 md:col-span-1">
              <Link to="/" className="text-2xl font-bold text-yellow-500 mb-4 inline-block">FortFlux</Link>
              <p className="text-gray-600 mt-2">
                The secure marketplace for buying and selling Fortnite accounts.
              </p>
            </div>
            
            {/* Column 2 - Links */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-yellow-500">Marketplace</h3>
              <ul className="space-y-2">
                <li><Link to="/marketplace" className="text-gray-600 hover:text-yellow-500 transition-colors">Browse Accounts</Link></li>
                <li><Link to="/sell" className="text-gray-600 hover:text-yellow-500 transition-colors">Sell Account</Link></li>
                <li><Link to="/featured" className="text-gray-600 hover:text-yellow-500 transition-colors">Featured Listings</Link></li>
              </ul>
            </div>
            
            {/* Column 3 - Links */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-yellow-500">Support</h3>
              <ul className="space-y-2">
                <li><Link to="/how-it-works" className="text-gray-600 hover:text-yellow-500 transition-colors">How It Works</Link></li>
                <li><Link to="/faq" className="text-gray-600 hover:text-yellow-500 transition-colors">FAQ</Link></li>
                <li><Link to="/contact" className="text-gray-600 hover:text-yellow-500 transition-colors">Contact Us</Link></li>
              </ul>
            </div>
            
            {/* Column 4 - Links */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-yellow-500">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/terms" className="text-gray-600 hover:text-yellow-500 transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy" className="text-gray-600 hover:text-yellow-500 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/disclaimer" className="text-gray-600 hover:text-yellow-500 transition-colors">Disclaimer</Link></li>
              </ul>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="mt-8 pt-8 border-t border-yellow-500/20 text-center text-gray-600">
            <p>© {new Date().getFullYear()} FortFlux. All rights reserved.</p>
            <p className="text-sm text-gray-500 mt-2">
              Disclaimer: FortFlux is not affiliated with Epic Games or Fortnite. This is a demo project.
            </p>
          </div>
        </div>
      </div>
    </footer>;
};

export default Footer;
