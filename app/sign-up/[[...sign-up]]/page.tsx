import { SignUp } from '@clerk/nextjs';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Staff Sign Up' };

export default function SignUpPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-coast-navy to-coast-navy-light">
      <div className="text-center mb-6">
        <span className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-coast-blue to-sky-400 text-white items-center justify-center font-extrabold text-2xl mb-3">
          C
        </span>
        <h1 className="text-white font-extrabold text-2xl">Join the Staff Portal</h1>
        <p className="text-white/60 text-sm">An administrator will assign your role after sign-up</p>
      </div>
      <SignUp />
    </div>
  );
}
