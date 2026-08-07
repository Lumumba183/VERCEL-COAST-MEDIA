import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] to-[#1e3a5f] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#0066cc] to-[#00a8a8] rounded-xl flex items-center justify-center text-white font-black text-3xl mx-auto mb-4">
            C
          </div>
          <h1 className="text-2xl font-bold text-white font-[var(--font-heading)]">Welcome Back</h1>
          <p className="text-white/60 mt-1">Sign in to access your account</p>
        </div>
        <SignIn routing="hash" signUpUrl="/sign-up" />
      </div>
    </div>
  );
}
