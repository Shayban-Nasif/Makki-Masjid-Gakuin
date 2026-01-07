document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');

    message.innerText = "Checking credentials...";

    try {
        // 1. Sign in with Firebase
        const userCredential = await window.signInWithEmailAndPassword(window.auth, email, password);
        const user = userCredential.user;

        // 2. Look up the user's role in the 'users' collection
        const userDocRef = window.doc(window.db, "users", email);
        const userDoc = await window.getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            const role = userData.role;

            message.style.color = "green";
            message.innerText = `Success! Redirecting to ${role} panel...`;

            // 3. Redirect based on role
            setTimeout(() => {
                window.location.href = `${role}.html`;
            }, 1500);
        } else {
            message.style.color = "orange";
            message.innerText = "User logged in, but no role assigned in database.";
        }

    } catch (error) {
        message.style.color = "red";
        message.innerText = "Login Error: " + error.message;
    }
});
