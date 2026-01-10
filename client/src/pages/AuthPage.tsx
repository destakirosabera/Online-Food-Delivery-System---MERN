
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import BackButton from '../components/common/BackButton';
import Button from '../components/common/Button';
import { useToast } from '../context/ToastContext';

interface Props {
  onBack: () => void;
}

const AuthPage: React.FC<Props> = ({ onBack }) => {
  const { login, signup } = useAuth();
  const { showToast } = useToast();
  
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isStrongPassword = (p: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(p);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    
    if (isLogin) {
      const response = await login(email, pass);
      if (response.success) {
        showToast(response.role === 'admin' ? "Access Hub Authorized" : "Secure Session Started", "success");
      } else {
        setErrorMsg(response.message || "Credential Mismatch: Access Denied.");
        showToast(response.message || "Login failed", "error");
      }
    } else {
      if (!isStrongPassword(pass)) {
        setErrorMsg("Weak Password: Use 8+ chars, 1 Uppercase, 1 Number, and 1 Special Character.");
        setLoading(false);
        return;
      }
      const success = await signup({ name, email, password: pass, phone });
      if (success) {
        showToast("Profile registry complete", "success");
      } else {
        setErrorMsg("Identifier Error: Email already in system registry.");
        showToast("Registration failed", "error");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative bg-gray-50 dark:bg-ino-dark overflow-hidden transition-colors duration-300">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
         <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-ino-red/10 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-ino-yellow/10 rounded-full blur-[120px]"></div>
      </div>

      <BackButton onClick={onBack} />
      
      <div className="w-full max-w-md bg-white p-10 rounded-[3.5rem] shadow-2xl border border-gray-100 dark:border-white/5 relative z-10 transition-transform hover:scale-[1.01] duration-500">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-ino-red rounded-3xl flex items-center justify-center text-white mx-auto mb-8 shadow-xl transform -rotate-6 transition-transform hover:rotate-0 duration-500">
            <i className={`ph-fill ${isLogin ? 'ph-lock-key' : 'ph-user-plus'} text-4xl`}></i>
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-2 uppercase tracking-tighter">
            {isLogin ? 'Auth Gate' : 'Join Network'}
          </h2>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 leading-relaxed">
            {isLogin ? 'Secure Entry: Please verify your logistics credentials' : 'Registry: Create a strong unique password to join our supply chain'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMsg && (
            <div className="p-5 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase text-center border border-red-100 animate-in fade-in slide-in-from-top-2">
              <i className="ph ph-warning-circle mb-1 block text-lg"></i>
              {errorMsg}
            </div>
          )}

          {!isLogin && (
            <>
              <input 
                type="text" placeholder="Legal Name" 
                className="w-full p-5 rounded-2xl bg-gray-50 border border-gray-100 outline-none text-xs font-bold text-black placeholder:text-gray-400 focus:ring-2 ring-ino-red/20 transition-all"
                required value={name} onChange={e => setName(e.target.value)}
              />
              <input 
                type="text" placeholder="Contact Mobile" 
                className="w-full p-5 rounded-2xl bg-gray-50 border border-gray-100 outline-none text-xs font-bold text-black placeholder:text-gray-400 focus:ring-2 ring-ino-red/20 transition-all"
                required value={phone} onChange={e => setPhone(e.target.value)}
              />
            </>
          )}

          <input 
            type="email" placeholder="Email Identifier" 
            className="w-full p-5 rounded-2xl bg-gray-50 border border-gray-100 outline-none text-xs font-bold text-black placeholder:text-gray-400 focus:ring-2 ring-ino-red/20 transition-all"
            required value={email} onChange={e => setEmail(e.target.value)}
          />

          <input 
            type="password" placeholder="Secure Secret Key" 
            className="w-full p-5 rounded-2xl bg-gray-50 border border-gray-100 outline-none text-xs font-bold text-black placeholder:text-gray-400 focus:ring-2 ring-ino-red/20 transition-all"
            required value={pass} onChange={e => setPass(e.target.value)}
          />
          
          <Button type="submit" loading={loading} className="w-full py-6 rounded-3xl text-[11px] uppercase font-black tracking-widest bg-ino-red text-white hover:bg-red-700 shadow-lg mt-4 shadow-red-500/20 active:scale-95 transition-all">
            {isLogin ? 'Access Portal' : 'Register Profile'}
          </Button>
        </form>

        <div className="mt-10 text-center pt-8 border-t border-gray-100">
          <p className="text-[10px] text-gray-400 font-bold uppercase mb-4">
            {isLogin ? "No active profile?" : "Profile already registered?"}
          </p>
          <button 
            onClick={() => { setIsLogin(!isLogin); setErrorMsg(null); }}
            className="text-[10px] font-black text-ino-red uppercase tracking-widest hover:underline transition-colors hover:text-red-700"
          >
            {isLogin ? "Join Dispatch" : "Access Hub"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
