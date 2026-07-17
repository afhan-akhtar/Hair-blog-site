"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, User, Eye, EyeOff, Sparkles } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, rememberMe }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      const from = searchParams.get("from") || "/admin";
      router.push(from);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen admin-login-bg flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f] via-[#307fb1] to-[#5d3a42] opacity-95" />
        <div className="absolute inset-0 admin-login-pattern" />
        <div className="relative z-10 max-w-md text-white">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-rose-200" />
            <span className="text-sm uppercase tracking-[0.2em] text-white/70">The Hair Edit</span>
          </div>
          <h1 className="font-serif text-4xl font-bold leading-tight mb-4">
            Beautiful content,<br />powerful control.
          </h1>
          <p className="text-white/75 text-lg leading-relaxed">
            Manage your hair & beauty blog with a block editor, SEO tools, and role-based team access.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="admin-login-card p-8 sm:p-10">
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
              <p className="text-gray-500 mt-1 text-sm">Sign in to your admin dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="username" className="admin-login-label">
                  Username
                </label>
                <div className="admin-login-field">
                  <User className="admin-login-field-icon" />
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    autoComplete="username"
                    className="admin-login-input"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="admin-login-label">
                  Password
                </label>
                <div className="admin-login-field">
                  <Lock className="admin-login-field-icon" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="admin-login-input pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="admin-login-field-action"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <label className="admin-remember-me flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="admin-remember-checkbox"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="admin-btn-primary w-full py-3 mt-1">
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
