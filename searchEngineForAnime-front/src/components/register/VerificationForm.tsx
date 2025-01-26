import {useEffect, useState} from 'react';
import {Lock, Mail} from 'lucide-react';
import {userService} from "../../services/userService.ts";
import {useLocation, useNavigate} from "react-router-dom";

const VerificationForm = () => {
    const location = useLocation();
    const [email, setEmail] = useState<string>(location.state?.email || "")
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);  // Ajout de l'état pour gérer le chargement
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleVerify = async () => {
        setError('');
        setSuccess('');
        setLoading(true);

        if (!validateEmail(email)) {
            setError("Invalid email format")
            return
        }

        if (!verificationCode) {
            setError('Veuillez entrer un code de vérification.');
            setLoading(false);
            return;
        }

        try {
            const result = await userService.verifyUser(email, verificationCode);
            setLoading(false);

            if (result === 'Compte vérifié avec succès.') {
                setSuccess('Votre compte a été vérifié avec succès.');
                navigate("/");
            } else {
                setError(result);
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            setLoading(false);
            setError('Erreur lors de la vérification.');
        }
    };

    const handleResendCode = async (email: string) => {
        setError('');
        setSuccess('');
        setLoading(true);

        if (!email) {
            setError('Adresse email non fournie.');
            setLoading(false);
            return;
        }

        try {
            await userService.resendVerificationCode(email);
            setLoading(false);
            setSuccess('Le code de vérification a été renvoyé avec succès. Vérifiez votre email.');
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err: never) {
            setLoading(false);
            setError('Erreur lors de l\'envoi du code de vérification. Veuillez réessayer.');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen px-4">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-[400px] w-full">

                <div className="mt-4 mb-8">
                    <h2 className="text-3xl font-extrabold text-white mb-2 text-center">Verify Your Account</h2>
                    <p className="text-sm text-gray-400 text-center">
                        Enter the code we sent to your email address.
                    </p>
                </div>

                {/* Email Field */}
                <div className="relative mb-4">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <Mail className="w-5 h-5"/>
              </span>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        className="w-full pl-10 pr-3 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-500"
                    />
                </div>

                {/* Input Field */}


                <div className="relative mb-6">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <Lock className="w-5 h-5"/>
              </span>
                    <input
                        type="text"
                        placeholder="Verification Code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-500"
                    />
                </div>


                {/* Error Message */}
                {error && <p className="text-red-500 text-xs text-center mb-2">{error}</p>}

                {/* Success Message */}
                {success && <p className="text-green-500 text-xs text-center mb-2">{success}</p>}

                {/* Verify Button */}
                <button
                    onClick={handleVerify}
                    className={`w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-3 border-b-4 border-blue-700 active:border-b-0 hover:border-blue-500 rounded ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={loading}
                >
                    {loading ? (
                        <div className="flex justify-center items-center">
                            <div className="animate-spin rounded-full border-4 border-t-4 border-white w-5 h-5"></div>
                            <span className="ml-2">Loading...</span>
                        </div>
                    ) : (
                        'Verify'
                    )}
                </button>

                {/* Resend Code */}
                <div className="text-center text-sm text-gray-400 mt-4">
                    Didn't receive a code?{' '}
                    <button
                        className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200"
                        onClick={() => handleResendCode(email)}
                        disabled={loading}
                    >
                        Resend
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerificationForm;
