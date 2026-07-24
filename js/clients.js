const clientsList = document.getElementById("clientsList");
const openClientModalButton =document.getElementById("openClientModal");
const clientModal =document.getElementById("clientModal");
const closeClientModalButton =document.getElementById("closeClientModal");
const cancelClientButton = document.getElementById("cancelClientButton");
const addClientForm = document.getElementById("addClientForm");
const clientNameInput = document.getElementById("clientName");
const clientEmailInput = document.getElementById("clientEmail");
const clientPhoneInput = document.getElementById("clientPhone");
const clientCompanyInput =document.getElementById("clientCompany");
const clientDealValueInput = document.getElementById("clientDealValue");
const clientStatusInput =document.getElementById("clientStatus");
const clientNameError = document.getElementById("clientNameError");const clientEmailError =document.getElementById("clientEmailError");
const clientPhoneError = document.getElementById("clientPhoneError");
const clientDealValueError = document.getElementById("clientDealValueError");

let clients = [];

// Open Add Client modal
openClientModalButton.addEventListener("click", function () {
  clientModal.classList.add("open");
});

// Close modal with X button
closeClientModalButton.addEventListener("click", function () {
  closeClientModal();
});

// Close modal with Cancel button
cancelClientButton.addEventListener("click", function () {
  closeClientModal();
});

// Close modal by clicking on the background
clientModal.addEventListener("click", function (event) {
  if (event.target === clientModal) {
    closeClientModal();
  }
});

function closeClientModal() {
  clientModal.classList.remove("open");
  addClientForm.reset();
  clearClientFormErrors();
}

// Load clients from localStorage or DummyJSON
async function loadClients() {
  clientsList.innerHTML =
    '<p class="loading-message">Loading clients...</p>';

  const savedClients = localStorage.getItem("crm_clients");

  if (savedClients) {
    clients = JSON.parse(savedClients);
    renderClients(clients);
    return;
  }

  try {
    const response = await fetch(
      "https://dummyjson.com/users?limit=30"
    );

    if (!response.ok) {
      throw new Error("Could not load clients");
    }

    const data = await response.json();

    clients = data.users.map(function (user) {
      return {
        id: user.id,
        name: user.firstName + " " + user.lastName,
        email: user.email,
        phone: user.phone,
        company: user.company ? user.company.name : "",
        image: user.image,
        status: "Lead",
        dealValue:Math.floor(Math.random() * 10000) + 5000,
        notes: [],
        createdAt: new Date().toISOString()
      };
    });

    saveClients();
    renderClients(clients);
  } catch (error) {
    clientsList.innerHTML = `
      <div class="error-message">
        <p>
          Could not load clients. Check your connection and try again.
        </p>

        <button
          type="button"
          id="retryButton"
          class="retry-button"
        >
          Retry
        </button>
      </div>
    `;

    const retryButton = document.getElementById("retryButton");

    retryButton.addEventListener("click", function () {
      loadClients();
    });
  }
}

// Save clients in localStorage
function saveClients() {
  localStorage.setItem(
    "crm_clients",
    JSON.stringify(clients)
  );
}

// Render clients
function renderClients(list) {
  clientsList.innerHTML = "";

  if (list.length === 0) {
    clientsList.innerHTML =
      '<p class="empty-message">No clients found.</p>';

    return;
  }

  list.forEach(function (client) {
    const clientRow = document.createElement("div");

    clientRow.classList.add("client-row");
    clientRow.dataset.id = client.id;

    const image =
      client.image ||
      "https://dummyjson.com/icon/default/128";

    clientRow.innerHTML = `
      <div class="client-main-info">
        <img
          src="${image}"
          alt="${client.name}"
          class="client-avatar"
        >

        <span class="client-name">
          ${client.name}
        </span>
      </div>

      <span class="client-company">
        ${client.company || "No company"}
      </span>

      <span class="client-email">
        ${client.email}
      </span>

      <span class="status-badge ${getStatusClass(client.status)}">
        ${client.status}
      </span>

      <span class="client-deal-value">
        $${Number(client.dealValue).toLocaleString()}
      </span>

      <div class="client-actions">
        <button
          type="button"
          class="delete-button"
          data-id="${client.id}"
        >
          Delete
        </button>
      </div>
    `;

    clientsList.appendChild(clientRow);
  });
}

// Add new client
addClientForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const name = clientNameInput.value.trim();
  const email = clientEmailInput.value
    .trim()
    .toLowerCase();

  const phone = clientPhoneInput.value.trim();
  const company = clientCompanyInput.value.trim();

  const dealValueText =
    clientDealValueInput.value.trim();

  const dealValue = Number(dealValueText);
  const status = clientStatusInput.value;

  clearClientFormErrors();

  let hasError = false;

  // Validate name
  if (name.length < 3) {
    clientNameError.textContent =
      "Name must be at least 3 characters";

    clientNameInput.classList.add("input-error");
    hasError = true;
  }

  // Validate email
  const atPosition = email.indexOf("@");
  const dotPosition = email.indexOf(".", atPosition + 1);

  const isEmailValid =
    atPosition > 0 &&
    dotPosition > atPosition + 1;

  if (!isEmailValid) {
    clientEmailError.textContent =
      "Please enter a valid email address";

    clientEmailInput.classList.add("input-error");
    hasError = true;
  }

  // Check duplicate email
  if (isEmailValid) {
    const emailExists = clients.some(function (client) {
      return client.email.toLowerCase() === email;
    });

    if (emailExists) {
      clientEmailError.textContent =
        "A client with this email already exists";

      clientEmailInput.classList.add("input-error");
      hasError = true;
    }
  }

  // Validate phone
  if (phone !== "" && phone.length < 6) {
    clientPhoneError.textContent =
      "Phone number looks too short";

    clientPhoneInput.classList.add("input-error");
    hasError = true;
  }

  // Validate deal value
  if (
    dealValueText === "" ||
    isNaN(dealValue) ||
    dealValue <= 0
  ) {
    clientDealValueError.textContent =
      "Deal value must be a positive number";

    clientDealValueInput.classList.add("input-error");
    hasError = true;
  }

  if (hasError) {
    return;
  }

  try {
    const response = await fetch(
      "https://dummyjson.com/users/add",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          firstName: name,
          email: email,
          phone: phone,
          company: company
        })
      }
    );

    if (!response.ok) {
      throw new Error("Could not add client");
    }

    await response.json();

    const newClient = {
      id: Date.now(),
      name: name,
      email: email,
      phone: phone,
      company: company,
      image: "",
      status: status,
      dealValue: dealValue,
      notes: [],
      createdAt: new Date().toISOString()
    };

    clients.push(newClient);

    saveClients();
    renderClients(clients);
    closeClientModal();

    showToast("Client added", "success");
  } catch (error) {
    showToast("Could not add client", "error");
  }
});

// Delete client
clientsList.addEventListener("click", async function (event) {
  const deleteButton =
    event.target.closest(".delete-button");

  if (!deleteButton) {
    return;
  }

  const clientId = Number(deleteButton.dataset.id);

  const confirmed = confirm(
    "Delete this client? This cannot be undone."
  );

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(
      `https://dummyjson.com/users/${clientId}`,
      {
        method: "DELETE"
      }
    );

    /*
      DummyJSON does not really save added clients,
      so deleting a local client may return 404.
      We still remove it from local state.
    */
    if (!response.ok && response.status !== 404) {
      throw new Error("Could not delete client");
    }

    clients = clients.filter(function (client) {
      return client.id !== clientId;
    });

    saveClients();
    renderClients(clients);

    showToast("Client deleted", "success");
  } catch (error) {
    showToast("Could not delete client", "error");
  }
});

// Clear Add Client form errors
function clearClientFormErrors() {
  clientNameError.textContent = "";
  clientEmailError.textContent = "";
  clientPhoneError.textContent = "";
  clientDealValueError.textContent = "";

  clientNameInput.classList.remove("input-error");
  clientEmailInput.classList.remove("input-error");
  clientPhoneInput.classList.remove("input-error");
  clientDealValueInput.classList.remove("input-error");
}

// Return status badge class
function getStatusClass(status) {
  if (status === "Lead") {
    return "status-lead";
  }

  if (status === "Contacted") {
    return "status-contacted";
  }

  if (status === "Won") {
    return "status-won";
  }

  if (status === "Lost") {
    return "status-lost";
  }

  return "";
}

// Show toast message
function showToast(message, type) {
  const toast = document.getElementById("toast");

  toast.textContent = message;
  toast.className = `toast ${type}`;

  setTimeout(function () {
    toast.className = "toast";
  }, 3000);
}

loadClients();