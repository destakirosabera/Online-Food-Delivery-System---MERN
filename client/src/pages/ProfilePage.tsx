
import React from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import BackButton from '../components/common/BackButton';

interface Props {
  onBack: () => void;
}

const ProfilePage: React.FC<Props> = ({ onBack }) => {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 relative">
      <BackButton onClick={onBack} />
      
      <div className="pl-16 md:pl-0">
        <h1 className="text-4xl font-black text-admas-blue mb-8">My Profile</h1>
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
              <p className="text-lg font-bold text-gray-900">{user?.name}</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
              <p className="text-lg font-bold text-gray-900">{user?.email}</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Account Type</label>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${user?.isAdmin ? 'bg-ino-yellow text-admas-blue' : 'bg-blue-100 text-blue-700'}`}>
                {user?.isAdmin ? 'Administrator' : 'Customer'}
              </span>
            </div>
            <div className="pt-6 border-t border-gray-100">
              <Button variant="outline" className="w-full">Edit Profile Information</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
