import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const Notification = ({ 
  type = 'success', 
  message, 
  isVisible, 
  onClose,
  autoClose = true,
  duration = 5000
}) => {
  const [isClosing, setIsClosing] = useState(false);
  
  useEffect(() => {
    if (isVisible && autoClose) {
      const timer = setTimeout(() => {
        setIsClosing(true);
        setTimeout(() => {
          onClose();
          setIsClosing(false);
        }, 300); // Animation duration
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, duration, onClose]);
  
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300); // Animation duration
  };
  
  if (!isVisible) return null;
  
  const typeStyles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      text: 'text-green-800',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: <AlertCircle className="w-5 h-5 text-red-500" />,
      text: 'text-red-800',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: <Info className="w-5 h-5 text-blue-500" />,
      text: 'text-blue-800',
    },
  };
  
  const style = typeStyles[type] || typeStyles.info;
  
  return (
    <div className="fixed top-4 right-4 z-50 max-w-md w-full animate-notification-enter">
      <div 
        className={`${style.bg} ${style.border} border rounded-lg shadow-lg p-4 flex items-start ${
          isClosing ? 'animate-notification-exit' : ''
        }`}
      >
        <div className="flex-shrink-0 mr-3">
          {style.icon}
        </div>
        <div className="flex-1">
          <p className={`${style.text} text-sm font-medium`}>{message}</p>
        </div>
        <button 
          onClick={handleClose}
          className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-500"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Notification;
