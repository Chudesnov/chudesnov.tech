export default {
  // Failsafe: the home page lists recent posts once there are any; HIDE_NAV=true turns that off.
  hideNav: process.env.HIDE_NAV === "true",
};
