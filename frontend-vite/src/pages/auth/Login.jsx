import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../../redux/slices/authSlice";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import bgImage from "../../Images/Login.png";
import logo from "../../Images/Rat one bold.png";
// Import images from the src directory instead of public
import Boy from "../../Images/Boy.png";
import Girl from "../../Images/Girl.png";


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
    <div
      className="flex fixed inset-0 min-h-screen bg-[#FBB800]  "
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <img src={Girl} alt="Girl" className=" absolute bottom-10 left-0 h-auto -z-10 " />
      <img src={Boy} alt="Boy" className=" absolute bottom-10 right-0 h-auto -z-10" />
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
      <div className="hidden md:flex md:w-1/2   p-8 flex-col">
        <div className="text-center flex flex-col items-center justify-center h-full w-full ">
          <h2 className="text-[30px] font-bold text-gray-800">
            Welcome to HayalOne
          </h2>
          <p className="text-gray-600 mt-1 text-[25px]">
            Built for Us. Driven by Purpose
          </p>
        </div>
      </div>


      {/* Right Section - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Sign in</h2>
            <p className="text-gray-600 mt-1">to continue to HayalOne</p>
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              className="w-full bg-[#47BCCB] text-white py-3 px-4 rounded-lg hover:bg-[#3a9aa8] shadow-md transition duration-200 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed font-medium"
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
                "Sign in"
              )}
            </button>


            {/* Account Help */}
            <div className="text-center text-sm">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <a href="/register" className=" underline ">
                  sign up
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


export default Login;
