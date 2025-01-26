import {useState} from "react"
import {Lock, Mail, User, X} from "lucide-react"
import mascotImage from "../../assets/pngwing.com.png"
import {Link, useNavigate} from "react-router-dom"
import {authService} from "../../services/authService"

const RegisterForm = ({ setIsVisible }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        repeatPassword: "",
    })
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleRegister = async () => {
        setError("")

        if (!formData.name || !formData.email || !formData.password || !formData.repeatPassword) {
            setError("All fields are required")
            return
        }
        if (!validateEmail(formData.email)) {
            setError("Invalid email format")
            return
        }

        if (formData.password !== formData.repeatPassword) {
            setError("Passwords don't match")
            return
        }

        const userData = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
        }

        try {
            setIsLoading(true)
            const data = await authService.registerUser(userData)
            console.log(data)
            setIsVisible(false)
            navigate("/verify", { state: { email: formData.email } })
        } catch (err) {
            console.log(err)
            setError(err || "An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }

    const backgroundImage =
        "https://images.unsplash.com/photo-1553095066-5014bc7b7f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-900 rounded-lg shadow-2xl flex overflow-hidden max-w-4xl w-full">
                {/* Image Section */}
                <div className="flex-1 relative hidden md:block">
                    <img
                        src={backgroundImage || "/placeholder.svg"}
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
                        <h2 className="text-3xl font-extrabold text-white mb-2 text-center">Join the Adventure</h2>
                        <p className="text-sm text-gray-400 text-center">
                            Create your account and embark on an epic anime journey!
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}

                    {/* Form Fields */}
                    <div className="space-y-4">
                        {/* Name Field */}
                        <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <User className="w-5 h-5"/>
              </span>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your Name"
                                className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-500"
                            />
                        </div>

                        {/* Email Field */}
                        <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <Mail className="w-5 h-5"/>
              </span>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="your.email@example.com"
                                className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-500"
                            />
                        </div>

                        {/* Password Field */}
                        <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <Lock className="w-5 h-5"/>
              </span>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password"
                                className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-500"
                            />
                        </div>

                        {/* Repeat Password Field */}
                        <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <Lock className="w-5 h-5"/>
              </span>
                            <input
                                type="password"
                                name="repeatPassword"
                                value={formData.repeatPassword}
                                onChange={handleChange}
                                placeholder="Repeat Password"
                                className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-500"
                            />
                        </div>

                        {/* Register Button */}
                        <button
                            onClick={handleRegister}
                            className={`w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-3 px-3 border-b-4 border-blue-700 active:border-b-0 hover:border-blue-500 rounded ${
                                isLoading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            disabled={isLoading}
                        >
                            {isLoading ?
                                <div className="flex justify-center items-center">
                                    <div className="animate-spin rounded-full border-4 border-t-4 border-white w-5 h-5"></div>
                                    <span className="ml-2">Creating Account...</span>
                                </div>
                                : "Start Your Journey"}
                        </button>

                        <div className="text-center text-sm text-gray-400 mt-4">
                            Already on the journey?{" "}
                            <Link
                                to="/login"
                                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200"
                            >
                                Log In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterForm

