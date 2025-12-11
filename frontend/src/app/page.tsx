"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getApiUrl } from "@/lib/api";

type Role = "member" | "trainer" | "admin";

export default function Home() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [role, setRole] = useState<Role>("member");

  useEffect(() => {
    // If a token already exists, send user straight to dashboard
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("gym_token");
    if (token) {
      router.replace("/dashboard");
    }
  }, [router]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const payload: any = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    if (!isLogin) {
      payload.name = formData.get("name");
      payload.role = role;
    }

    try {
      const res = await fetch(
        getApiUrl(`/api/auth/${isLogin ? "login" : "register"}`),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Request failed");
      }

      if (data.token) {
        localStorage.setItem("gym_token", data.token);
      }

      setSuccess(
        isLogin
          ? `Welcome back, ${data.user?.name || "user"}! Redirecting to dashboard...`
          : `Account created as ${data.user?.role || role}. Redirecting to dashboard...`
      );

      // Small delay to show success message, then navigate to dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 600);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-center text-zinc-900">
          Apexcify Gym Management
        </h1>

        <div className="flex justify-center gap-2 text-sm">
          <button
            className={`px-3 py-1 rounded-full border text-xs ${isLogin ? "bg-zinc-900 text-white" : "bg-white text-zinc-700"
              }`}
            onClick={() => setIsLogin(true)}
            type="button"
          >
            Login
          </button>
          <button
            className={`px-3 py-1 rounded-full border text-xs ${!isLogin ? "bg-zinc-900 text-white" : "bg-white text-zinc-700"
              }`}
            onClick={() => setIsLogin(false)}
            type="button"
          >
            Register
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="space-y-1">
              <label className="block text-sm font-medium text-zinc-800">Name</label>
              <input
                name="name"
                className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                required
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-sm font-medium text-zinc-800">Email</label>
            <input
              type="email"
              name="email"
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-zinc-800">Password</label>
            <input
              type="password"
              name="password"
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              required
            />
          </div>

          {!isLogin && (
            <div className="space-y-1">
              <label className="block text-sm font-medium text-zinc-800">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              >
                <option value="member">Member</option>
                <option value="trainer">Trainer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          {success && (
            <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-md px-3 py-2">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-zinc-900 text-white py-2 text-sm font-medium hover:bg-zinc-800 disabled:opacity-60"
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Create account"}
          </button>
        </form>

        <p className="text-[11px] text-zinc-500 text-center">
          After logging in, you will be redirected to your dashboard where you can
          manage classes, attendance, and subscriptions.
        </p>
      </div>
    </div>
  );
}
