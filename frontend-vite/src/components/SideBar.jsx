import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Logo from "../Images/Ratone.png";
import axios from "axios";
import { 
  Plane, 
  Map, 
  Building, 
  Route, 
  DollarSign, 
  ChevronDown, 
  ChevronRight, 
  Users, 
  BarChart, 
  Clock,
  FileText,
  Image,
  Briefcase,
  Home,
  MessageSquare,
  PlaneTakeoff,
  Settings,
  Percent,
  Megaphone,
  TrendingUp,
  UserPlus,
  Shield,
  UserCog,
  Calendar,
  CreditCard,
  ClipboardList,
  Award
} from "lucide-react";

// Custom CSS to hide scrollbars
const hideScrollbarStyle = {
  '-ms-overflow-style': 'none',  /* IE and Edge */
  'scrollbarWidth': 'none',      /* Firefox */
};

const hideScrollbarStyleWebkit = {
  '&::-webkit-scrollbar': {
    display: 'none'              /* Chrome, Safari, and Opera */
  }
};

const SideBar = ({ isOpen: mobileIsOpen }) => {
  // Replace useAuth hook with direct localStorage access
  const currentUser = {
    id: localStorage.getItem('userId'),
    role: localStorage.getItem('role')
  };
  const userRole = localStorage.getItem('role');
  
  // Implement hasPermission function directly
  const hasPermission = (permission) => {
    if (!userRole) return false;
    
    // Role-based permissions mapping
    const rolePermissions = {
      Director: ['dashboard', 'leads', 'quotes', 'users', 'settings', 'hr', 'employees', 'attendance', 'payroll'],
      DM: ['dashboard', 'leads', 'marketing', 'hr', 'employees', 'attendance', 'payroll'],
      HR: ['hr', 'employees', 'attendance', 'payroll'],
      BA: ['dashboard', 'leads', 'quotes', 'holiday'],
      Marketing: ['dashboard', 'leads', 'campaigns'],
      TC: ['dashboard', 'leads', 'quotes', 'hr', 'employees', 'attendance', 'payroll']
    };
    
    // Get permissions for the user's role
    const userPermissions = rolePermissions[userRole] || [];
    
    // Check if the requested permission is in the user's permissions
    return userPermissions.includes(permission);
  };
  
  // Implement logout function directly
  const logout = () => {
    localStorage.removeItem('Admintoken');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    window.location.href = '/login';
  };

  const [isOpen, setIsOpen] = useState(window.innerWidth >= 1024);
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // State for tracking expanded sections - only one open at a time
  const [expandedSections, setExpandedSections] = useState({
    leads: true,
    hrManagement: false,
    holidayManagement: false,
    configModule: false,
    userManagement: false
  });

  // For desktop toggle
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };


  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  // Fetch employee data for the current user
  // useEffect(() => {
  //   const fetchEmployeeData = async () => {
  //     if (!currentUser?.id) return;
      
  //     setLoading(true);
  //     try {
  //       // First try to get employee mapping by user ID
  //       const token = localStorage.getItem('Admintoken');
        
  //       // Try to get the employee profile directly
  //       const profileResponse = await axios.get(`${API_URL}/api/employee/profile`, {
  //         headers: { Authorization: `Bearer ${token}` }
  //       });
        
  //       if (profileResponse.data && profileResponse.data.data) {
  //         const employeeData = profileResponse.data.data;
  //         setEmployeeData(employeeData);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching employee data:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
    
  //   fetchEmployeeData();
  // }, [currentUser]);

  const handleLogout = () => {
    logout();
  };

  // Toggle section expansion - only one section open at a time
  const toggleSection = (section) => {
    setExpandedSections(prev => {
      // Create a new state object with all sections closed
      const newState = Object.keys(prev).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});
      
      // Toggle the clicked section (if it was open, it will remain closed; if it was closed, it will open)
      newState[section] = !prev[section];
      return newState;
    });
  };

  // Section header component for collapsible sections
  const SectionHeader = ({ title, section, icon: Icon }) => {
    return (
      <div 
        onClick={() => toggleSection(section)}
        className={`flex items-center justify-between px-3 py-2 mt-2 mb-1 cursor-pointer
          ${isOpen ? 'hover:bg-[#F1F3F4]' : ''} transition-colors rounded-full`}
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon size={18} className="text-[#5F6368]" />}
          {isOpen && (
            <span className="text-sm font-medium text-[#5F6368]">{title}</span>
          )}
        </div>
        {isOpen && (
          expandedSections[section] ? 
            <ChevronDown size={16} className="text-[#5F6368]" /> : 
            <ChevronRight size={16} className="text-[#5F6368]" />
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {mobileIsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" />
      )}

      {/* Desktop Sidebar */}
      <div
        className={`${
          mobileIsOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:sticky top-0 left-0 min-h-screen max-h-screen bg-white shadow-md flex-col ${
          isOpen ? "min-w-64 w-64" : "w-16"
        } transition-all duration-300 shadow-xl z-50 flex`}
      >
        {/* Header */}
        <div className=" relative h-16 flex items-center justify-center px-4 border-b border-[#DADCE0]">
          {isOpen && (
            <div className="flex items-center space-x-2">
              {/* <div className="w-8 h-8 rounded-lg flex items-center justify-center px-12"> */}
                  <img
                    src={Logo}
                    alt="Best international travel agency in Kerala"
                    className="h-[30px] w-auto object-contain  "
                  />
              {/* </div> */}
            </div>
          )}
          <button
            onClick={handleToggle}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-[#5F6368] hover:bg-[#F1F3F4] hover:text-[#202124] rounded-full transition-colors"
          >
            <i className={`fas ${isOpen ? "fa-chevron-left" : "fa-bars"}`}></i>
          </button>
        </div>

        {/* Role Badge - only for HR and DM */}
        {isOpen && userRole && userRole !== "Director" && (
          <div className="px-4 py-2 border-b border-[#DADCE0]">
            <div className="bg-[#E8F0FE] rounded-full px-3 py-2 flex items-center justify-center">
              <span className="text-[#1A73E8] font-medium text-sm">
                Logged in as: <span className="font-bold text-[#202124]">{userRole}</span>
              </span>
            </div>
          </div>
        )}
           
        {/* Navigation */}
        <nav 
          className="flex-1 py-4 px-2 space-y-1 overflow-auto"
          style={{
            msOverflowStyle: "none",
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch"
          }}
          onLoad={(e) => {
            // Apply webkit scrollbar style directly to the DOM element
            e.target.style.setProperty('&::-webkit-scrollbar', 'display: none');
          }}
        >
          {/* Dashboard - based on backend permissions (except for HR role) */}
          {hasPermission("dashboard") && userRole !== "HR" && (
            <NavLink
              to=""
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative ${
                  isActive
                    ? "bg-[#E8F0FE] text-[#1A73E8] rounded-full"
                    : "text-[#5F6368] hover:bg-[#F1F3F4] hover:text-[#202124] rounded-full"
                }`
              }
            >
              <Home size={18} />
              {isOpen && <span>Dashboard</span>}
            </NavLink>
          )}

          

          {/* User Management - Single Link */}
          {(userRole === "Director" || hasPermission("users")) && (
            <NavLink
              to="/users"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative ${
                  isActive
                    ? "bg-[#E8F0FE] text-[#1A73E8] rounded-full"
                    : "text-[#5F6368] hover:bg-[#F1F3F4] hover:text-[#202124] rounded-full"
                }`
              }
            >
              <Users size={18} />
              {isOpen && <span>User Management</span>}
            </NavLink>
          )}

          {/* HR Management Section */}
          {(userRole === "Director" || userRole === "HR" || userRole === "TC" || userRole === "DM" || hasPermission("hr")) && (
            <>
              <SectionHeader
                title="HR Management"
                section="hrManagement"
                icon={Briefcase}
              />

              {expandedSections.hrManagement && (
                <div className="space-y-1 pl-2">
                  {/* HR Dashboard */}
                  <NavLink
                    to="/hr/dashboard"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative ${
                        isActive
                          ? "bg-[#E8F0FE] text-[#1A73E8] rounded-full"
                          : "text-[#5F6368] hover:bg-[#F1F3F4] hover:text-[#202124] rounded-full"
                      }`
                    }
                  >
                    <BarChart size={18} />
                    {isOpen && <span>HR Dashboard</span>}
                  </NavLink>

                  {/* Employee List */}
                  <NavLink
                    to="/hr/employees"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative ${
                        isActive
                          ? "bg-[#E8F0FE] text-[#1A73E8] rounded-full"
                          : "text-[#5F6368] hover:bg-[#F1F3F4] hover:text-[#202124] rounded-full"
                      }`
                    }
                  >
                    <Users size={18} />
                    {isOpen && <span>Employee List</span>}
                  </NavLink>

                  {/* Attendance */}
                  <NavLink
                    to="/hr/attendance"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative ${
                        isActive
                          ? "bg-[#E8F0FE] text-[#1A73E8] rounded-full"
                          : "text-[#5F6368] hover:bg-[#F1F3F4] hover:text-[#202124] rounded-full"
                      }`
                    }
                  >
                    <Clock size={18} />
                    {isOpen && <span>Attendance</span>}
                  </NavLink>

                  {/* Payroll */}
                  <NavLink
                    to="/hr/payroll"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative ${
                        isActive
                          ? "bg-[#E8F0FE] text-[#1A73E8] rounded-full"
                          : "text-[#5F6368] hover:bg-[#F1F3F4] hover:text-[#202124] rounded-full"
                      }`
                    }
                  >
                    <CreditCard size={18} />
                    {isOpen && <span>Payroll</span>}
                  </NavLink>

                  {/* Leave Management */}
                  <NavLink
                    to="/hr/leave"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative ${
                        isActive
                          ? "bg-[#E8F0FE] text-[#1A73E8] rounded-full"
                          : "text-[#5F6368] hover:bg-[#F1F3F4] hover:text-[#202124] rounded-full"
                      }`
                    }
                  >
                    <Calendar size={18} />
                    {isOpen && <span>Leave Management</span>}
                  </NavLink>

                  {/* Salary Management */}
                  <NavLink
                    to="/hr/salary-management"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative ${
                        isActive
                          ? "bg-[#E8F0FE] text-[#1A73E8] rounded-full"
                          : "text-[#5F6368] hover:bg-[#F1F3F4] hover:text-[#202124] rounded-full"
                      }`
                    }
                  >
                    <DollarSign size={18} />
                    {isOpen && <span>Salary Management</span>}
                  </NavLink>
                </div>
              )}
            </>
          )}




           



          {/* Settings - Direct Link to Director Settings */}
          {userRole && userRole.toLowerCase() === "director" && (
            <NavLink
              to="/settings/director"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative ${
                  isActive
                    ? "bg-[#E8F0FE] text-[#1A73E8] rounded-full"
                    : "text-[#5F6368] hover:bg-[#F1F3F4] hover:text-[#202124] rounded-full"
                }`
              }
            >
              <Settings size={18} />
              {isOpen && <span>Settings</span>}
            </NavLink>
          )}
          
          {/* Footer */}
          <div className="mt-auto"></div>
        </nav>

        {/* Footer */}
        <div className="p-2 border-t border-[#DADCE0] space-y-1">
        <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-[#E8F0FE] text-[#1A73E8] rounded-full"
                  : "text-[#5F6368] hover:bg-[#F1F3F4] hover:text-[#202124] rounded-full"
              }`
            }
          >
            {employeeData ? (
              <div 
                employee={employeeData} 
                size="sm" 
              />
            ) : (
              <i className="fas fa-user text-lg"></i>
            )}
            {isOpen && (
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {employeeData?.fullName || currentUser?.name || 'My Profile'}
                </span>
                {employeeData && (
                  <span className="text-xs text-[#80868B]">
                    {employeeData.designation || employeeData.role || currentUser?.role}
                  </span>
                )}
              </div>
            )}
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-[#5F6368] hover:bg-[#F1F3F4] hover:text-[#202124] rounded-full transition-all duration-200"
          >
            <i className="fas fa-sign-out-alt text-lg"></i>
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default SideBar;
