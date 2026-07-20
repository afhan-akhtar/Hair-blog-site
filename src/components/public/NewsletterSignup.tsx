"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { submitWeb3Form } from "@/lib/web3forms";

interface NewsletterSignupProps {
  variant?: "banner" | "sidebar";
}

export function NewsletterSignup({ variant = "banner" }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setErrorMsg("");

    if (!email.trim()) {
      setError("Field is required");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setStatus("loading");

    const formData = new FormData();
    formData.append("subject", "Newsletter signup — The Hair Edit");
    formData.append("form_type", "newsletter");
    formData.append("email", email.trim());

    const result = await submitWeb3Form(formData);
    if (result.success) {
      setStatus("success");
      setEmail("");
      return;
    }

    setStatus("error");
    setErrorMsg(result.message || "Something went wrong. Please try again.");
  };

  if (variant === "sidebar") {
    if (status === "success") {
      return (
        <div className="bg-beige rounded-2xl p-6 text-center">
          <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-charcoal">You&apos;re subscribed!</p>
        </div>
      );
    }

    return (
      <div className="bg-beige rounded-2xl p-6 transition-shadow duration-300 hover:shadow-md">
        <h3 className="font-serif text-lg font-bold mb-2">Stay in the loop</h3>
        <p className="text-sm text-gray-600 mb-4">
          Get our best hair tips delivered weekly.
        </p>
        <form onSubmit={handleSubmit} noValidate className="space-y-3">
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            placeholder="Enter your email"
            className={`w-full px-4 py-2.5 rounded-lg border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-plum/30 ${
              error ? "border-red-400" : "border-black/10"
            }`}
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          {status === "error" && errorMsg && (
            <p className="text-xs text-red-600">{errorMsg}</p>
          )}
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-terracotta text-white py-2.5 rounded-lg text-sm font-medium btn-lift hover:bg-plum cursor-pointer disabled:opacity-60"
          >
            {status === "loading" ? "Joining..." : "Subscribe"}
          </button>
        </form>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 w-full">
        <div className="lg:max-w-xl">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-charcoal leading-tight">
            Your weekly hair edit.
          </h2>
        </div>
        <div className="flex items-center gap-2 text-green-700 bg-green-50 rounded-xl px-5 py-4">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">Thanks for subscribing!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-14 w-full">
      <div className="lg:max-w-xl">
        <h2 className="font-serif text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-charcoal leading-tight">
          Your weekly hair edit.
        </h2>
        <p className="text-gray-500 mt-3 md:mt-4 text-sm md:text-base leading-relaxed">
          The best new cuts, colors, and care tips — delivered every Sunday.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto lg:flex-shrink-0"
      >
        <div className="w-full sm:min-w-[280px] lg:min-w-[320px]">
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            placeholder="Enter your email"
            className={`w-full h-14 px-5 rounded-xl bg-white border text-sm md:text-base text-charcoal placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-plum/30 shadow-sm transition-all duration-300 ${
              error ? "border-red-400" : "border-black/10 focus:border-plum/30"
            }`}
          />
          {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="h-14 px-10 bg-charcoal text-white rounded-xl text-sm md:text-base font-semibold btn-lift hover:bg-plum whitespace-nowrap cursor-pointer disabled:opacity-60"
        >
          {status === "loading" ? "Joining..." : "Join"}
        </button>
      </form>
      {status === "error" && errorMsg && (
        <div className="flex items-center gap-2 text-red-600 text-sm sm:col-span-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {errorMsg}
        </div>
      )}
    </div>
  );
}
