import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FiEye, FiEyeOff } from "react-icons/fi";

import logo from "../assets/logo.svg";
import illustration from "../assets/login-illustration.svg";
import { login } from "../api/authService";

export default function Login() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await login({
        userId,
        password,
      });

      const token = response.data?.token;

      if (!token) {
        throw new Error("Token not received");
      }

      localStorage.setItem("token", token);

      if (response.data?.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );
      }

      toast.success("Login successful");

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login Error:", error);

      const message =
        error?.message ||
        error?.response?.data?.message ||
        "Login failed";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[#EDF2F8] flex">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-1/2 items-center justify-center relative">
        <img
          src={illustration}
          alt="Login Illustration"
          className="w-[75%] max-w-[700px]"
        />
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div
          className="
            w-full
            max-w-[720px]
            h-[96vh]
            bg-white
            border
            border-[#BFD5FF]
            rounded-xl
            flex
            items-center
            justify-center
            ml-[50px]
          "
        >
          <div className="w-full max-w-[550px] px-10">
            {/* Logo */}
            <img
              src={logo}
              alt="PrepRoute"
              className="h-[34px] object-contain mb-10"
            />

            {/* Heading */}
            <h1 className="text-[24px] font-semibold text-[#374151]">
              Login
            </h1>

            <p className="mt-5 text-[16px] text-[#6B7280]">
              Use your company provided login credentials
            </p>

            {/* User ID */}
            <div className="mt-16">
              <label className="block mb-4 text-[18px] font-medium text-[#374151]">
                User ID
              </label>

              <input
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter User ID"
                className="
                  w-full
                  h-[58px]
                  px-5
                  rounded-xl
                  border
                  border-[#D1D5DB]
                  outline-none
                  text-[16px]
                  focus:border-[#5B84F1]
                  transition-all
                "
              />
            </div>

            {/* Password */}
            <div className="mt-8">
              <label className="block mb-4 text-[18px] font-medium text-[#374151]">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="
                    w-full
                    h-[58px]
                    px-5
                    pr-12
                    rounded-xl
                    border
                    border-[#D1D5DB]
                    outline-none
                    text-[16px]
                    focus:border-[#5B84F1]
                    transition-all
                  "
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-[#6B7280]
                    hover:text-[#374151]
                    transition-colors
                  "
                >
                  {showPassword ? <FiEyeOff size={24} /> : <FiEye size={24} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-4 text-red-500 text-sm">
                {error}
              </div>
            )}

            {/* Forgot Password */}
            <button
              type="button"
              className="
                mt-5
                text-[#2563EB]
                text-[16px]
                font-medium
                hover:underline
              "
            >
              Forgot password?
            </button>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="
                mt-10
                w-full
                h-[58px]
                rounded-xl
                bg-[#5D86F4]
                hover:bg-[#4E75E5]
                text-white
                text-[18px]
                font-medium
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}