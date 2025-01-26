import {useState} from 'react';
import {Lock} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import {userService} from '../../services/userService';

const ResetPasswordForm = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        setError('');
        setMessage('');
        setLoading(true);

        if (!password || !confirmPassword) {
            setError('Veuillez entrer votre mot de passe et la confirmation.');
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            setLoading(false);
            return;
        }

        try {
            const response = await userService.resetPassword({ password });
            setLoading(false);
            setMessage(response.message || 'Mot de passe réinitialisé avec succès.');
            // Rediriger l'utilisateur après la réinitialisation
            setTimeout(() => navigate('/login'), 2000); // Redirection vers la page de connexion après un délai
        } catch (error) {
            setLoading(false);
            setError(error?.message || 'Erreur lors de la réinitialisation du mot de passe.');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen px-4">
            <div className="bg-white rounded-lg shadow-lg flex flex-col max-w-[400px] w-full p-6">
                <div className="text-center">
                    <h2 className="text-xl font-extrabold text-purple-700 mb-2">Reset Password</h2>
                    <p className="text-xs text-gray-600 mb-6">Please enter your new password and confirm it.</p>
                </div>

                {/* Error or Success Message */}
                {error && <p className="text-red-500 text-xs text-center mb-2">{error}</p>}
                {message && <p className="text-green-500 text-xs text-center mb-2">{message}</p>}

                {/* Password Field */}
                <div className="relative mb-4">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-600">
                        <Lock className="w-4 h-4" />
                    </span>
                    <input
                        type="password"
                        placeholder="New password"
                        className="w-full pl-10 pr-3 py-2 bg-purple-50 border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {/* Confirm Password Field */}
                <div className="relative mb-4">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-600">
                        <Lock className="w-4 h-4" />
                    </span>
                    <input
                        type="password"
                        placeholder="Confirm password"
                        className="w-full pl-10 pr-3 py-2 bg-purple-50 border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    className={`w-full ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'} text-white py-2 rounded-md transition-colors duration-200 text-sm`}
                    disabled={loading}
                >
                    {loading ? (
                        <div className="flex justify-center items-center">
                            <div className="animate-spin rounded-full border-4 border-t-4 border-white w-5 h-5"></div>
                            <span className="ml-2">Resetting...</span>
                        </div>
                    ) : (
                        'Reset Password'
                    )}
                </button>
            </div>
        </div>
    );
};

export default ResetPasswordForm;
