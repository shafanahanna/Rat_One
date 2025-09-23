import { useState, useEffect } from 'react';
import SideBar from './SideBar';

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(window.innerWidth >= 1024);
  
  // Track sidebar expanded state for desktop
  useEffect(() => {
    const handleStorageChange = () => {
      const sidebarState = localStorage.getItem('sidebarExpanded');
      if (sidebarState !== null) {
        setSidebarExpanded(sidebarState === 'true');
      }
    };
    
    // Set initial state
    handleStorageChange();
    
    // Listen for changes
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('sidebarStateChange', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sidebarStateChange', handleStorageChange);
    };
  }, []);
  
  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <SideBar isOpen={mobileOpen} onToggle={(expanded) => setSidebarExpanded(expanded)} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300">
        {/* Mobile Header */}
        <header className="bg-white shadow-sm lg:hidden">
          <div className="px-4 py-3 flex items-center justify-between">
            <button 
              onClick={toggleMobileSidebar}
              className="text-gray-500 focus:outline-none focus:text-gray-700"
            >
              <i className="fas fa-bars"></i>
            </button>
            <div className="text-lg font-semibold">Upcline</div>
          </div>
        </header>
        
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
