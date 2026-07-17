"use client";

interface NewsletterSignupProps {
  variant?: "banner" | "sidebar";
}

export function NewsletterSignup({ variant = "banner" }: NewsletterSignupProps) {
  if (variant === "sidebar") {
    return (
      <div className="bg-beige rounded-2xl p-6 transition-shadow duration-300 hover:shadow-md">
        <h3 className="font-serif text-lg font-bold mb-2">Stay in the loop</h3>
        <p className="text-sm text-gray-600 mb-4">
          Get our best hair tips delivered weekly.
        </p>
        <button
          type="button"
          className="w-full bg-terracotta text-white py-2.5 rounded-lg text-sm font-medium btn-lift hover:bg-plum cursor-pointer"
        >
          Subscribe
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
      <div>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-charcoal">
          Your weekly hair edit.
        </h2>
        <p className="text-gray-500 mt-2 text-sm max-w-md">
          The best new cuts, colors, and care tips — delivered every Sunday.
        </p>
      </div>
      <form
        className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="email"
          placeholder="Enter your email"
          className="flex-1 sm:w-72 px-5 py-3.5 rounded-xl bg-white border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-plum/30 focus:border-plum/30 shadow-sm transition-all duration-300"
        />
        <button
          type="submit"
          className="px-8 py-3.5 bg-charcoal text-white rounded-xl text-sm font-semibold btn-lift hover:bg-plum whitespace-nowrap cursor-pointer"
        >
          Join
        </button>
      </form>
    </div>
  );
}
