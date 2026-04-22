"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

const DEFAULT_REDIRECT = "/admin/orders";

function toSafeAdminPath(url: string | undefined, fallback: string) {
  if (!url) {
    return fallback;
  }

  try {
    const parsed = new URL(url, window.location.origin);
    const nextPath = `${parsed.pathname}${parsed.search}${parsed.hash}`;

    return nextPath.startsWith("/admin") ? nextPath : fallback;
  } catch {
    return fallback;
  }
}

export default function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setError("");

    const requestedCallbackUrl = searchParams.get("callbackUrl");
    const callbackUrl =
      requestedCallbackUrl?.startsWith("/")
        ? requestedCallbackUrl
        : DEFAULT_REDIRECT;

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl,
    });

    setIsSubmitting(false);

    if (!result?.ok) {
      setError("Email atau password salah.");
      return;
    }

    router.replace(toSafeAdminPath(result.url, callbackUrl));
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="mb-4 text-2xl font-bold">Admin Login</h1>

      <input
        type="email"
        placeholder="Email"
        className="mb-3 w-full rounded border p-3"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        autoComplete="username"
      />

      <input
        type="password"
        placeholder="Password"
        className="mb-3 w-full rounded border p-3"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        autoComplete="current-password"
      />

      {error ? (
        <p className="mb-3 text-sm font-medium text-red-600">{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded bg-[#ff6b2c] py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Memproses..." : "Login"}
      </button>
    </form>
  );
}
