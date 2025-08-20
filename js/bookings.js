// ============================
// Global Bookings Manager
// ============================

// Read saved bookings from localStorage
let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

// ============================
// 1. Update Booking Count & List on All Pages
// ============================
document.addEventListener("DOMContentLoaded", () => {
  renderBookings();
});

// ============================
// 2. Render Bookings in Dropdown
// ============================
function renderBookings() {
  const bookingCount = document.getElementById("bookingCount");
  const bookingsList = document.getElementById("bookingsList");

  if (!bookingCount || !bookingsList) return; // In case the element doesn't exist on some pages

  if (bookings.length === 0) {
    bookingsList.innerHTML = "<p>No bookings yet.</p>";
    bookingCount.textContent = "0";
    bookingCount.style.display = "none";
    return;
  }

  bookingCount.textContent = bookings.length;
  bookingCount.style.display = "inline-block";

  bookingsList.innerHTML = bookings
    .map(
      (b, index) => `
    <div class="booking-card" data-index="${index}">
      <h4>📌 ${b.tour}</h4>
      <p><strong>Name:</strong> ${b.name}</p>
      <p><strong>Email:</strong> ${b.email}</p>
      <p><strong>Phone:</strong> ${b.phone}</p>
      <button class="cancel-btn" onclick="cancelBooking(${index})">Cancel</button>
    </div>
  `
    )
    .join("");
}

// ============================
// 3. Cancel Booking
// ============================
function cancelBooking(index) {
  bookings.splice(index, 1);
  localStorage.setItem("bookings", JSON.stringify(bookings));
  renderBookings();
}

// ============================
// 4. Dropdown Toggle
// ============================
const bookingsBtn = document.getElementById("bookingsBtn");
const bookingsDropdown = document.getElementById("bookingsDropdown");

if (bookingsBtn && bookingsDropdown) {
  bookingsBtn.addEventListener("click", (e) => {
    e.preventDefault();
    bookingsDropdown.classList.toggle("show");
  });

  document.getElementById("closeBookingsDropdown")?.addEventListener("click", () => {
    bookingsDropdown.classList.remove("show");
  });

  // Close dropdown when clicked outside
  document.addEventListener("click", (e) => {
    if (!bookingsBtn.contains(e.target) && !bookingsDropdown.contains(e.target)) {
      bookingsDropdown.classList.remove("show");
    }
  });
}
