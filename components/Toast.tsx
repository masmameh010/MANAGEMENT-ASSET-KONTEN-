
import React from 'react';
import { ToastMessage } from '../types';
import { CheckCircle, Info, AlertCircle } from 'lucide-react';

const Toast: React.FC<{ message: ToastMessage }> = ({ message }) => {
  const icons = {
    success: <CheckCircle className="text-emerald-500" size={18} />,
    info: <Info className="text-indigo-500" size={18} />,
    error: <AlertCircle className="text-rose-500" size={18} />
  };

  const bgStyles = {
    success: 'bg-emerald-50 border-emerald-100',
    info: 'bg-indigo-50 border-indigo-100',
    error: 'bg-rose-50 border-rose-100'
  };

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-xl animate-in slide-in-from-right-full ${bgStyles[message.type]}`}>
      {icons[message.type]}
      <p className="text-sm font-semibold text-slate-700">{message.text}</p>
    </div>
  );
};

export default Toast;
