
import React from 'react';

interface Props {
  onClick: () => void;
  className?: string;
}

const BackButton: React.FC<Props> = ({ onClick, className = '' }) => {
  return (
    <button 
      onClick={onClick}
      className={`fixed top-[5.5rem] left-4 md:top-24 md:left-8 z-[45] bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-100 dark:border-gray-700 p-2.5 rounded-xl shadow-lg hover:bg-ino-red hover:text-white dark:hover:bg-ino-red transition-all transform active:scale-95 group flex items-center justify-center gap-2 dark:text-white ${className}`}
      aria-label="Go Back"
    >
      <i className="ph-bold ph-arrow-left text-lg group-hover:-translate-x-0.5 transition-transform"></i>
      <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Back</span>
    </button>
  );
};

export default BackButton;
