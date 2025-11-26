//api/auth.js
import axios from "axios";
import { BACKEND_BASE_URL } from "./config";

const instance = axios.create({
  baseURL: BACKEND_BASE_URL,
  withCredentials: true,
});

/**
 * login: call the backend login API for given role.
 * @param {string} role  One of "admin", "hr", "employee"
 * @param {object} payload  { email, password, loginRole }
 * @returns {Promise<object>}  The unwrapped response data from backend
 */
export async function login(role, payload) {
  let url;
  switch (role) {
    case "admin":
      url = `/admin/login`;
      break;
    case "hr":
      url = `/hr/login`;
      break;
    case "employee":
    default:
      url = `/employee/login`;
      break;
  }

  const res = await instance.post(url, payload);
  // Assuming backend uses ResponseMessage<T> with `data` field
  const wrapped = res.data;
  // Unwrap – if data field exists, return it, else return the response itself
  return wrapped.data ?? wrapped;
}
