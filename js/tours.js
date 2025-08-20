const bookingOverlay = document.getElementById("bookingOverlay");
const bookingPopup = document.getElementById("bookingPopup");
const closeBookingPopup = document.getElementById("closeBookingPopup");
const bookingForm = document.getElementById("bookingForm");
const selectedTour = document.getElementById("selectedTour");
const planTripBtn = document.getElementById("planTripBtn");

document.querySelectorAll(".btn-book").forEach((btn) => {
  btn.addEventListener("click", function () {
    const tourName = this.closest(".tour-details").querySelector("h2").textContent;
    selectedTour.textContent = `You're booking: ${tourName}`;
    bookingForm.dataset.tour = tourName;

    bookingOverlay.style.display = "block";
    bookingPopup.style.display = "block";
  });
});

// Plan a Trip button
planTripBtn.addEventListener("click", (e) => {
  e.preventDefault();
  selectedTour.textContent = `You're booking a Custom Trip`;
  bookingForm.dataset.tour = "Custom Trip";

  bookingOverlay.style.display = "block";
  bookingPopup.style.display = "block";
});

// Close popup
closeBookingPopup.addEventListener("click", () => {
  bookingOverlay.style.display = "none";
  bookingPopup.style.display = "none";
});

bookingOverlay.addEventListener("click", () => {
  bookingOverlay.style.display = "none";
  bookingPopup.style.display = "none";
});

// Submit booking form
bookingForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const tour = bookingForm.dataset.tour || "Tour Not Found";

  if (!name || !email || !phone) {
    alert("Please fill in all fields.");
    return;
  }

  // Save booking globally
  let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  bookings.push({ tour, name, email, phone });
  localStorage.setItem("bookings", JSON.stringify(bookings));

  // Re-render bookings globally
  renderBookings();

  bookingOverlay.style.display = "none";
  bookingPopup.style.display = "none";
  bookingForm.reset();
  bookingForm.removeAttribute("data-tour");

  // Show success toast
  let toast = document.createElement("div");
  toast.className = "toast show";
  toast.textContent = `✅ Booking Confirmed for ${name}!`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
});
