
import React from 'react';
import Button from '../components/common/Button';
import BackButton from '../components/common/BackButton';

interface Props {
  onBack: () => void;
}

const SupportPage: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 relative">
      <BackButton onClick={onBack} />
      
      <div className="text-center mb-12 pl-16 md:pl-0">
        <h1 className="text-4xl font-black text-admas-blue mb-4 uppercase tracking-tight">Help & Support</h1>
        <p className="text-gray-500">How can we assist you with your order today?</p>
      </div>

      <div className="grid gap-6 pl-16 md:pl-0">
        <div className="bg-white p-6 rounded-2xl border hover:border-ino-red transition-all cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="bg-red-50 p-3 rounded-xl group-hover:bg-ino-red group-hover:text-white transition-colors">
              <i className="ph ph-question text-2xl"></i>
            </div>
            <div>
              <h3 className="font-bold">Order Tracking Help</h3>
              <p className="text-sm text-gray-500">Learn how to monitor your delivery status.</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border hover:border-ino-red transition-all cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-xl group-hover:bg-admas-blue group-hover:text-white transition-colors">
              <i className="ph ph-wallet text-2xl"></i>
            </div>
            <div>
              <h3 className="font-bold">Payment & Refunds</h3>
              <p className="text-sm text-gray-500">View policies regarding canceled orders.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 bg-admas-blue text-white p-8 rounded-3xl text-center">
        <h3 className="text-xl font-bold mb-4">Need immediate assistance?</h3>
        <p className="mb-6 opacity-80 font-medium">Our logistics team is available 24/7 during operating hours.</p>
        <Button variant="primary" className="mx-auto uppercase tracking-widest text-[10px]">
          Contact Dispatch
        </Button>
      </div>
    </div>
  );
};

export default SupportPage;
