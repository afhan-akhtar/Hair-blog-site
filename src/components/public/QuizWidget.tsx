"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { submitWeb3Form } from "@/lib/web3forms";

const fields = [
  { name: "goal", label: "Goal", options: ["More volume", "Less frizz", "New color", "Healthy growth"] },
  { name: "hair_type", label: "Hair Type", options: ["Straight", "Wavy", "Curly", "Coily"] },
  { name: "hair_length", label: "Hair Length", options: ["Short", "Medium", "Long"] },
  { name: "hair_texture", label: "Hair Texture", options: ["Fine", "Medium", "Thick"] },
] as const;

type FieldName = (typeof fields)[number]["name"];

export function QuizWidget() {
  const [values, setValues] = useState<Record<FieldName, string>>({
    goal: "",
    hair_type: "",
    hair_length: "",
    hair_texture: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    const nextErrors: Partial<Record<FieldName, string>> = {};
    for (const field of fields) {
      if (!values[field.name]) {
        nextErrors[field.name] = "Field is required";
      }
    }
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("loading");

    const formData = new FormData();
    formData.append("subject", "Hair match quiz — The Hair Edit");
    formData.append("form_type", "hair_quiz");
    for (const field of fields) {
      formData.append(field.name, values[field.name]);
    }

    const result = await submitWeb3Form(formData);
    if (result.success) {
      setStatus("success");
      setValues({ goal: "", hair_type: "", hair_length: "", hair_texture: "" });
      setFieldErrors({});
      return;
    }

    setStatus("error");
    setErrorMsg(result.message || "Something went wrong. Please try again.");
  };

  if (status === "success") {
    return (
      <section className="py-16">
        <div className="site-container">
          <div className="bg-white rounded-[28px] shadow-[0_8px_40px_rgba(0,0,0,0.06)] border border-black/5 p-8 md:p-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2 className="section-heading-sm">Thanks — we got your answers!</h2>
            <p className="text-gray-500 mt-4 max-w-md mx-auto">
              We&apos;ll use your hair profile to recommend styles and tips that fit you best.
            </p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-6 text-sm font-medium text-terracotta hover:text-plum transition-colors"
            >
              Submit another response
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="site-container">
        <div className="bg-white rounded-[28px] shadow-[0_8px_40px_rgba(0,0,0,0.06)] border border-black/5 p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center transition-shadow duration-500 hover:shadow-[0_16px_56px_rgba(93,58,66,0.1)]">
          <div>
            <h2 className="section-heading-sm">What should you try next?</h2>
            <p className="text-gray-500 mt-5 text-base md:text-lg leading-relaxed">
              Tell us about your hair goals and we&apos;ll recommend products and styles tailored
              just for you.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {fields.map((field) => (
                <div key={field.name}>
                  <select
                    name={field.name}
                    value={values[field.name]}
                    onChange={(e) => {
                      setValues((prev) => ({ ...prev, [field.name]: e.target.value }));
                      if (fieldErrors[field.name]) {
                        setFieldErrors((prev) => ({ ...prev, [field.name]: "" }));
                      }
                    }}
                    className={`w-full px-4 py-3.5 rounded-xl border text-sm bg-cream text-gray-700 focus:outline-none focus:ring-2 focus:ring-plum/20 appearance-none cursor-pointer ${
                      fieldErrors[field.name] ? "border-red-400" : "border-black/10"
                    }`}
                  >
                    <option value="" disabled>
                      {field.label}
                    </option>
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {fieldErrors[field.name] && (
                    <p className="text-xs text-red-600 mt-1">{fieldErrors[field.name]}</p>
                  )}
                </div>
              ))}
            </div>

            {status === "error" && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 rounded-xl px-4 py-3 mb-4">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-4 bg-terracotta text-white rounded-xl font-semibold text-sm btn-lift hover:bg-plum disabled:opacity-60"
            >
              {status === "loading" ? "Sending..." : "Find My Match"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
