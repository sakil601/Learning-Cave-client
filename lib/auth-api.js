import { apiFetch } from "./api";

export const loginUser = ({ login, password }) =>
  apiFetch("/auth/login", {
    method: "POST",
    skipRefresh: true,
    body: JSON.stringify({ login, password }),
  });

export const registerUser = ({
  name,
  email,
  phone,
  password,
  confirmPassword,
  role,
}) =>
  apiFetch("/auth/register", {
    method: "POST",
    skipRefresh: true,
    body: JSON.stringify({
      name,
      email,
      phone,
      password,
      confirmPassword,
      role,
    }),
  });

export const getCurrentUser = () => apiFetch("/auth/me");

export const logoutUser = () =>
  apiFetch("/auth/logout", { method: "POST", skipRefresh: true });
