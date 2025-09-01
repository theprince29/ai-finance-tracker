"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import useAuthStore from "@/store/useAuthstore";
import { useGoogleLogin } from '@react-oauth/google';




export default function GoogleSignInButton() {
  const router = useRouter();
  const login = useAuthStore((state:any) => state.login);

  
  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        
        if (codeResponse) {
          await login(codeResponse);
          router.push("/finance");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  },
    onError: (error) => {
      console.error("Google login failed:", error);
    }
    ,
    flow: "auth-code",
  });


  return (
    <Button
      onClick={() => googleLogin()}
      aria-label="Sign in with Google"
      className="group relative inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      {/* Magic UI–inspired subtle glow */}
      <span
        className="pointer-events-none absolute inset-0 -z-10 rounded-md opacity-60 blur-md transition group-hover:opacity-80"
        style={{ background: "radial-gradient(40% 50% at 50% 50%, rgba(37,99,235,0.25), transparent 60%)" }}
      />
      <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M21.35 11.1h-9.18v2.98h5.43c-.23 1.4-1.64 4.11-5.43 4.11-3.27 0-5.93-2.71-5.93-6.06s2.66-6.06 5.93-6.06c1.86 0 3.11.79 3.83 1.46l2.61-2.53C17.8 3.5 15.7 2.5 12.17 2.5 6.99 2.5 2.75 6.74 2.75 11.93S6.99 21.35 12.17 21.35c6.94 0 8.88-4.86 8.88-7.45 0-.5-.05-.81-.1-1.8z"
        />
      </svg>
      <span>Sign in with Google</span>
    </Button>
  )
}
