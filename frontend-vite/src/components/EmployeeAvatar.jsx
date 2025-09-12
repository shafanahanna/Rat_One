import React from 'react';
import { User } from 'lucide-react';

const EmployeeAvatar = ({ employee, size = "md", className = "" }) => {
  // Size mapping
  const sizeClasses = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl",
    xxl: "w-24 h-24 text-2xl"
  };

  // Get the size class or default to md
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  
  // If there's a profile picture, show it
  if (employee?.profile_picture) {
    return (
      <div className={`${sizeClass} rounded-full overflow-hidden bg-gray-200 flex items-center justify-center ${className}`}>
        <img 
          src={employee.profile_picture} 
          alt={employee.name || employee.full_name || "Employee"} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.style.display = 'none';
            e.target.parentNode.classList.add('bg-gray-200');
            // Add a fallback icon when image fails to load
            const icon = document.createElement('div');
            icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-1/2 w-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>`;
            e.target.parentNode.appendChild(icon.firstChild);
          }}
        />
      </div>
    );
  }
  
  // Otherwise, show a placeholder with initials or icon
  const initials = employee?.name || employee?.full_name || employee?.fullName 
    ? (employee.name || employee.full_name || employee.fullName).charAt(0).toUpperCase() 
    : null;

  return (
    <div className={`${sizeClass} rounded-full bg-gradient-to-r from-[#47BCCB] to-[#4A90E2] text-white flex items-center justify-center ${className}`}>
      {initials ? (
        <span className="font-medium">{initials}</span>
      ) : (
        <User className="w-1/2 h-1/2" />
      )}
    </div>
  );
};

export default EmployeeAvatar;
