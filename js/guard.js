// Protect pages that require login
function checkAuth() {
  const savedSession = localStorage.getItem("crm_session");

  if (!savedSession) {
    window.location.href = "index.html";
  }
}

function redirectIfLoggedIn() {
  const savedSession = localStorage.getItem("crm_session");

  if (savedSession) {
    window.location.href = "dashboard.html";
  }
}