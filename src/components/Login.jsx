import {
  signInWithPopup,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, provider } from "../firebase";
import { useState } from "react";
import { FaRegEnvelope, FaLock } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";

function Login({ onLogin, goToSignup }) {
  const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
const [rememberMe, setRememberMe] = useState(false);
const handleLogin = async (e) => {
  e.preventDefault();

  if (!email.trim() || !password.trim()) {
    alert("Please enter your email and password.");
    return;
  }

  try {
    const result = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = result.user;

    localStorage.setItem(
      "user",
      JSON.stringify({
        name: user.displayName || user.email.split("@")[0],
        email: user.email,
        photo: user.photoURL || "",
      })
    );

    onLogin();
  } catch (error) {
    alert(error.message);
  }
};
const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider);

    const user = result.user;

    localStorage.setItem(
      "user",
      JSON.stringify({
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
      })
    );

    onLogin();
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};
const handleForgotPassword = async () => {
  if (!email.trim()) {
    alert("Please enter your email first.");
    return;
  }

  try {
  await sendPasswordResetEmail(auth, email);

  console.log("Reset email requested successfully.");

  alert("Password reset email sent successfully.");}
   catch (error) {
  console.log(error.code);
  console.log(error.message);

  alert(error.code + "\n" + error.message);
}
};
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FFF9E8]">

      {/* Top Left Sticky Notes */}
      <div className="absolute left-10 top-10 hidden lg:block">
        <div className="relative h-44 w-44">

          <div className="absolute h-24 w-24 rotate-[-10deg] rounded-md bg-[#FFE98A] opacity-60"></div>

          <div className="absolute left-16 top-8 h-24 w-24 rotate-[-10deg] rounded-md bg-[#FFE98A] opacity-45"></div>

          <div className="absolute left-10 top-20 h-24 w-24 rounded-md bg-[#FFE98A] opacity-35"></div>

        </div>
      </div>

      {/* Bottom Right Sticky Notes */}
      <div className="absolute bottom-10 right-10 hidden lg:block">
        <div className="relative h-44 w-44">

          <div className="absolute bottom-0 right-0 h-24 w-24 rotate-[-10deg] rounded-md bg-[#FFE98A] opacity-60"></div>

          <div className="absolute bottom-10 right-16 h-24 w-24 rotate-[-10deg] rounded-md bg-[#FFE98A] opacity-45"></div>

          <div className="absolute bottom-20 right-2 h-16 w-16 rounded-md bg-[#FFE98A] opacity-35"></div>

        </div>
      </div>

      {/* Main Content */}
      <div className="flex min-h-screen items-center justify-center px-6">

        <div className="w-full max-w-[380px] sm:max-w-[420px] lg:max-w-[440px] xl:max-w-[460px]">

          {/* Logo */}
          <div className="mb-4 flex flex-col items-center">

            <div className="flex items-center gap-2">

              <img
                src="/Keeper-logo.png"
                alt="Keeper"
                className="h-10 w-10 object-contain"
              />

              <h1 className="text-[26px] font-bold text-[#202124]">
                Keeper
              </h1>

            </div>

            <p className="mt-1 text-[11px] text-[#6B7280]">
              Capture. Organize. Never forget.
            </p>

          </div>

          {/* Login Card */}
          <div
  className="
rounded-[20px]
bg-white
border
border-[#EFE4C6]
px-6
pt-7
pb-8
sm:px-8
lg:px-11
lg:pb-10
shadow-[0_12px_48px_rgba(217,184,95,0.5)]
">
 
            {/* Heading */}
            <div className="text-center">

              <h2 className="text-[27px] font-bold text-[#202124]">
                Welcome Back
              </h2>

              <p className="mt-1 text-[13px] text-[#757575]">
                Sign in to continue to Keeper
              </p>

            </div>

            {/* ===== PART 1B STARTS HERE ===== */}

                        {/* Email */}
            <div className="mt-8">

              <label className="mb-2 block text-[12px] sm:text-[13px] font-medium text-[#555]">
                Email
              </label>

              <div className="flex h-[42px] sm:h-[44px] items-center rounded-md border border-[#D9D9D9] bg-white px-3 sm:px-4">

                <FaRegEnvelope
  className="text-[#444] text-[14px] sm:text-[15px] shrink-0"
/>

               <input
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="ml-3 w-full border-none bg-transparent text-[13px] sm:text-[14px] text-[#202124] placeholder:text-[#8A8A8A] outline-none"
/>

              </div>

            </div>

            {/* Password */}
            <div className="mt-5">

              <label className="mb-2 block text-[12px] sm:text-[13px] font-medium text-[#555]">
                Password
              </label>

<div className="flex h-[42px] sm:h-[44px] items-center rounded-md border border-[#D9D9D9] bg-white px-3 sm:px-4">
                <FaLock
  className="text-[#444] text-[13px] sm:text-[14px] flex-shrink-0"
/>

                <input
  type={showPassword ? "text" : "password"}
  placeholder="Enter your password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  className="ml-3 w-full border-none bg-transparent text-[13px] sm:text-[14px] text-[#202124] placeholder:text-[#8A8A8A] outline-none"
/>

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-2"
                >
                  {showPassword ? (
  <FiEye className="text-[#444] text-[16px] cursor-pointer flex-shrink-0" />
) : (
  <FiEyeOff className="text-[#444] text-[16px] cursor-pointer flex-shrink-0" />
)}
                </button>

              </div>

            </div>

            {/* Remember + Forgot */}
            <div className="mt-3 flex items-center justify-between">

              <label className="flex items-center gap-2 text-[11px] text-[#555]">

                <input
  type="checkbox"
  checked={rememberMe}
  onChange={(e) => setRememberMe(e.target.checked)}
  className="h-3.5 w-3.5 accent-[#F4B400]"
/>
                Remember Me

              </label>

                          <button
              onClick={handleForgotPassword}
              className="text-[11px] font-medium text-[#F4B400] hover:text-[#D89B00]"
            >
              Forgot Password?
            </button>

            </div>

            {/* ===== PART 2 STARTS HERE ===== */}

                        {/* Sign In Button */}
            <button
            onClick={handleLogin}
              className="
                mt-6
                h-[42px]
                w-full
                rounded-md
                bg-[#F4B400]
                text-[14px]
                font-semibold
                text-white
                transition-all
                duration-200
                hover:bg-[#E0A800]
              "
            >
              Sign In
            </button>

            {/* Divider */}
            <div className="my-6 flex items-center">

              <div className="h-px flex-1 bg-[#E5E5E5]"></div>

              <span className="mx-3 text-[11px] text-[#777]">
                OR
              </span>

              <div className="h-px flex-1 bg-[#E5E5E5]"></div>

            </div>

            {/* Google Button */}
            <button
            onClick={handleGoogleLogin}
              className="
                flex
                h-[42px]
                w-full
                items-center
                justify-center
                gap-3
                rounded-md
                border
                border-[#D9D9D9]
                bg-white
                text-[13px]
                font-medium
                text-[#444]
                transition-all
                duration-200
                hover:bg-[#FAFAFA]
              "
            >
             <svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 48 48"
  className="h-5 w-5"
>
  <path
    fill="#FFC107"
    d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.239 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.959 3.041l5.657-5.657C34.046 6.053 29.27 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
  />
  <path
    fill="#FF3D00"
    d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.959 3.041l5.657-5.657C34.046 6.053 29.27 4 24 4c-7.682 0-14.348 4.337-17.694 10.691z"
  />
  <path
    fill="#4CAF50"
    d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.146 35.091 26.715 36 24 36c-5.218 0-9.62-3.329-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
  />
  <path
    fill="#1976D2"
    d="M43.611 20.083H42V20H24v8h11.303a12.03 12.03 0 01-4.084 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
  />
</svg>

              Continue with Google
            </button>

            {/* Footer */}
            <p className="mt-7 text-center text-[12px] text-[#666]">

              Don't have an account?

       <button
  onClick={goToSignup}
  className="ml-1 font-semibold text-[#F4B400] hover:text-[#D89B00]"
>
  Sign Up
</button>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;
