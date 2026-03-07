// authEvents.ts
type AuthCallback = () => void;
let logoutListener: AuthCallback | null = null;

export const onUnauthenticated = (callback: AuthCallback) => {
  logoutListener = callback;
};

export const emitLogout = () => {
  if (logoutListener) logoutListener();
};