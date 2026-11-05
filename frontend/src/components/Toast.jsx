import React from 'react';
import { useCrypto } from '../context/CryptoContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = () => {
  const { toasts } = useCrypto();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div key={toast.id} className={`toast-card toast-${toast.type || 'info'}`}>
            <div className="toast-icon">
              {isSuccess && <CheckCircle2 size={18} className="text-emerald-400" />}
              {isError && <AlertCircle size={18} className="text-rose-400" />}
              {!isSuccess && !isError && <Info size={18} className="text-cyan-400" />}
            </div>
            <div className="toast-message">{toast.message}</div>
          </div>
        );
      })}
    </div>
  );
};
