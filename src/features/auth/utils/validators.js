const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (email = "") => emailRegex.test(email.trim());
export const isValidPassword = (pw = "") => pw.length >= 6;
