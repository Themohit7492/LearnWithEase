export const ADMIN_EMAIL = "mohitkumar74927492@gmail.com";

export const isAdminEmail = (email = "") =>
  email.trim().toLowerCase() === ADMIN_EMAIL;