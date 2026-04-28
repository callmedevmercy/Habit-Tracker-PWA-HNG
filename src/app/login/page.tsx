import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/60 backdrop-blur-md border border-brand/10 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-serif font-bold text-center mb-8 text-brand">Log In</h2>
        <LoginForm />
      </div>
    </div>
  );
}
