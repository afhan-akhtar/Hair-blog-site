"use client";

interface NewsletterSignupProps {
  variant?: "banner" | "sidebar";
}

export function NewsletterSignup({ variant = "banner" }: NewsletterSignupProps) {
  if (variant === "sidebar") {
    return (
      <div className="bg-beige rounded-2xl p-6">
        <h3 className="font-serif text-lg font-bold mb-2">Stay in the loop</h3>
        <p className="text-sm text-gray-600 mb-4">
          Get our best hair tips delivered weekly.
        </p>
        <button className="w-full bg-terracotta text-white py-2.5 rounded-lg text-sm font-medium hover:bg-plum transition-colors">
          Subscribe
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
      <h2 className="font-serif text-3xl md:text-4xl font-bold">
        Your weekly hair edit.
      </h2>
      <form className="flex gap-3 w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
        <input
          type="email"
          placeholder="Enter your email"
          className="flex-1 md:w-72 px-4 py-3 rounded-lg bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-plum/30"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-charcoal text-white rounded-lg text-sm font-medium hover:bg-plum transition-colors whitespace-nowrap"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
