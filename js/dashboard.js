const welcomeMessage = document.getElementById("welcomeMessage");
const currentDate = document.getElementById("currentDate");
const currentTime = document.getElementById("currentTime");

const totalClients = document.getElementById("totalClients");
const activeDeals = document.getElementById("activeDeals");
const wonRevenue = document.getElementById("wonRevenue");
const newThisWeek = document.getElementById("newThisWeek");

const leadCount = document.getElementById("leadCount");
const contactedCount = document.getElementById("contactedCount");
const wonCount = document.getElementById("wonCount");
const lostCount = document.getElementById("lostCount");


const recentClientsList =
  document.getElementById("recentClientsList");


// Get current session
const savedSession = localStorage.getItem("crm_session");

// Get registered users
const savedUsers = localStorage.getItem("crm_users");

if (savedSession && savedUsers) {
  const session = JSON.parse(savedSession);
  const users = JSON.parse(savedUsers);

  const currentUser = users.find(function (user) {
    return user.id === session.userId;
  });

  if (currentUser) {
    const firstName = currentUser.fullName
      .trim()
      .split(" ")[0];

    welcomeMessage.textContent =
      `Welcome back, ${firstName}!`;
  }
}

// Update current date and time
function updateClock() {
  const now = new Date();

  currentDate.textContent =
    now.toLocaleDateString();

  currentTime.textContent =
    now.toLocaleTimeString();
}

updateClock();
setInterval(updateClock, 1000);

// Load clients from localStorage
const savedClients =
  localStorage.getItem("crm_clients");

if (savedClients) {
  const clients = JSON.parse(savedClients);

  // Total Clients
  totalClients.textContent = clients.length;

  // Active Deals
  const activeClients = clients.filter(function (client) {
    return (
      client.status !== "Won" &&
      client.status !== "Lost"
    );
  });

  activeDeals.textContent = activeClients.length;

  // Won Revenue
  const wonClients = clients.filter(function (client) {
    return client.status === "Won";
  });

  const totalRevenue = wonClients.reduce(
    function (sum, client) {
      return sum + Number(client.dealValue);
    },
    0
  );

  wonRevenue.textContent =
    "$" + totalRevenue.toLocaleString();

  // New This Week
  const recentWeekClients = clients.filter(function (client) {
    const days =
      (Date.now() - new Date(client.createdAt)) /
      86400000;

    return days <= 7;
  });

  newThisWeek.textContent =
    recentWeekClients.length;

  // Pipeline Overview
  const leadClients = clients.filter(function (client) {
    return client.status === "Lead";
  });

  const contactedClients = clients.filter(function (client) {
    return client.status === "Contacted";
  });

  const wonStatusClients = clients.filter(function (client) {
    return client.status === "Won";
  });

  const lostClients = clients.filter(function (client) {
    return client.status === "Lost";
  });

  leadCount.textContent = leadClients.length;
  contactedCount.textContent = contactedClients.length;
  wonCount.textContent = wonStatusClients.length;
  lostCount.textContent = lostClients.length;

  // Recent Clients
  renderRecentClients(clients);
} else {
  showEmptyDashboard();
}


