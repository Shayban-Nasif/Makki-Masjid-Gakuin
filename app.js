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

        // 2. Fetch user details
        const userDocRef = window.doc(window.db, "users", email);
        const userDoc = await window.getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            const role = userData.role;

            // 3. Clear old session data
            localStorage.clear();

            // 4. Store Universal Info
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userRole', role);
            localStorage.setItem('userName', userData.name || "User");

            // 5. Role-Specific Logic
            if (role === 'teacher') {
                localStorage.setItem('userDivision', userData.division || "Maktab");
            } 
            
            if (role === 'parent') {
                // SIBLING LOGIC: 
                // We check for the 'children' array first. 
                // If it doesn't exist, we put the old 'childName' into an array format.
                let childrenArray = [];
                if (userData.children && Array.isArray(userData.children)) {
                    childrenArray = userData.children;
                } else if (userData.childName) {
                    childrenArray = [userData.childName];
                }

                // We save the array as a string so the Parent page can parse it
                localStorage.setItem('childrenList', JSON.stringify(childrenArray));
            }

            message.style.color = "green";
            message.innerText = `Welcome ${userData.name || ''}! Redirecting...`;

            // 6. Redirect
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
            message.innerText = "Error: User profile not found.";
        }

    } catch (error) {
        message.style.color = "red";
        message.innerText = "Login Failed: " + error.message;
    }
});
