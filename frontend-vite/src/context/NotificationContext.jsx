import React, { createContext, useContext, useState, useCallback } from 'react';
import Notification from '../components/Notification';

// Create notification context
const NotificationContext = createContext();

// Custom hook to use notification context
export const useNotification = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Generate unique ID for notifications
  const generateId = () => `notification-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

  // Remove notification by ID
  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  // Add a new notification
  const addNotification = useCallback((type, message, duration = 5000) => {
    const id = generateId();
    
    setNotifications((prev) => [
      ...prev,
      {
        id,
        type,
        message,
      },
    ]);

    // Auto remove after duration
    setTimeout(() => {
      removeNotification(id);
    }, duration);

    return id;
  }, [removeNotification]);

  // Show success notification
  const showSuccess = useCallback((message, duration) => {
    return addNotification('success', message, duration);
  }, [addNotification]);

  // Show error notification
  const showError = useCallback((message, duration) => {
    return addNotification('error', message, duration);
  }, [addNotification]);

  // Show info notification
  const showInfo = useCallback((message, duration) => {
    return addNotification('info', message, duration);
  }, [addNotification]);

  return (
    <NotificationContext.Provider
      value={{
        showSuccess,
        showError,
        showInfo,
        removeNotification,
      }}
    >
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            id={notification.id}
            type={notification.type}
            message={notification.message}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
