const profileForm = document.getElementById("profileForm");
const passwordForm = document.getElementById("passwordForm");
const resetCrmButton = document.getElementById("resetCrmButton");

const profileFullName = document.getElementById("profileFullName");
const profileEmail = document.getElementById("profileEmail");
const profileCompany = document.getElementById("profileCompany");

const profileFullNameError =document.getElementById("profileFullNameError");

const profileEmailError =document.getElementById("profileEmailError");

const currentPassword = document.getElementById("currentPassword");
const newPassword = document.getElementById("newPassword");

const confirmNewPassword = document.getElementById("confirmNewPassword");
const currentPasswordError =document.getElementById("currentPasswordError");
const newPasswordError =document.getElementById("newPasswordError");
const confirmNewPasswordError =document.getElementById("confirmNewPasswordError");

const profileInitials = document.getElementById("profileInitials");

const profileDisplayName = document.getElementById("profileDisplayName");
const profileDisplayEmail = document.getElementById("profileDisplayEmail");
const profileDisplayCompany =document.getElementById("profileDisplayCompany");

const toast = document.getElementById("toast");

// Get saved user information
const session = JSON.parse(
  localStorage.getItem("crm_session")
);

const users = JSON.parse(
  localStorage.getItem("crm_users")
) || [];

const userIndex = users.findIndex(function (user) {
  return user.id === session.userId;
});

let currentUser = users[userIndex];

// Show user information on page
function displayUser() {
  if (!currentUser) {
    return;
  }

  profileFullName.value = currentUser.fullName;
  profileEmail.value = currentUser.email;
  profileCompany.value = currentUser.company || "";

  profileDisplayName.textContent = currentUser.fullName;
  profileDisplayEmail.textContent = currentUser.email;

  profileDisplayCompany.textContent =
    currentUser.company || "Not provided";

  const nameParts = currentUser.fullName
    .trim()
    .split(" ");

  let initials = nameParts[0][0];

  if (nameParts.length > 1) {
    initials += nameParts[nameParts.length - 1][0];
  }

  profileInitials.textContent = initials.toUpperCase();
}

displayUser();

// Update profile information
profileForm.addEventListener("submit", function (event) {
  event.preventDefault();

  profileFullNameError.textContent = "";
  profileEmailError.textContent = "";

  profileFullName.classList.remove("input-error");
  profileEmail.classList.remove("input-error");

  const fullNameValue = profileFullName.value.trim();

  const emailValue = profileEmail.value
    .trim()
    .toLowerCase();

  const companyValue = profileCompany.value.trim();

  let isValid = true;

  if (fullNameValue.length < 3) {
    profileFullNameError.textContent =
      "Full name must be at least 3 characters.";

    profileFullName.classList.add("input-error");
    isValid = false;
  }

  const atIndex = emailValue.indexOf("@");
  const dotIndex = emailValue.indexOf(".", atIndex + 1);

  if (atIndex <= 0 || dotIndex <= atIndex + 1) {
    profileEmailError.textContent =
      "Please enter a valid email address.";

    profileEmail.classList.add("input-error");
    isValid = false;
  }

  const duplicateEmail = users.some(function (user) {
    return (
      user.email.toLowerCase() === emailValue &&
      user.id !== currentUser.id
    );
  });

  if (duplicateEmail) {
    profileEmailError.textContent =
      "This email is already registered.";

    profileEmail.classList.add("input-error");
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  currentUser.fullName = fullNameValue;
  currentUser.email = emailValue;
  currentUser.company = companyValue;

  users[userIndex] = currentUser;

  localStorage.setItem(
    "crm_users",
    JSON.stringify(users)
  );

  session.email = emailValue;

  localStorage.setItem(
    "crm_session",
    JSON.stringify(session)
  );

  displayUser();
  showToast("Profile updated successfully", "success");
});

// Change user password
passwordForm.addEventListener("submit", function (event) {
  event.preventDefault();

  currentPasswordError.textContent = "";
  newPasswordError.textContent = "";
  confirmNewPasswordError.textContent = "";

  currentPassword.classList.remove("input-error");
  newPassword.classList.remove("input-error");
  confirmNewPassword.classList.remove("input-error");

  let isValid = true;

  if (currentPassword.value !== currentUser.password) {
    currentPasswordError.textContent =
      "Current password is incorrect.";

    currentPassword.classList.add("input-error");
    isValid = false;
  }

  if (newPassword.value.length < 8) {
    newPasswordError.textContent =
      "Password must be at least 8 characters.";

    newPassword.classList.add("input-error");
    isValid = false;
  }

  if (newPassword.value !== confirmNewPassword.value) {
    confirmNewPasswordError.textContent =
      "Passwords do not match.";

    confirmNewPassword.classList.add("input-error");
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  currentUser.password = newPassword.value;
  users[userIndex] = currentUser;

  localStorage.setItem(
    "crm_users",
    JSON.stringify(users)
  );

  passwordForm.reset();

  showToast("Password updated successfully", "success");
});

// Reset saved client data
resetCrmButton.addEventListener("click", function () {
  const confirmed = confirm(
    "Are you sure you want to reset CRM data?"
  );

  if (!confirmed) {
    return;
  }

  localStorage.removeItem("crm_clients");

  showToast("CRM data was reset", "success");

  setTimeout(function () {
    window.location.href = "clients.html";
  }, 1000);
});

// Show toast message
function showToast(message, type) {
  toast.textContent = message;
  toast.className = "toast " + type;

  setTimeout(function () {
    toast.className = "toast";
  }, 3000);
}