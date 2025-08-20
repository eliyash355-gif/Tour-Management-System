// Initialize EmailJS
(function() {
    emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your EmailJS Public Key
})();

document.getElementById("contactForm").addEventListener("submit", function(e) {
    e.preventDefault();

    emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
        firstName: this.firstName.value,
        lastName: this.lastName.value,
        email: this.email.value,
        message: this.message.value,
    })
    .then(() => {
        document.getElementById("formMsg").innerText = "✅ Message Sent Successfully!";
        this.reset();
    }, (error) => {
        document.getElementById("formMsg").innerText = "❌ Failed to send. Try again.";
        console.error("EmailJS Error:", error);
    });
});


