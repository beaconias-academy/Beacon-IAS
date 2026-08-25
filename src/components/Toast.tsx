import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  icon?: string;
}

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error', icon?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success', icon?: string) => {
      const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
      const newToast: Toast = { id, message, type, icon };
      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3200);
    },
    []
  );

  const getColors = (type?: string) => {
    switch (type) {
      case 'warning':
        return 'bg-[#ffdad6] text-[#93000a] border-[#ba1a1a]/30';
      case 'error':
        return 'bg-[#ba1a1a] text-white border-[#ba1a1a]';
      case 'info':
        return 'bg-[#e5eeff] text-[#0058be] border-[#0058be]/30';
      default:
        return 'bg-[#000000] text-white border-[#333333]';
    }
  };

  const getIcon = (toast: Toast) => {
    if (toast.icon) return toast.icon;
    switch (toast.type) {
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      case 'info':
        return 'info';
      default:
        return 'check_circle';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Overlay */}
      <div className="fixed top-12 inset-x-0 z-[9999] flex flex-col items-center gap-2 pointer-events-none px-4 max-w-md mx-auto">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-2xl shadow-xl text-xs font-semibold border backdrop-blur-md transition-all animate-in slide-in-from-top-4 duration-200 ${getColors(
              toast.type
            )}`}
          >
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {getIcon(toast)}
            </span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
