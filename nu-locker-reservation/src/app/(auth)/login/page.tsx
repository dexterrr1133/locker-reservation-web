import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Log In</h2>
        
        {/* Login Form Component */}
        <LoginForm />
      </div>
    </div>
  );
}