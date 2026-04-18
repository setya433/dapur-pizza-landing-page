"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.ok) {
      router.push("/admin/order");
    } else {
      alert("Login gagal");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f1e8]">
      <div className="w-full max-w-md rounded-2xl border-4 border-[#3b2418] bg-white p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Login</h1>

        <input
          type="text"
          placeholder="Email"
          className="w-full mb-3 border p-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 border p-3 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-[#ff6b2c] text-white py-3 rounded font-bold"
        >
          Login
        </button>
      </div>
    </main>
  );
}