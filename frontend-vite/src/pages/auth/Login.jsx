import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../../redux/slices/authSlice";
import { Eye, EyeOff, User, Lock, LogIn } from "lucide-react";
import logo from "../../Images/upcline-logo.png";

// Animation utility function
const fadeInAnimation = (delay = 0) => {
  return {
    opacity: 0,
    animation: `fadeIn 0.5s ease-out ${delay}s forwards`,
  };
};


function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isMobile, setIsMobile] = useState(false);



  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };


    checkMobile();
    window.addEventListener("resize", checkMobile);


    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);


  // Check if user is authenticated and redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Clear any previous errors when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };


  return (
    <div className="flex fixed inset-0 min-h-screen bg-gradient-to-br from-[#f0f9ff] to-[#e6f7ff]">
      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(71, 188, 203, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(71, 188, 203, 0); }
          100% { box-shadow: 0 0 0 0 rgba(71, 188, 203, 0); }
        }
      `}</style>
      {/* Header with Logo */}
      <div className="absolute top-0 left-0 right-0 bg-white shadow-sm p-4 z-10" style={fadeInAnimation(0.2)}>
        <div className="container mx-auto flex justify-between items-center">
          <img
            src={logo}
            alt="Upcline logo"
            className="h-8 sm:h-10"
          />
          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium">
            <span className="px-2 sm:px-3 py-1 rounded-full bg-gray-100 text-gray-700">UAE</span>
            <span className="px-2 sm:px-3 py-1 rounded-full bg-gray-100 text-gray-700">IND</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex w-full h-full pt-16 sm:pt-20">
        {/* Left Section - Welcome and Features */}
        <div className="hidden lg:flex lg:w-1/2 p-8 flex-col justify-center items-center bg-[#47BCCB] text-white" style={fadeInAnimation(0.3)}>
          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-6" style={{ animation: 'slideIn 0.8s ease-out forwards' }}>
              Welcome to Upcline
            </h1>
            <p className="text-xl mb-8" style={{ animation: 'slideIn 1s ease-out forwards' }}>
              Built for Us. Driven by Purpose
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Streamlined HR Management</h3>
                  <p className="text-white/80">Simplify your HR processes with our intuitive platform</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4" style={fadeInAnimation(0.8)}>
                <div className="bg-white/20 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Secure & Reliable</h3>
                  <p className="text-white/80">Your data is protected with enterprise-grade security</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-3 sm:p-4 md:p-8" style={fadeInAnimation(0.4)}>
        <div className="w-full max-w-md bg-white p-5 sm:p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
          <div className="text-center mb-8">
            <div className="inline-flex justify-center items-center w-12 h-12 sm:w-16 sm:h-16 bg-[#47BCCB]/10 rounded-full mb-3 sm:mb-4" style={{ animation: 'pulse 2s infinite' }}>
              <LogIn size={28} className="text-[#47BCCB]" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Sign in</h2>
            <p className="text-gray-600 mt-1">to continue to Upcline</p>
          </div>


          <form className="space-y-6" onSubmit={handleLogin}>
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
                  placeholder="Enter your username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-[#47BCCB] focus:border-[#47BCCB] text-gray-900 placeholder-gray-400 bg-white/50 backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-sm"
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-[#47BCCB] focus:border-[#47BCCB] text-gray-900 placeholder-gray-400 bg-white/50 backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-sm"
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


            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}


            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#47BCCB] text-white py-3 px-4 rounded-lg hover:bg-[#3a9aa8] shadow-md transition duration-200 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
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
                  Signing in...
                </div>
              ) : (
                <>
                  <span>Sign in</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </>
              )}
            </button>


            {/* Account Help */}
            <div className="text-center text-sm mt-6">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <a href="/register" className="text-[#47BCCB] hover:text-[#3a9aa8] font-medium transition-colors">
                  Sign up now
                </a>
              </p>
            </div>
            
            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            
            {/* Social Login */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button type="button" className="flex-1 py-2 px-3 sm:px-4 border border-gray-300 rounded-lg text-gray-700 text-sm sm:text-base font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button type="button" className="flex-1 py-2 px-3 sm:px-4 border border-gray-300 rounded-lg text-gray-700 text-sm sm:text-base font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
            </div>
          </form>
        </div>
      </div>
      </div>
    </div>
  );
}


export default Login;
