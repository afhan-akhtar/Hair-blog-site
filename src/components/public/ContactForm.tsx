"use client";

import { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { submitWeb3Form } from "@/lib/web3forms";

type FormStatus = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append("form_type", "contact");

    const result = await submitWeb3Form(formData);

    if (result.success) {
      setStatus("success");
      form.reset();
    } else {
      setStatus("error");
      setErrorMsg(result.message || "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-mint rounded-[24px] p-10 text-center">
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h3 className="font-serif text-2xl font-bold mb-2">Message sent!</h3>
        <p className="text-gray-600 text-sm">
          Thank you for reaching out. We&apos;ll get back to you within 1–2 business days.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-medium text-terracotta hover:text-plum transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input type="hidden" name="subject" value="New contact from The Hair Edit" />
      <input type="checkbox" name="botcheck" className="hidden" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Your name"
            className="w-full px-4 py-3.5 rounded-xl border border-black/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30 transition-shadow"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full px-4 py-3.5 rounded-xl border border-black/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30 transition-shadow"
          />
        </div>
      </div>

      <div>
        <label htmlFor="topic" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
          Topic
        </label>
        <select
          id="topic"
          name="topic"
          className="w-full px-4 py-3.5 rounded-xl border border-black/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30 transition-shadow appearance-none cursor-pointer"
          defaultValue=""
          required
        >
          <option value="" disabled>Select a topic</option>
          <option value="General inquiry">General inquiry</option>
          <option value="Editorial pitch">Editorial pitch</option>
          <option value="Partnership">Partnership</option>
          <option value="Press">Press</option>
          <option value="Technical support">Technical support</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="Tell us how we can help..."
          className="w-full px-4 py-3.5 rounded-xl border border-black/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30 transition-shadow resize-none"
        />
      </div>

      {status === "error" && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-charcoal text-white rounded-xl text-sm font-semibold hover:bg-plum transition-colors disabled:opacity-60"
      >
        <Send className="w-4 h-4" />
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
