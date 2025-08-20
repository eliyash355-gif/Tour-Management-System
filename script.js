
// ============================
// Auto changing images
// ============================
const images = [
  "assets/auto changing images/img (1).jpg",
  "assets/auto changing images/img (2).jpg",
  "assets/auto changing images/img (3).jpg",
  "assets/auto changing images/img (4).jpg",
  "assets/auto changing images/img (5).jpg"
];

let currentIndex = 0;
let showingFirst = true;

const img1 = document.getElementById("aboutImage1");
const img2 = document.getElementById("aboutImage2");

setInterval(() => {
  currentIndex = (currentIndex + 1) % images.length;

  if (showingFirst) {
    img2.src = images[currentIndex];
    img2.style.opacity = 1;
    img1.style.opacity = 0;
  } else {
    img1.src = images[currentIndex];
    img1.style.opacity = 1;
    img2.style.opacity = 0;
  }

  showingFirst = !showingFirst;
}, 6000);

// ============================
// Location Popup
// ============================
function togglePopup(id) {
  const popup = document.getElementById(id);
  const allPopups = document.querySelectorAll('.popup');

  allPopups.forEach(p => {
    if (p.id !== id) p.style.display = "none";
  });

  popup.style.display = (popup.style.display === "block") ? "none" : "block";
}

document.addEventListener("click", function(e) {
  if (!e.target.closest(".trip-item")) {
    document.querySelectorAll(".popup").forEach(p => p.style.display = "none");
  }
});

function selectLocation(e, location) {
  e.stopPropagation();
  document.getElementById("locationInput").value = location;
  document.getElementById("location-popup").style.display = "none";
}

// ============================
// Date Picker (Flatpickr)
// ============================
const fp = flatpickr("#dateInput", {
  dateFormat: "F j, Y",
  minDate: "today",
  disableMobile: true,
  clickOpens: false,
  position: "below"
});

const dateInput = document.getElementById("dateInput");
dateInput.addEventListener("click", function(e) {
  e.stopPropagation();
  fp.isOpen ? fp.close() : fp.open();
});

document.addEventListener("click", function(e) {
  if (!e.target.closest(".trip-item")) {
    fp.close();
  }
});

// ============================
// Tour Card Active Effect
// ============================
const cards = document.querySelectorAll(".tour-card");
cards.forEach(card => {
  card.addEventListener("click", () => {
    cards.forEach(c => c.classList.remove("active"));
    card.classList.add("active");
  });
});

// ============================
// Modal Open / Close
// ============================
function openModal() {
  document.getElementById("searchModal").style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("searchModal").style.display = "none";
  document.body.style.overflow = "auto";
}

window.addEventListener("click", function(e) {
  const modal = document.getElementById("searchModal");
  if (e.target === modal) {
    closeModal();
  }
});

// ============================
// Search Logic + Render Results
// ============================
document.querySelector(".search-glass").addEventListener("click", function() {
  const location = document.getElementById("locationInput").value;
  const date = document.getElementById("dateInput").value;

  if (!location || !date) {
    alert("Please select a location and date first.");
    return;
  }

  const tours = {
    "Brazil, South America": [
      { img: "assets/images/amazon.jpg", title: "Enchanted Amazon Escape", desc: "Venture deep into the Amazon with vibrant wildlife and towering trees.", price: "$1,250 / person" },
      { img: "assets/images/Pantanal.jpg", title: "Pantanal Wildlife Escape", desc: "Explore the Pantanal, home to jaguars, capybaras and hundreds of bird species.", price: "$980 / person" },
      { img: "assets/images/atlantic-forest.jpg", title: "Atlantic Forest Journey", desc: "Explore the Atlantic Forest, home to jaguars, capybaras and hundreds of bird species.", price: "$820 / person" }
    ],
    "USA, North America": [
      { img: "assets/images/rockies.jpg", title: "Rockies Summit Escape", desc: "Climb into the breathtaking Rocky Mountains with alpine meadows and peaks.", price: "$1,450 / person" },
      { img: "assets/images/sierra.jpg", title: "Sierra Nevada Ascent", desc: "Climb into the breathtaking Rocky Mountains with alpine meadows and peaks.", price: "$1,100 / person" }
    ],
    "Bali & Komodo, Indonesia": [
      { img: "assets/images/bali.jpg", title: "Bali Beach Retreat", desc: "Unwind along Bali’s golden shores with waves and temples.", price: "$1,100 / person" },
      { img: "assets/images/komodo.jpg", title: "Komodo Island Escape", desc: "Relax on pink-sand beaches and swim in crystal-clear waters", price: "$1,100 / person" }
    ],
    "Paris, France": [
      { img: "assets/images/paris.jpg", title: "Paris Romantic Escape", desc: "Stroll along the Seine and marvel at the Eiffel Tower.", price: "$1,100 / person" }
    ]
  };

  const resultsContainer = document.getElementById("searchResults");
  resultsContainer.innerHTML = "";

  if (tours[location]) {
    tours[location].forEach(tour => {
      const card = `
        <div class="result-card">
          <img src="${tour.img}" alt="${tour.title}">
          <div class="result-details">
            <h3>${tour.title}</h3>
            <p>${tour.desc}</p>
            <p class="price">Price: ${tour.price}</p>
            <button class="btn-confirm" data-tour="${tour.title}">Confirm Booking</button>
          </div>
        </div>
      `;
      resultsContainer.innerHTML += card;
    });

    document.querySelectorAll(".btn-confirm").forEach(btn => {
      btn.addEventListener("click", () => {
        closeModal();
        bookingOverlay.style.display = "block";
        bookingPopup.style.display = "block";
        document.getElementById("bookingForm").setAttribute("data-tour", btn.dataset.tour);
        console.log("Selected tour:", btn.dataset.tour); // Debugging log
      });
    });

  } else {
    resultsContainer.innerHTML = "<p>No tours available for this location.</p>";
  }

  openModal();
});

// ============================
// Close Popup Logic
// ============================
const bookingOverlay = document.getElementById("bookingOverlay");
const bookingPopup = document.getElementById("bookingPopup");
const closeBookingPopup = document.getElementById("closeBookingPopup");

bookingOverlay.addEventListener("click", () => {
  bookingOverlay.style.display = "none";
  bookingPopup.style.display = "none";
});

closeBookingPopup.addEventListener("click", () => {
  bookingOverlay.style.display = "none";
  bookingPopup.style.display = "none";
});

// ============================
// Booking + Dropdown + localStorage
// ============================
const bookingsBtn = document.getElementById("bookingsBtn");
const bookingsDropdown = document.getElementById("bookingsDropdown");
let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

// Load saved bookings when page loads
document.addEventListener("DOMContentLoaded", renderBookings);

// Toggle dropdown
bookingsBtn.addEventListener("click", (e) => {
  e.preventDefault();
  bookingsDropdown.classList.toggle("show");
});

// Booking submission
document.getElementById("bookingForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const bookingForm = document.getElementById("bookingForm");

  // ✅ Always ensure correct tour name
  let tour = bookingForm.dataset.tour;
  if (!tour || tour === "undefined" || tour.trim() === "") {
    tour = document.querySelector(".btn-confirm[data-tour]")?.dataset.tour || "Unknown Tour";
  }

  if (!name || !email || !phone) {
    alert("Please fill in all fields.");
    return;
  }

  bookings.push({ tour, name, email, phone });
  localStorage.setItem("bookings", JSON.stringify(bookings)); // ✅ Save to localStorage
  renderBookings();

  bookingOverlay.style.display = "none";
  bookingPopup.style.display = "none";
  bookingForm.reset();
  bookingForm.removeAttribute("data-tour");

  const toast = document.getElementById("bookingToast");
  toast.textContent = `✅ Booking Confirmed for ${name}, we'll call you shortly!`;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
});

// ✅ Render Bookings with localStorage
function renderBookings() {
  const bookingCount = document.getElementById("bookingCount");
  const bookingsList = document.getElementById("bookingsList");

  if (bookings.length === 0) {
    bookingsList.innerHTML = "<p>No bookings yet.</p>";
    bookingCount.textContent = "0";
    bookingCount.style.display = "none";
    return;
  }

  bookingCount.textContent = bookings.length;
  bookingCount.style.display = "inline-block";

  bookingsList.innerHTML = bookings.map((b, index) => `
    <div class="booking-card" data-index="${index}">
      <h4>📌 ${b.tour}</h4>
      <p><strong>Name:</strong> ${b.name}</p>
      <p><strong>Email:</strong> ${b.email}</p>
      <p><strong>Phone:</strong> ${b.phone}</p>
      <button class="cancel-btn" onclick="cancelBooking(${index})">Cancel</button>
    </div>
  `).join("");
}

// Cancel Booking + Update localStorage
function cancelBooking(index) {
  bookings.splice(index, 1);
  localStorage.setItem("bookings", JSON.stringify(bookings)); // ✅ Update storage
  renderBookings();
}

// Close dropdown manually
document.getElementById("closeBookingsDropdown").addEventListener("click", () => {
  bookingsDropdown.classList.remove("show");
});

// Close dropdown if clicked outside
document.addEventListener("click", (e) => {
  if (!bookingsBtn.contains(e.target) && !bookingsDropdown.contains(e.target)) {
    bookingsDropdown.classList.remove("show");
  }
});
