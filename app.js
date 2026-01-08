document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');

    message.style.color = "blue";
    message.innerText = "Verifying credentials...";

    try {
        // 1. Sign in with Firebase Authentication
        const userCredential = await window.signInWithEmailAndPassword(window.auth, email, password);
        const user = userCredential.user;

        // 2. Fetch the user's details from the 'users' collection
        const userDocRef = window.doc(window.db, "users", email);
        const userDoc = await window.getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            const role = userData.role;
            const division = userData.division || ""; // Get division if it exists

            // 3. Store info in LocalStorage so other pages can use it
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userRole', role);
            localStorage.setItem('userDivision', division);
            localStorage.setItem('userName', userData.name || "User");

            message.style.color = "green";
            message.innerText = `Welcome ${userData.name || ''}! Redirecting...`;

            // 4. Redirect based on role
            setTimeout(() => {
                if (role === 'admin') {
                    window.location.href = "admin.html";
                } else if (role === 'teacher') {
                    window.location.href = "teacher.html";
                } else if (role === 'parent') {
                    window.location.href = "parent.html";
                }
            }, 1500);

        } else {
            message.style.color = "red";
            message.innerText = "Error: User profile not found in database.";
        }

    } catch (error) {
        message.style.color = "red";
        message.innerText = "Login Failed: " + error.message;
    }
});
