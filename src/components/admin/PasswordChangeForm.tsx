"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, CheckCircle2, Eye, EyeOff } from "lucide-react";
import {
  getPasswordChecks,
  PASSWORD_REQUIREMENTS_HINT,
  validateStrongPassword,
} from "@/lib/password";

function PasswordField({
  label,
  value,
  onChange,
  show,
  onToggleShow,
  autoComplete,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  onToggleShow: () => void;
  autoComplete?: string;
  error?: string;
}) {
  return (
    <div>
      <label className="admin-label">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`admin-input pr-11 ${error ? "border-red-400 focus:border-red-400 focus:ring-red-200" : ""}`}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          onClick={onToggleShow}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </div>
  );
}

type FieldErrors = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const emptyFieldErrors = (): FieldErrors => ({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

export function PasswordChangeForm() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>(emptyFieldErrors);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const nextFieldErrors: FieldErrors = {
      currentPassword: currentPassword.trim() ? "" : "Field is required",
      newPassword: newPassword.trim() ? "" : "Field is required",
      confirmPassword: confirmPassword.trim() ? "" : "Field is required",
    };
    setFieldErrors(nextFieldErrors);

    if (
      nextFieldErrors.currentPassword ||
      nextFieldErrors.newPassword ||
      nextFieldErrors.confirmPassword
    ) {
      return;
    }

    const passwordError = validateStrongPassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    const confirmError = validateStrongPassword(confirmPassword);
    if (confirmError) {
      setError(confirmError);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update password");
        return;
      }
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setFieldErrors(emptyFieldErrors());
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const passwordChecks = getPasswordChecks(newPassword);
  const showChecks = newPassword.length > 0;
  const confirmMismatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword && !fieldErrors.confirmPassword;
  const confirmMatch = confirmPassword.length > 0 && newPassword === confirmPassword;
  const confirmStrengthError = confirmMatch ? validateStrongPassword(confirmPassword) : null;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <PasswordField
        label="Current Password"
        value={currentPassword}
        onChange={(value) => {
          setCurrentPassword(value);
          if (fieldErrors.currentPassword) {
            setFieldErrors((prev) => ({ ...prev, currentPassword: "" }));
          }
        }}
        show={showCurrentPassword}
        onToggleShow={() => setShowCurrentPassword((v) => !v)}
        autoComplete="current-password"
        error={fieldErrors.currentPassword}
      />

      <div>
        <PasswordField
          label="New Password"
          value={newPassword}
          onChange={(value) => {
            setNewPassword(value);
            if (fieldErrors.newPassword) {
              setFieldErrors((prev) => ({ ...prev, newPassword: "" }));
            }
          }}
          show={showNewPassword}
          onToggleShow={() => setShowNewPassword((v) => !v)}
          autoComplete="new-password"
          error={fieldErrors.newPassword}
        />
        <p className="text-xs text-slate-500 mt-2">{PASSWORD_REQUIREMENTS_HINT}</p>
        {showChecks && (
          <ul className="mt-3 space-y-1">
            {passwordChecks.map((check) => (
              <li
                key={check.label}
                className={`text-xs ${check.met ? "text-green-600" : "text-slate-500"}`}
              >
                {check.met ? "✓" : "○"} {check.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <PasswordField
          label="Confirm New Password"
          value={confirmPassword}
          onChange={(value) => {
            setConfirmPassword(value);
            if (fieldErrors.confirmPassword) {
              setFieldErrors((prev) => ({ ...prev, confirmPassword: "" }));
            }
          }}
          show={showConfirmPassword}
          onToggleShow={() => setShowConfirmPassword((v) => !v)}
          autoComplete="new-password"
          error={fieldErrors.confirmPassword}
        />
        {confirmMismatch && (
          <p className="text-xs text-red-600 mt-2">Passwords do not match</p>
        )}
        {confirmMatch && confirmStrengthError && (
          <p className="text-xs text-red-600 mt-2">{confirmStrengthError}</p>
        )}
        {confirmMatch && !confirmStrengthError && (
          <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Passwords match
          </p>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle2 className="w-4 h-4" />
          Password updated successfully
        </div>
      )}

      <button type="submit" disabled={loading} className="admin-btn-primary flex items-center gap-2">
        <KeyRound className="w-4 h-4" />
        {loading ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
}
