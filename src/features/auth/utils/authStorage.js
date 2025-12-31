import { USERS_KEY } from "../../../constants/storageKeys";

export function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
  } catch {
    return {};
  }
}

export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function clearUsers() {
  localStorage.removeItem(USERS_KEY);
}
