import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Workflow } from "lucide-react";
import { useLogin } from "../hooks/useAuth";
import { useAuth } from "../context/AuthContext";
import Input from "../components/Input";
import Button from "../components/Button";
import toast from "react-hot-toast";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await loginMutation.mutateAsync(data);
      login(response.data);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-6 py-12 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent-500/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />

      <div className="w-full max-w-md space-y-10 relative z-10">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl shadow-glow-indigo flex items-center justify-center text-white mb-8 rotate-3">
            <Workflow size={48} strokeWidth={2.5} />
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter">Welcome Back</h1>
          <p className="mt-3 text-lg text-slate-400 font-medium tracking-tight">Access your project workspace</p>
        </div>

        <div className="rounded-[40px] bg-slate-800 border border-slate-700/50 p-10 shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <Input
                label="Email Identity"
                type="email"
                placeholder="name@company.com"
                {...register("email")}
                error={errors.email?.message}
                className="rounded-2xl"
              />
              <Input
                label="Secret Key"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                error={errors.password?.message}
                className="rounded-2xl"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full py-4 text-base shadow-glow-indigo btn-primary-glow" 
              isLoading={loginMutation.isPending}
            >
              Sign In to System
            </Button>
          </form>

          <p className="mt-10 text-center text-sm font-bold text-slate-500 uppercase tracking-widest">
            Don't have an access key?{" "}
            <Link to="/register" className="text-primary-400 hover:text-primary-300 transition-colors">
              Request Identity
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
