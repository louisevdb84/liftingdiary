import { SignInButton, SignUpButton, Show } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-black px-4">
      {/* Background image */}
      <Image
        src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80"
        alt="Gym equipment"
        fill
        className="object-cover opacity-30"
        priority
      />

      {/* Teal-to-blue gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-900/60 via-black/40 to-blue-900/60" />

      {/* Content */}
      <div className="relative flex flex-col items-center gap-8 text-center">
        {/* Badge */}
        <span className="rounded-full border border-teal-400/40 bg-teal-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-teal-300">
          Your fitness journey starts here
        </span>

        <div className="flex flex-col items-center gap-4">
          <h1 className="text-6xl font-extrabold tracking-tight text-white drop-shadow-lg sm:text-7xl">
            Lifting{" "}
            <span className="bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
              Diary
            </span>
          </h1>
          <p className="max-w-md text-lg text-zinc-300">
            Track your workouts, monitor your progress, and hit new personal
            records — all in one place.
          </p>
        </div>

        <Show when="signed-out">
          <div className="flex flex-col gap-3 sm:flex-row">
            <SignUpButton mode="modal">
              <button className="h-12 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 px-8 text-sm font-semibold text-white shadow-lg shadow-teal-500/30 transition-all hover:from-teal-400 hover:to-blue-400 hover:shadow-teal-400/40">
                Get started — it&apos;s free
              </button>
            </SignUpButton>
            <SignInButton mode="modal">
              <button className="h-12 rounded-full border border-white/20 bg-white/10 px-8 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20">
                Sign in
              </button>
            </SignInButton>
          </div>
        </Show>

        <Show when="signed-in">
          <a
            href="/dashboard"
            className="h-12 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 px-8 text-sm font-semibold text-white shadow-lg shadow-teal-500/30 transition-all hover:from-teal-400 hover:to-blue-400 flex items-center"
          >
            Go to dashboard
          </a>
        </Show>

      </div>
    </div>
  );
}
