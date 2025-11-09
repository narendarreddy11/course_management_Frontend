// ✅ Save all user info in sessionStorage
export const saveAuthData = (data) => {
  sessionStorage.setItem("token", data.token);
  sessionStorage.setItem("userid", data.userid);
  sessionStorage.setItem("username", data.username);
  sessionStorage.setItem("email", data.email);
  sessionStorage.setItem("role", data.role);
};

// ✅ Get values
export const getToken = () => sessionStorage.getItem("token");
export const getUserId = () => sessionStorage.getItem("userid");
export const getUsername = () => sessionStorage.getItem("username");
export const getUserRole = () => sessionStorage.getItem("role");
export const getEmail = () => sessionStorage.getItem("email");

// ✅ Check login status
export const isLoggedIn = () => !!getToken();

// ✅ Logout
export const logout = () => {
  sessionStorage.clear();
  window.location.href = "/login";
};
