import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../../redux/slices/authSlice";
import { Eye, EyeOff, User, Lock, Mail, UserCircle } from "lucide-react";
import bgImage from "../../Images/Login.png";
import logo from "../../Images/Rat one bold.png";
import Boy from "../../Images/Boy.png";
import Girl from "../../Images/Girl.png";

// User roles from backend enum
const USER_ROLES = [
  { value: "Director", label: "Director" },
  { value: "HR", label: "HR" },
  { value: "DM", label: "DM" },
  { value: "TC", label: "TC" },
  { value: "BA", label: "BA" },
  { value: "RT", label: "RT" },
  { value: "AC", label: "AC" },
];

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [passwordMismatch, setPasswordMismatch] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Clear any previous errors when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordMismatch("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setPasswordMismatch("Passwords do not match");
      return;
    }

    const userData = {
      username: formData.username,
      email: formData.email,
      password_hash: formData.password,
      role: formData.role,
    };

    // Dispatch the register action
    const resultAction = await dispatch(registerUser(userData));
    
    // Check if registration was successful
    if (!resultAction.error) {
      navigate("/login");
    }
  };

  return (
    <div
      className="flex fixed inset-0 min-h-screen bg-[#FBB800]"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <img src={Girl} alt="Girl" className="absolute bottom-10 left-0 h-auto -z-10" />
      <img src={Boy} alt="Boy" className="absolute bottom-10 right-0 h-auto -z-10" />
      <div
        className={`absolute top-5 sm:top-10 left-0 right-0 bg-white h-[50px] sm:h-[67px] items-center justify-between mx-auto transition-all duration-300 ease-in-out text-sm z-50 rounded-full w-[95%] sm:w-[90%] max-w-[1200px]`}
      >
        <div className="flex items-center justify-between my-auto gap-2 h-full px-10 sm:px-10 md:px-[50px]">
          <img
            src={logo}
            alt="Best international travel agency in Kerala"
            className="w-24 sm:w-28 md:w-32 h-auto"
          />
          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <p>UAE</p>
            <hr className="w-[1px] h-3 sm:h-4 bg-gray-400" />
            <p>IND</p>
          </div>
        </div>
      </div>

      {/* Left Section - Welcome and Features */}
      <div className="hidden md:flex md:w-1/2 p-8 flex-col">
        <div className="text-center flex flex-col items-center justify-center h-full w-full">
          <h2 className="text-[30px] font-bold text-gray-800">
            Welcome to HayalOne
          </h2>
          <p className="text-gray-600 mt-1 text-[25px]">
            Built for Us. Driven by Purpose
          </p>
        </div>
      </div>

      {/* Right Section - Registration Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Sign up</h2>
            <p className="text-gray-600 mt-1">to join HayalOne</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-[#47BCCB] focus:border-[#47BCCB] text-gray-900 placeholder-gray-400 bg-white"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-[#47BCCB] focus:border-[#47BCCB] text-gray-900 placeholder-gray-400 bg-white"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-[#47BCCB] focus:border-[#47BCCB] text-gray-900 placeholder-gray-400 bg-white"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-[#47BCCB] focus:border-[#47BCCB] text-gray-900 placeholder-gray-400 bg-white"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Role
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <UserCircle size={18} className="text-gray-400" />
                </div>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-[#47BCCB] focus:border-[#47BCCB] text-gray-900 placeholder-gray-400 bg-white appearance-none"
                  required
                >
                  <option value="" disabled>Select your role</option>
                  {USER_ROLES.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {(passwordMismatch || error) && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{passwordMismatch || (typeof error === 'object' ? error.message : error)}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#47BCCB] text-white py-3 px-4 rounded-lg hover:bg-[#3a9aa8] shadow-md transition duration-200 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed font-medium mt-2"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing up...
                </div>
              ) : (
                "Sign up"
              )}
            </button>

            {/* Login Link */}
            <div className="text-center text-sm">
              <p className="text-gray-600">
                Already have an account?{" "}
                <a href="/login" className="underline">
                  Sign in
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
