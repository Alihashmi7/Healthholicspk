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

// Add Firebase configuration (replace with your actual configuration)
const firebaseConfig = {
    apiKey: "AIzaSyBhN5xNiLKgrZNF1N1agfISDK9mzNp1eDI",
    authDomain: "healthholicspk.firebaseapp.com",
    databaseURL: "https://healthholicspk-default-rtdb.firebaseio.com",
    projectId: "healthholicspk",
    storageBucket: "healthholicspk.appspot.com",
    messagingSenderId: "956815724673",
    appId: "1:956815724673:web:bd6ff8bc87e5690ddefd80",
    measurementId: "G-62FYLL4Y9T"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get references to Firebase database and messaging
const database = firebase.database();
const messaging = firebase.messaging();

// ... (existing code)

bookingForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;

    const bookedAppointmentsRef = database.ref(`appointments/${date}`);

    // Retrieve existing appointments for the selected date
    const snapshot = await bookedAppointmentsRef.once("value");
    const bookedAppointments = snapshot.val() || [];

    if (bookedAppointments.length >= 2) {
        alert("Maximum appointments for this date have been reached.");
        return;
    }

    // Add the new appointment to the list for the selected date
    bookedAppointments.push({ name, email, time });
    bookedAppointmentsRef.set(bookedAppointments);

    // Send a notification to the nutritionist
    const notificationMessage = `${name} has booked an appointment on ${date} at ${time}.`;
    const notificationPayload = {
        notification: {
            title: "New Appointment",
            body: notificationMessage
        }
    };

    const nutritionistToken = "YOUR_NUTRITIONIST_FCM_TOKEN"; // Replace with the actual token

    await messaging.sendToDevice(nutritionistToken, notificationPayload);

    // ... (rest of your code)
});

