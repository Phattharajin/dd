// Add Google Fonts dynamically (Mitr font)
const fontLink1 = document.createElement("link");
fontLink1.href = "https://fonts.googleapis.com/css2?family=Mitr:wght@200;300;400;500;600;700&display=swap";
fontLink1.rel = "stylesheet";
document.head.appendChild(fontLink1);

// Add preconnect to Google Fonts and Google Fonts Static
const preconnect1 = document.createElement("link");
preconnect1.rel = "preconnect";
preconnect1.href = "https://fonts.googleapis.com";
document.head.appendChild(preconnect1);

const preconnect2 = document.createElement("link");
preconnect2.rel = "preconnect";
preconnect2.href = "https://fonts.gstatic.com";
preconnect2.setAttribute("crossorigin", "");
document.head.appendChild(preconnect2);

// Create the header structure with placeholders for user info
const headerHTML = `
<head>
  <!-- FontAwesome for Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  <!-- Google Fonts (for 'Mitr' font with thinner weights) -->
  <link href="https://fonts.googleapis.com/css2?family=Mitr:wght@200;300&display=swap" rel="stylesheet">
</head>

<header>
  <div class="container-fluid p-4" style="background-color: #8B0000; display: flex; align-items: center; justify-content: space-between;">
    <!-- Left Side: Logo and University Name -->
    <div style="display: flex; align-items: center;" onclick="goToHomePage()">
      <img src="/public/img/logo.png" style="width: 55px; height: 95px; margin-right: 10px;" alt="Logo">
      <div>
        <h3 class="text-white ms-4" style="font-family: 'Mitr', sans-serif; font-weight: 200; margin: 0;">มหาวิทยาลัยแม่ฟ้าหลวง</h3>
        <h3 class="text-white ms-4" style="font-family: 'Mitr', sans-serif; font-weight: 200; margin: 0;">Mae Fah Luang University</h3>
      </div>
    </div>

    <!-- Right Side: Profile Image, Text, and Log Out Button -->
    <div style="display: flex; align-items: center; gap: 20px;">
      <!-- Profile Image -->
       

      <!-- Profile Text -->
      <div style="color: rgba(255, 255, 255, 0.7);display: flex; align-items: center;">
        <i class="fa fa-user-circle" style="font-size: 36px; margin-right: 10px;"></i>
        <div>
        <h6 id="studentID" style="font-family: 'Mitr', sans-serif; font-weight: 200; margin: 0;"></h6>
        <h6 id="userName" style="font-family: 'Mitr', sans-serif; font-weight: 200; margin: 0;"></h6>
      </div>

      <!-- Log Out Button -->
      <button id="logoutButton" 
        style="background-color: #F6D072; color: #8B0000; font-family: 'Mitr', sans-serif; font-weight: 200; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;" 
        onclick="logout()">
        Log Out
      </button>
    </div>
  </div>
</header>
`;

// Append the header to the body
document.addEventListener("DOMContentLoaded", () => {
  document.body.insertAdjacentHTML("afterbegin", headerHTML);
  fetchUserData();
});

async function goToHomePage() {
  try {
    const response = await fetch("/user-info");
    const data = await response.json();

    if (response.ok) {
      let redirectPath = "/home"; // Default path

      if (data.role === "admin") {
        redirectPath = "/admin_home";
      } else if (data.role === "committee") {
        redirectPath = "/committee_home";
      } // Users and candidates will default to "/home"

      window.location.href = redirectPath;
    } else {
      console.error("User not authenticated");
      window.location.href = "/login"; // Redirect to login if authentication fails
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    window.location.href = "/login"; // Redirect to login on error
  }
}

// Function to logout and redirect to login page
function logout() {
  fetch("/logout", { method: "POST" }).then(() => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  });
}

// Fetch user info from server
async function fetchUserData() {
  try {
    const response = await fetch("/user-info");
    const data = await response.json();

    if (response.ok) {
      document.getElementById("userName").textContent = data.name;
      document.getElementById("studentID").textContent = data.studentID || "Unknown ID"; // Set Student ID

    } else {
      console.error("User not authenticated");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}