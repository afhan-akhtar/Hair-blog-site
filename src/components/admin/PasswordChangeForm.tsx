"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, CheckCircle2 } from "lucide-react";
import {
  getPasswordChecks,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REQUIREMENTS_HINT,
  validateStrongPassword,
} from "@/lib/password";

export function PasswordChangeForm() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    const passwordError = validateStrongPassword(newPassword);
    if (passwordError) {
      setError(passwordError);
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
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const passwordChecks = getPasswordChecks(newPassword);
  const showChecks = newPassword.length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="admin-label">Current Password</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="admin-input"
          required
        />
      </div>
      <div>
        <label className="admin-label">New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="admin-input"
          required
          minLength={PASSWORD_MIN_LENGTH}
          autoComplete="new-password"
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
        <label className="admin-label">Confirm New Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="admin-input"
          required
          minLength={PASSWORD_MIN_LENGTH}
          autoComplete="new-password"
        />
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
