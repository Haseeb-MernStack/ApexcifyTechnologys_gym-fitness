"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authFetch, clearToken } from "@/lib/api";

interface MeResponse {
  id: string;
  name: string;
  email: string;
  role: string;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const greeting = getGreeting();

  useEffect(() => {
    let cancelled = false;

    async function loadMe() {
      try {
        setError(null);
        setLoading(true);
        const data = await authFetch<MeResponse>("/api/auth/me");
        if (!cancelled) {
          setUser(data);
        }
      } catch (err: any) {
        if (cancelled) return;
        if (err.status === 401) {
          clearToken();
          router.replace("/");
          return;
        }
        setError(err.message || "Failed to load profile");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadMe();

    return () => {
      cancelled = true;
    };
  }, [router]);

  function handleLogout() {
    clearToken();
    router.replace("/");
  }

  return (
    <div className="min-h-screen bg-zinc-100 p-4">
      <div className="max-w-3xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-zinc-900">
            Apexcify Gym Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="text-xs rounded-md border border-zinc-300 px-3 py-1.5 bg-white hover:bg-zinc-50"
          >
            Logout
          </button>
        </header>

        <main className="space-y-4">
          {loading && (
            <p className="text-sm text-zinc-600">Loading your profile...</p>
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          {user && (
            <section className="rounded-xl bg-white shadow p-4 space-y-4">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-zinc-500">
                  {greeting}
                </p>
                <h2 className="text-lg font-semibold text-zinc-900">
                  Welcome back, {user.name}
                </h2>
                <p className="text-sm text-zinc-600">{user.email}</p>
                <p className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-zinc-900 text-white">
                  Role: {user.role}
                </p>
                <p className="text-xs text-zinc-500 mt-2">
                  Use this dashboard as the starting point for managing members, classes,
                  attendance, and subscriptions.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-3">
                  <h3 className="text-sm font-medium text-zinc-900 mb-2">Quick actions</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => router.push("/members")}
                      className="text-xs rounded-md border border-zinc-200 bg-white px-3 py-1.5 hover:bg-zinc-50"
                    >
                      Manage members
                    </button>
                    <button
                      onClick={() => router.push("/classes")}
                      className="text-xs rounded-md border border-zinc-200 bg-white px-3 py-1.5 hover:bg-zinc-50"
                    >
                      View classes
                    </button>
                    <button
                      onClick={() => router.push("/attendance")}
                      className="text-xs rounded-md border border-zinc-200 bg-white px-3 py-1.5 hover:bg-zinc-50"
                    >
                      Attendance
                    </button>
                    <button
                      onClick={() => router.push("/subscriptions")}
                      className="text-xs rounded-md border border-zinc-200 bg-white px-3 py-1.5 hover:bg-zinc-50"
                    >
                      Subscriptions
                    </button>
                  </div>
                </div>

                <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-3 space-y-1">
                  <h3 className="text-sm font-medium text-zinc-900">Role overview</h3>
                  {user.role === "admin" && (
                    <p className="text-xs text-zinc-600">
                      As an admin you can manage staff accounts, configure membership plans,
                      and monitor overall gym performance.
                    </p>
                  )}
                  {user.role === "trainer" && (
                    <p className="text-xs text-zinc-600">
                      As a trainer you can see your classes, track member progress, and record
                      attendance.
                    </p>
                  )}
                  {user.role !== "admin" && user.role !== "trainer" && (
                    <p className="text-xs text-zinc-600">
                      Use the navigation above to explore your available gym features and
                      membership details.
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-zinc-100 bg-white p-3 flex flex-col gap-1">
                  <span className="text-xs font-medium text-zinc-500">Today&apos;s check-ins</span>
                  <span className="text-xl font-semibold text-zinc-900">--</span>
                  <span className="text-[11px] text-zinc-500">
                    Connect to your attendance data to see real-time check-ins.
                  </span>
                </div>
                <div className="rounded-lg border border-zinc-100 bg-white p-3 flex flex-col gap-1">
                  <span className="text-xs font-medium text-zinc-500">Active memberships</span>
                  <span className="text-xl font-semibold text-zinc-900">--</span>
                  <span className="text-[11px] text-zinc-500">
                    Hook this card up to your billing/subscription system.
                  </span>
                </div>
                <div className="rounded-lg border border-zinc-100 bg-white p-3 flex flex-col gap-1">
                  <span className="text-xs font-medium text-zinc-500">Upcoming classes</span>
                  <span className="text-xl font-semibold text-zinc-900">--</span>
                  <span className="text-[11px] text-zinc-500">
                    Show the next few classes or sessions scheduled for today.
                  </span>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
