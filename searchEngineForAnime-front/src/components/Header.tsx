import {useEffect, useState} from "react";
import {Image, Menu, User} from "lucide-react";
import Login from "../components/auth/LoginForm"; // Import Login component
import SignUp from "../components/register/RegisterForm"; // Import SignUp component
import {Link, useNavigate} from 'react-router-dom';
import logo from "../../public/logo2.png";

const Header = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false); // State for Login modal
  const [isSignUpOpen, setIsSignUpOpen] = useState(false); // State for SignUp modal
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State for login status
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Check login status
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token); // Update login state based on token presence
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove token
    localStorage.removeItem("userId"); // Remove token
    localStorage.removeItem("userSubject"); // Remove token
    setIsLoggedIn(false); // Update login status
    navigate("/");
  };

  const closeAllModals = () => {
    setIsLoginOpen(false);
    setIsSignUpOpen(false);
  };

  return (
    <header className="bg-gray-800 fixed w-full z-50">
      <div className="sm:px-20 px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src={logo || "/placeholder.svg"} alt="AnimeSearch Logo" className="h-10 w-auto"/>
              <h1 className="text-xl font-bold text-white">My Anime Search</h1>
            </Link>
          </div>


          {/* Auth Buttons or Logout - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
                <>
                  {/* User Icon */}
                  <button
                      className="p-2 rounded-lg hover:bg-gray-700 text-white"
                      onClick={() => navigate("/profile")}
                  >
                    <User size={24}/>
                  </button>
                  {/* Logout Button */}
                  <button
                      className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors text-white"
                      onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
            ) : (
                <>
                  {/* Login Button */}
                  <button
                      className="px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-white"
                      onClick={() => {
                        setIsLoginOpen(true);
                        setIsSignUpOpen(false);
                      }}
                  >
                    Login
                  </button>
                  {/* SignUp Button */}
                  <button
                      className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-white"
                      onClick={() => {
                        setIsSignUpOpen(true);
                        setIsLoginOpen(false);
                      }}
                  >
                    Sign Up
                  </button>
                </>
            )}
          </div>


          {/* Mobile Menu Button and Dropdown */}
          <div className="md:hidden relative">
            <button
                className="p-2 rounded-lg hover:bg-gray-700 text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu size={24}/>
            </button>

            {isMobileMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-lg">
                  {isLoggedIn ? (
                      <>
                        <Link
                            to="/profile"
                            className="block px-4 py-2 text-white hover:bg-gray-600 rounded-t-lg"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Profile
                        </Link>
                        <button
                            className="w-full text-left px-4 py-2 text-white hover:bg-gray-600 rounded-b-lg"
                            onClick={() => {
                              handleLogout();
                              setIsMobileMenuOpen(false);
                            }}
                        >
                          Logout
                        </button>
                      </>
                  ) : (
                      <>
                        <button
                            className="w-full text-left px-4 py-2 text-white hover:bg-gray-600 rounded-t-lg"
                            onClick={() => {
                              setIsLoginOpen(true);
                              setIsSignUpOpen(false);
                              setIsMobileMenuOpen(false);
                            }}
                        >
                          Login
                        </button>
                        <button
                            className="w-full text-left px-4 py-2 text-white hover:bg-gray-600 rounded-b-lg"
                            onClick={() => {
                              setIsSignUpOpen(true);
                              setIsLoginOpen(false);
                              setIsMobileMenuOpen(false);
                            }}
                        >
                          Sign Up
                        </button>
                      </>
                  )}
                </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Login */}
      {isLoginOpen && <Login setIsVisible={closeAllModals}/>}

      {/* Modal SignUp */}
      {isSignUpOpen && <SignUp setIsVisible={closeAllModals}/>}
    </header>
  );
};

export default Header;
