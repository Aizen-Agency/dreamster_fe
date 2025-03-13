"use client"

import { InboxIcon as EnvelopeIcon, ArrowRightIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0b0014]">
      {/* Grid background */}
      <div
        className="absolute inset-0 z-0 opacity-30"
        style={{
          backgroundImage: `linear-gradient(#ff00cc 1px, transparent 1px), linear-gradient(90deg, #ff00cc 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          backgroundPosition: "-1px -1px",
          perspective: "500px",
          transform: "rotateX(60deg)",
          transformOrigin: "center center",
        }}
      />

      {/* Sun/horizon effect */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#ff2975] via-[#ff9900] to-transparent opacity-20 z-0" />

      <div className="w-full max-w-md space-y-8 relative z-10 p-8 rounded-xl backdrop-blur-sm bg-black/30 border border-purple-500/30 shadow-[0_0_15px_rgba(149,0,255,0.5)]">
        <div className="flex flex-col items-center justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#ff00cc] to-[#3300ff] shadow-[0_0_15px_rgba(255,0,204,0.7)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </div>
          <h2
            className="mt-6 text-center text-4xl font-bold tracking-wider text-white"
            style={{ textShadow: "0 0 10px #ff00cc, 0 0 20px #ff00cc" }}
          >
            Welcome to Dreamster
          </h2>
          <p className="mt-2 text-center text-lg text-[#00ffff]" style={{ textShadow: "0 0 5px #00ffff" }}>
            Your gateway to music creation and discovery
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <button
            onClick={() => router.push('/login/email')}
            type="button"
            className="group relative flex w-full justify-center rounded-md border border-[#ff00cc]/50 bg-gradient-to-r from-[#3300ff] to-[#ff00cc] px-4 py-3 text-base font-medium text-white shadow-[0_0_10px_rgba(255,0,204,0.5)] transition-all hover:shadow-[0_0_20px_rgba(255,0,204,0.7)] hover:scale-[1.02] focus:outline-none"
          >
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <EnvelopeIcon className="h-5 w-5" aria-hidden="true" />
            </span>
            Continue with Email
          </button>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="flex w-full items-center justify-center rounded-md border border-[#00ffff]/30 bg-black/50 px-4 py-3 text-base font-medium text-[#00ffff] hover:bg-black/70 hover:shadow-[0_0_10px_rgba(0,255,255,0.5)] transition-all"
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Google
            </button>
            <button
              type="button"
              className="flex w-full items-center justify-center rounded-md border border-[#00ffff]/30 bg-black/50 px-4 py-3 text-base font-medium text-[#00ffff] hover:bg-black/70 hover:shadow-[0_0_10px_rgba(0,255,255,0.5)] transition-all"
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="#00ffff">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
              </svg>
              Apple
            </button>
          </div>

          <button
            onClick={() => router.push('/wallet/connect')}
            type="button"
            className="group relative flex w-full justify-center rounded-md border border-[#00ffff]/50 bg-gradient-to-r from-[#00ffff] to-[#3300ff] px-4 py-3 text-base font-medium text-white shadow-[0_0_10px_rgba(0,255,255,0.5)] transition-all hover:shadow-[0_0_20px_rgba(0,255,255,0.7)] hover:scale-[1.02] focus:outline-none"
          >
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-5 w-5 text-[#00ffff]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </span>
            Connect Wallet
          </button>
        </div>

        <div className="flex flex-col items-center justify-center space-y-3 text-base">
          <p className="text-[#ff9900]" style={{ textShadow: "0 0 5px #ff9900" }}>
            Already have an account?{" "}
            <Link
              href="/auth/login/email"
              className="font-medium text-[#ff00cc] hover:text-[#ff66cc] transition-colors"
              style={{ textShadow: "0 0 5px #ff00cc" }}
            >
              Sign in
            </Link>
          </p>
          <Link
            href="#"
            className="inline-flex items-center font-medium text-[#00ffff] hover:text-white transition-colors"
            style={{ textShadow: "0 0 5px #00ffff" }}
          >
            Skip for now
            <ArrowRightIcon className="ml-1 h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#ff00cc] via-[#00ffff] to-[#3300ff] z-10" />
      <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-gradient-to-r from-[#ff00cc] to-[#3300ff] blur-[50px] opacity-50" />
      <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-gradient-to-r from-[#00ffff] to-[#3300ff] blur-[60px] opacity-50" />
    </div>
  )
}

