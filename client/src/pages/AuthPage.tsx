
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import BackButton from '../components/common/BackButton';
import Button from '../components/common/Button';

interface Props {
  onBack: () => void;
}

const AuthPage: React.FC<Props> = ({ onBack }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, pass);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6 relative bg-gray-50">
      <BackButton onClick={onBack} />
      
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tight">
            {isLogin ? 'Sign In' : 'Join Us'}
          </h2>
          <p className="text-gray-400 text-sm font-medium">
            {isLogin ? 'Welcome back to In-N-Out' : 'Create an account to browse the full menu'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 ml-1">Full Name</label>
              <input 
                type="text" 
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-ino-red focus:bg-white transition-all font-medium" 
                placeholder="John Doe" 
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 ml-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-ino-red focus:bg-white transition-all font-medium" 
              placeholder="customer@example.com" 
              required 
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 ml-1">Password</label>
            <input 
              type="password" 
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-ino-red focus:bg-white transition-all font-medium" 
              placeholder="Minimum 8 characters" 
              required 
            />
          </div>
          
          <Button type="submit" className="w-full py-5 rounded-2xl text-sm uppercase tracking-widest shadow-lg">
            {isLogin ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-8 text-center border-t border-gray-100 pt-8">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-bold text-ino-red uppercase tracking-widest hover:underline"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
