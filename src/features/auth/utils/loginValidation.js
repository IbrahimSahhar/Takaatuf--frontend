import { isValidEmail, isValidPassword } from "./validators";

export function validateLogin({ email, password }) {
  const e = (email || "").trim();
  const p = password || "";

  if (!e || !p) return "Please enter your email and password.";
  if (!isValidEmail(e)) return "Please enter a valid email address.";
  if (!isValidPassword(p)) return "Password must be at least 6 characters.";
  return null;
}
