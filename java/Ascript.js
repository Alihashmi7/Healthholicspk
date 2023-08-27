document.addEventListener("DOMContentLoaded", function() {
    const bookingForm = document.getElementById("booking-form");
    const confirmationSection = document.getElementById("confirmation");

    // Get the current date in "YYYY-MM-DD" format
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Set the minimum allowed date for the date input field
    document.getElementById("date").setAttribute("min", currentDate);

    bookingForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const date = document.getElementById("date").value;
        const time = document.getElementById("time").value;

        // Check if the maximum appointments for the selected date have been reached
        const bookedAppointments = JSON.parse(localStorage.getItem(date)) || [];
        if (bookedAppointments.length >= 2) {
            alert("Maximum appointments for this date have been reached.");
            return;
        }

        // Add the new appointment to the list for the selected date
        bookedAppointments.push({ name, email, time });
        localStorage.setItem(date, JSON.stringify(bookedAppointments));

        document.getElementById("confirmed-name").textContent = name;
        document.getElementById("confirmed-email").textContent = email;
        document.getElementById("confirmed-date").textContent = date;
        document.getElementById("confirmed-time").textContent = time;

        bookingForm.style.display = "none";
        confirmationSection.style.display = "block";
    });
});
