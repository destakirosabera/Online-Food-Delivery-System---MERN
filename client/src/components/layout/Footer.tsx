
import React from 'react';

interface Props {
  onNavigate: (page: any) => void;
}

const Footer: React.FC<Props> = ({ onNavigate }) => {
  return (
    <footer className="bg-ino-dark text-gray-400 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-ino-red p-1.5 rounded-lg">
                <i className="ph-fill ph-moped text-white text-xl"></i>
              </div>
              <span className="font-black text-xl tracking-tight text-white">
                IN-N-OUT <span className="text-ino-red">DELIVERY</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm text-gray-500">
              Premium urban food logistics platform providing rapid delivery solutions 
              for modern city life. Quality, speed, and reliability in every order.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Service</h4>
            <ul className="space-y-4 text-sm">
              <li><button onClick={() => onNavigate('about')} className="hover:text-ino-yellow transition">Our Mission</button></li>
              <li><button onClick={() => onNavigate('support')} className="hover:text-ino-yellow transition">Support Center</button></li>
              <li><button onClick={() => onNavigate('menu')} className="hover:text-ino-yellow transition">Order Tracking</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Company</h4>
            <p className="text-sm">In-N-Out Logistics</p>
            <p className="text-sm">Partner Relations</p>
            <p className="text-sm mb-4">Operations Center</p>
            <div className="flex gap-4">
              <i className="ph ph-instagram-logo text-2xl hover:text-white transition cursor-pointer"></i>
              <i className="ph ph-facebook-logo text-2xl hover:text-white transition cursor-pointer"></i>
              <i className="ph ph-twitter-logo text-2xl hover:text-white transition cursor-pointer"></i>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-xs text-center">
          &copy; 2025 In-N-Out Food Delivery. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
