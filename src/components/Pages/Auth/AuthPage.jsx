import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "../../Services/Auth/AuthThunk";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const AuthPage = () => {
    const [activeTab, setActiveTab] = useState("login");
    const [loginData, setLoginData] = useState({
        fullName: "",
        email: "",
        password: "",
    });
    const [loginErrors, setLoginErrors] = useState({});
    const [registerData, setRegisterData] = useState({
        fullName: "",
        email: "",
        password: '',
        confirmPass: "",
    });
    const [registerErrors, setRegisterErrors] = useState({});
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loginLoading, registerLoading } = useSelector((state) => state.auth);

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
        setLoginErrors({ ...loginErrors, [name]: "" });
    };

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterData({ ...registerData, [name]: value });
        setRegisterErrors({ ...registerErrors, [name]: "" });
    };

    const toggleLoginPassword = () => {
        setShowLoginPassword((prev) => !prev);
    };

    const toggleRegisterPassword = () => {
        setShowRegisterPassword((prev) => !prev);
    };

    const toggleConfirmPassword = () => {
        setShowConfirmPassword((prev) => !prev);
    };

    const validateLogin = () => {
        const loginErrors = {};

        // Email validation
        if (!loginData.email) {
            loginErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
            loginErrors.email = "Invalid email format";
        }

        // Password validation
        if (!loginData.password) {
            loginErrors.password = "Password is required";
        } else if (loginData.password.length < 6) {
            loginErrors.password = "Password must be at least 6 characters";
        }

        return loginErrors;
    };

    const validateRegister = () => {
        const registerErrors = {};

        // Full Name
        if (!registerData.fullName.trim()) {
            registerErrors.fullName = "Full name is required";
        } else if (registerData.fullName.length < 3) {
            registerErrors.fullName = "Name must be at least 3 characters";
        }

        // Email
        if (!registerData.email) {
            registerErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
            registerErrors.email = "Invalid email format";
        }

        // Password
        if (!registerData.password) {
            registerErrors.password = "Password is required";
        } else if (registerData.password.length < 6) {
            registerErrors.password = "Password must be at least 6 characters";
        }

        // Confirm Password
        if (!registerData.confirmPass) {
            registerErrors.confirmPass = "Confirm password is required";
        } else if (registerData.confirmPass !== registerData.password) {
            registerErrors.confirmPass = "Passwords do not match";
        }

        return registerErrors;
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();

        const loginDataErrors = validateLogin();
        setLoginErrors(loginDataErrors);

        if (Object.keys(loginDataErrors).length !== 0) return;

        const loadingToast = toast.loading("Logging in...");
        dispatch(loginUser(loginData)).unwrap().then(() => {
            toast.dismiss(loadingToast);
            toast.success("User Logged In Successfully");

            setLoginData({
                fullName: "",
                email: "",
                password: "",
            });
            setLoginErrors({});

            setTimeout(() => {
                navigate("/dashboard");
            }, 500);
        }).catch((error) => {
            toast.dismiss(loadingToast);
            toast.error(error);
        })
    };

    const handleRegisterSubmit = (e) => {
        e.preventDefault();

        const loginRegisterErrors = validateRegister();
        setRegisterErrors(loginRegisterErrors);

        if (Object.keys(loginRegisterErrors).length !== 0) return;

        const loadingToast = toast.loading("Creating Account...");
        dispatch(registerUser(registerData)).unwrap().then(() => {
            toast.dismiss(loadingToast);
            toast.success("User Registered In Successfully");
            setRegisterData({
                fullName: "",
                email: "",
                password: '',
                confirmPass: "",
            });
            setRegisterErrors({});

            setActiveTab("login")
        }).catch((error) => {
            toast.dismiss(loadingToast);
            toast.error(error);
        })
    };

    return (
        <div className="min-h-screen grid md:grid-cols-2 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800">

            {/* LEFT SIDE (Branding / Info) */}
            <div className="hidden md:flex flex-col justify-between p-10 border-r border-white/10">

                {/* Logo */}
                <h1 className="text-white text-2xl font-bold">
                    🚀 BrainCMS
                </h1>

                {/* Center Content */}
                <div className="max-w-md">
                    <h2 className="text-4xl font-bold text-white leading-tight">
                        Manage Your Content Like a Pro
                    </h2>

                    <p className="text-gray-400 mt-4">
                        Create, manage and scale your content workflow with powerful tools,
                        analytics and team collaboration.
                    </p>

                    {/* Features */}
                    <div className="mt-8 space-y-4">
                        <div className="flex items-center gap-3 text-gray-300">
                            ✅ Smart Content Management
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                            📊 Real-time Analytics Dashboard
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                            👥 Team Collaboration & Roles
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-gray-500 text-sm">
                    © 2026 BrainCMS. All rights reserved.
                </p>
            </div>

            {/* RIGHT SIDE (Auth Form) */}
            <div className="flex items-center justify-center px-6 py-10">

                <div className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8">

                    {/* Heading */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-white">
                            {activeTab === "login" ? "Welcome Back 👋" : "Create Account 🚀"}
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">
                            {activeTab === "login"
                                ? "Login to continue your journey"
                                : "Start managing your content today"}
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="flex mb-6 bg-white/10 rounded-xl p-1">
                        <button
                            onClick={() => setActiveTab("login")}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${activeTab === "login"
                                ? "bg-white text-black shadow"
                                : "text-gray-400"
                                }`}
                        >
                            Login
                        </button>

                        <button
                            onClick={() => setActiveTab("register")}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${activeTab === "register"
                                ? "bg-white text-black shadow"
                                : "text-gray-400"
                                }`}
                        >
                            Register
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={activeTab === "login" ? handleLoginSubmit : handleRegisterSubmit} className="space-y-5">

                        {activeTab === "register" && (
                            <div>
                                <label className="text-sm text-gray-300">Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={activeTab === "login" ? loginData.fullName : registerData.fullName}
                                    onChange={activeTab === "login" ? handleLoginChange : handleRegisterChange}
                                    className="w-full mt-2 px-4 py-2.5 rounded-xl bg-white/10 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
                                    placeholder="Enter your name"
                                />
                                {
                                    activeTab === "login"
                                        ? loginErrors.fullName && (
                                            <p className="pl-2 text-[0.9rem] font-medium text-red-600">*{loginErrors.fullName}</p>
                                        )
                                        : registerErrors.fullName && (
                                            <p className="pl-2 text-[0.9rem] font-medium text-red-600">*{registerErrors.fullName}</p>
                                        )
                                }
                            </div>
                        )}

                        <div>
                            <label className="text-sm text-gray-300">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={activeTab === "login" ? loginData.email : registerData.email}
                                onChange={activeTab === "login" ? handleLoginChange : handleRegisterChange}
                                className="w-full mt-2 px-4 py-2.5 rounded-xl bg-white/10 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
                                placeholder="Enter your email"
                            />
                            {
                                activeTab === "login"
                                    ? loginErrors.email && (
                                        <p className="pl-2 text-[0.9rem] font-medium text-red-600">*{loginErrors.email}</p>
                                    )
                                    : registerErrors.email && (
                                        <p className="pl-2 text-[0.9rem] font-medium text-red-600">*{registerErrors.email}</p>
                                    )
                            }
                        </div>

                        <div>
                            <label className="text-sm text-gray-300">Password</label>
                            <div className="relative">
                                <input
                                    type={activeTab === "login"
                                        ? showLoginPassword ? "text" : "password"
                                        : showRegisterPassword ? "text" : "password"
                                    }
                                    name="password"
                                    value={activeTab === "login" ? loginData.password : registerData.password}
                                    onChange={activeTab === "login" ? handleLoginChange : handleRegisterChange}
                                    className="w-full mt-2 px-4 py-2.5 rounded-xl bg-white/10 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
                                    placeholder="Enter password"
                                />
                                <span
                                    onClick={activeTab === "login" ? toggleLoginPassword : toggleRegisterPassword}
                                    className="absolute right-4 top-5 cursor-pointer text-gray-400 text-sm"
                                >
                                    {activeTab === "login"
                                        ? showLoginPassword ? "Hide" : "Show"
                                        : showRegisterPassword ? "Hide" : "Show"
                                    }
                                </span>
                            </div>
                            {
                                activeTab === "login"
                                    ? loginErrors.password && (
                                        <p className="pl-2 text-[0.9rem] font-medium text-red-600">*{loginErrors.password}</p>
                                    )
                                    : registerErrors.password && (
                                        <p className="pl-2 text-[0.9rem] font-medium text-red-600">*{registerErrors.password}</p>
                                    )
                            }
                        </div>

                        {activeTab === "register" && (
                            <div>
                                <label className="text-sm text-gray-300">Confirm Password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPass"
                                        value={registerData.confirmPass}
                                        onChange={handleRegisterChange}
                                        className="w-full mt-2 px-4 py-2.5 rounded-xl bg-white/10 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
                                        placeholder="Enter password"
                                    />
                                    <span
                                        onClick={toggleConfirmPassword}
                                        className="absolute right-4 top-5 cursor-pointer text-gray-400 text-sm"
                                    >
                                        {showConfirmPassword ? "Hide" : "Show"}
                                    </span>
                                </div>
                                {
                                    registerErrors.confirmPass && (
                                        <p className="pl-2 text-[0.9rem] font-medium text-red-600">*{registerErrors.confirmPass}</p>
                                    )
                                }
                            </div>
                        )}

                        {/* Extra */}
                        {activeTab === "login" && (
                            <div className="flex justify-between text-sm text-gray-400">
                                <span className="cursor-pointer hover:text-white">
                                    Forgot password?
                                </span>
                            </div>
                        )}

                        <button
                            disabled={activeTab === "login" ? loginLoading : registerLoading}
                            className="w-full bg-white text-black py-2.5 rounded-xl font-semibold hover:bg-gray-200 transition">
                            {activeTab === "login"
                                ? loginLoading ? "Logging You In..." : "Login"
                                : registerLoading ? "Creating Your Account" : "Create Account"}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-gray-400 text-xs mt-6">
                        {activeTab === "login"
                            ? "Don't have an account?"
                            : "Already have an account?"}
                        <span
                            onClick={() =>
                                setActiveTab(activeTab === "login" ? "register" : "login")
                            }
                            className="ml-1 text-white cursor-pointer hover:underline"
                        >
                            {activeTab === "login" ? "Register" : "Login"}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
