import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Logo from "../Images/Hayal_Logo.png";
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
        className={`flex items-center justify-between px-3 py-2 mt-2 mb-1 cursor-pointer rounded-lg
          ${isOpen ? 'hover:bg-gray-800/30' : ''} transition-colors`}
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon size={18} className="text-gray-400" />}
          {isOpen && (
            <span className="text-sm font-semibold text-gray-400">{title}</span>
          )}
        </div>
        {isOpen && (
          expandedSections[section] ? 
            <ChevronDown size={16} className="text-gray-400" /> : 
            <ChevronRight size={16} className="text-gray-400" />
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
        } lg:translate-x-0 fixed lg:sticky top-0 left-0 min-h-screen max-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex-col ${
          isOpen ? "min-w-64 w-64" : "w-16"
        } transition-all duration-300 shadow-xl z-50 flex`}
      >
        {/* Header */}
        <div className=" relative h-16 flex items-center justify-center px-4 border-b border-gray-700/50">
          {isOpen && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center px-12">
                  <img
                    src={Logo}
                    alt="Best international travel agency in Kerala"
                    className="max-w-[160px] h-5 "
                  />
              </div>
            </div>
          )}
          <button
            onClick={handleToggle}
            className=" absolute right-4 top-1/2 -translate-y-1/2  w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white rounded-lg transition-colors"
          >
            <i className={`fas ${isOpen ? "fa-chevron-left" : "fa-bars"}`}></i>
          </button>
        </div>

        {/* Role Badge - only for HR and DM */}
        {isOpen && userRole && userRole !== "Director" && (
          <div className="px-4 py-2 border-b border-gray-700/50">
            <div className="bg-[#47BCCB]/20 rounded-md px-3 py-2 flex items-center justify-center">
              <span className="text-[#47BCCB] font-medium text-sm">
                Logged in as: <span className="font-bold">{userRole}</span>
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
                    ? "bg-gradient-to-r from-[#47BCCB]/20 to-transparent text-[#47BCCB] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1.5 before:h-8 before:bg-[#47BCCB] before:rounded-r-md"
                    : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
                }`
              }
            >
              <Home size={18} />
              {isOpen && <span>Dashboard</span>}
            </NavLink>
          )}

          {/* Lead Management Section */}
          {hasPermission("leads") && (
            <>
              <SectionHeader
                title="Lead Management"
                section="leads"
                icon={MessageSquare}
              />

              {expandedSections.leads && (
                <div className="space-y-1 pl-2">
                  {/* Leads */}
                  <NavLink
                    to="/leads"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative ${
                        isActive
                          ? "bg-gradient-to-r from-[#47BCCB]/20 to-transparent text-[#47BCCB] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1.5 before:h-8 before:bg-[#47BCCB] before:rounded-r-md"
                          : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
                      }`
                    }
                  >
                    <i className="fas fa-comment-alt text-lg"></i>
                    {isOpen && <span>Leads</span>}
                  </NavLink>

                  {/* Quotes - Visible to users with quotes permission */}
                  {hasPermission("quotes") && (
                    <NavLink
                      to="/admin/quotes"
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative ${
                          isActive
                            ? "bg-gradient-to-r from-[#47BCCB]/20 to-transparent text-[#47BCCB] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1.5 before:h-8 before:bg-[#47BCCB] before:rounded-r-md"
                            : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
                        }`
                      }
                    >
                      <FileText size={18} />
                      {isOpen && <span>Quotes</span>}
                    </NavLink>
                  )}

                  {/* Lead Analytics */}
                  <NavLink
                    to="/lead-analytics"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative ${
                        isActive
                          ? "bg-gradient-to-r from-[#47BCCB]/20 to-transparent text-[#47BCCB] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1.5 before:h-8 before:bg-[#47BCCB] before:rounded-r-md"
                          : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
                      }`
                    }
                  >
                    <BarChart size={18} />
                    {isOpen && <span>Lead Analytics</span>}
                  </NavLink>
                  
                  {/* Marketing Campaigns - moved under Lead Management */}
                  {(userRole === "Director" || userRole === "DM" || userRole === "Marketing") && (
                    <NavLink
                      to="/admin/marketing/campaigns"
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative ${
                          isActive
                            ? "bg-gradient-to-r from-[#47BCCB]/20 to-transparent text-[#47BCCB] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1.5 before:h-8 before:bg-[#47BCCB] before:rounded-r-md"
                            : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
                        }`
                      }
                    >
                      <TrendingUp size={18} />
                      {isOpen && <span>Campaigns</span>}
                    </NavLink>
                  )}
                </div>
              )}
            </>
          )}

          {/* User Management - Single Link */}
          {(userRole === "Director" || hasPermission("users")) && (
            <NavLink
              to="/users"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative ${
                  isActive
                    ? "bg-gradient-to-r from-[#47BCCB]/20 to-transparent text-[#47BCCB] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1.5 before:h-8 before:bg-[#47BCCB] before:rounded-r-md"
                    : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
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
                          ? "bg-gradient-to-r from-[#47BCCB]/20 to-transparent text-[#47BCCB] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1.5 before:h-8 before:bg-[#47BCCB] before:rounded-r-md"
                          : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
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
                          ? "bg-gradient-to-r from-[#47BCCB]/20 to-transparent text-[#47BCCB] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1.5 before:h-8 before:bg-[#47BCCB] before:rounded-r-md"
                          : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
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
                          ? "bg-gradient-to-r from-[#47BCCB]/20 to-transparent text-[#47BCCB] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1.5 before:h-8 before:bg-[#47BCCB] before:rounded-r-md"
                          : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
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
                          ? "bg-gradient-to-r from-[#47BCCB]/20 to-transparent text-[#47BCCB] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1.5 before:h-8 before:bg-[#47BCCB] before:rounded-r-md"
                          : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
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
                          ? "bg-gradient-to-r from-[#47BCCB]/20 to-transparent text-[#47BCCB] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1.5 before:h-8 before:bg-[#47BCCB] before:rounded-r-md"
                          : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
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
                          ? "bg-gradient-to-r from-[#47BCCB]/20 to-transparent text-[#47BCCB] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1.5 before:h-8 before:bg-[#47BCCB] before:rounded-r-md"
                          : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
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




            {/* Holiday Management - Only visible to BA and Director */}
            {(userRole === "BA" || userRole === "Director") && (
            <>
              <SectionHeader
                title="Holiday Management"
                section="holidayManagement"
                icon={Plane}
              />

              {expandedSections.holidayManagement && (
                <div className="space-y-1 pl-2">
                  {/* Holiday Dashboard */}
                  <NavLink
                    to="/holiday"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative ${
                        isActive
                          ? "bg-gradient-to-r from-[#47BCCB]/20 to-transparent text-[#47BCCB] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1.5 before:h-8 before:bg-[#47BCCB] before:rounded-r-md"
                          : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
                      }`
                    }
                  >
                    <i className="fas fa-tachometer-alt text-lg"></i>
                    {isOpen && <span>Dashboard</span>}
                  </NavLink>

                  {/* Destinations */}
                  <NavLink
                    to="/holiday/destinations"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative ${
                        isActive
                          ? "bg-gradient-to-r from-[#47BCCB]/20 to-transparent text-[#47BCCB] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1.5 before:h-8 before:bg-[#47BCCB] before:rounded-r-md"
                          : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
                      }`
                    }
                  >
                    <Map size={18} />
                    {isOpen && <span>Destinations</span>}
                  </NavLink>

                  {/* DMCs */}
                  <NavLink
                    to="/holiday/dmcs"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative ${
                        isActive
                          ? "bg-gradient-to-r from-[#47BCCB]/20 to-transparent text-[#47BCCB] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1.5 before:h-8 before:bg-[#47BCCB] before:rounded-r-md"
                          : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
                      }`
                    }
                  >
                    <Building size={18} />
                    {isOpen && <span>DMCs</span>}
                  </NavLink>

                  {/* Itineraries */}
                  <NavLink
                    to="/holiday/itineraries"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative ${
                        isActive
                          ? "bg-gradient-to-r from-[#47BCCB]/20 to-transparent text-[#47BCCB] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1.5 before:h-8 before:bg-[#47BCCB] before:rounded-r-md"
                          : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
                      }`
                    }
                  >
                    <Route size={18} />
                    {isOpen && <span>Itineraries</span>}
                  </NavLink>
                  {/* Trip Management */}
                  <NavLink
                    to="/trip-management"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative ${
                        isActive
                          ? "bg-gradient-to-r from-[#47BCCB]/20 to-transparent text-[#47BCCB] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1.5 before:h-8 before:bg-[#47BCCB] before:rounded-r-md"
                          : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
                      }`
                    }
                  >
                    <PlaneTakeoff size={18} />
                    {isOpen && <span>Trip Management</span>}
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
                    ? "bg-gradient-to-r from-[#47BCCB]/20 to-transparent text-[#47BCCB] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1.5 before:h-8 before:bg-[#47BCCB] before:rounded-r-md"
                    : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
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
        <div className="p-2 border-t border-gray-700/50 space-y-1">
        <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-[#47BCCB]/20 to-transparent text-[#47BCCB]"
                  : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
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
                  <span className="text-xs text-gray-400">
                    {employeeData.designation || employeeData.role || currentUser?.role}
                  </span>
                )}
              </div>
            )}
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800/50 hover:text-white transition-all duration-200"
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
