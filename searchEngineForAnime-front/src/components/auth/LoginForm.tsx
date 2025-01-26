import {useState} from 'react';
import {Lock, Mail, X} from 'lucide-react';
import {Link, useNavigate} from 'react-router-dom';
import {authService} from '../../services/authService';
import mascotImage from '../../assets/ChopperMascot1-Wbg.png';
import {userService} from "../../services/userService.ts";
import {jwtDecode} from 'jwt-decode'
import {Button} from "@headlessui/react";

interface DecodedToken {
    sub: string; // Username or email
    userId: number; // Custom claim
}

const LoginForm = ({setIsVisible}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleLogin = async () => {
        setError('');
        setLoading(true);

        if (!email || !password) {
            setError('Veuillez entrer votre email et votre mot de passe.');
            setLoading(false);
            return;
        }
        if (!validateEmail(email)) {
            setError("Invalid email format")
            return
        }

        try {
            const authData = { email, password };
            const response = await authService.loginUser(authData);
            console.log('Réponse de l\'API:', response);

            setLoading(false);

            if (response && response.token) {
                localStorage.setItem('authToken', response.token);
                const decoded: DecodedToken = jwtDecode(response.token);
                localStorage.setItem('userSubject', decoded.sub);
                localStorage.setItem('userId', decoded.userId.toString());

                window.location.href = "/"; // Redirect to login page or handle logout
                setIsVisible(false);

            } else {
                setError('Réponse invalide de l\'API');
            }
        } catch (error) {
            setLoading(false);
            console.error('Erreur lors de la connexion:', error);
            setError(error);
        }
    };

    const verifyUser = ()=>{
        if(error && error === "Your account is not activated"){
            // setIsVisible(false);
            return <Button onClick={()=>setIsVisible(false) & navigate("/verify", { state: { email: email } })} className="text-blue-400 ml-1 underline-offset-2 hover:underline " >  Verify now.</Button>
        }
    }

    const handleForgotPassword = async () => {
        setError('');
        setLoading(true);

        if (!email) {
            setError('Veuillez entrer votre adresse email.');
            setLoading(false);
            return;
        }

        try {
            const response = await userService.forgotPassword(email);
            console.log(response);
            if (response && response.success) {
                setError('');
                alert('Un lien de réinitialisation de mot de passe a été envoyé à votre email.');
                setIsVisible(false);
                navigate('/login');
            } else {
                setError(response.message || 'Erreur lors de l\'envoi de l\'email de réinitialisation.');
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi de l\'email de réinitialisation:', error);
            setError(error?.message || 'Erreur lors de la réinitialisation du mot de passe.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-900 rounded-lg shadow-2xl flex overflow-hidden max-w-4xl w-full">
                {/* Image Section */}
                <div className="flex-1 relative hidden md:block">
                    <img
                        src="https://images.unsplash.com/photo-1553095066-5014bc7b7f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
                        alt="Cool background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-teal-400 opacity-75"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <img src={mascotImage || "/placeholder.svg"} alt="Chopper mascot" className="w-2/3 h-auto object-contain" />
                    </div>
                </div>

                {/* Form Section */}
                <div className="flex-1 p-8 flex flex-col justify-start bg-gray-900">
                    <div className="relative flex justify-end">
                        <button
                            onClick={() => setIsVisible(false)}
                            className="text-gray-400 hover:text-gray-200 transition-colors duration-200"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="mt-4 mb-8">
                        <h2 className="text-3xl font-extrabold text-white mb-2 text-center">Welcome Back</h2>
                        <p className="text-sm text-gray-400 text-center">Log in to discover your next favorite anime!</p>
                    </div>

                    {/* Error Message */}
                    {error && <p className="text-red-400 text-sm text-center mb-4">
                        {error}
                        { verifyUser() }
                    </p>}

                    {/* Form Fields */}
                    <div className="space-y-4">
                        {/* Email Field */}
                        <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <Mail className="w-5 h-5" />
              </span>
                            <input
                                type="email"
                                placeholder="your.email@example.com"
                                className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-500"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* Password Field */}
                        <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <Lock className="w-5 h-5" />
              </span>
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    className="w-4 h-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500"
                                />
                                <label htmlFor="remember" className="text-sm text-gray-400 cursor-pointer">
                                    Remember me
                                </label>
                            </div>
                            <button
                                onClick={handleForgotPassword}
                                className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
                            >
                                Forgot password?
                            </button>
                        </div>

                        {/* Login Button */}
                        <button
                            onClick={handleLogin}
                            className={`w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 active:border-b-0 hover:border-blue-500 rounded ${
                                loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex justify-center items-center">
                                    <div className="animate-spin rounded-full border-4 border-t-4 border-white w-5 h-5"></div>
                                    <span className="ml-2">Logging in...</span>
                                </div>
                            ) : (
                                "Login"
                            )}
                        </button>

                        <div className="text-center text-sm text-gray-400 mt-4">
                            Don't have an account?{" "}
                            <Link
                                to="/register"
                                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200"
                            >
                                Register
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default LoginForm;
