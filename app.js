document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const role = document.getElementById('role').value;

    // Temporary simulation of login
    const message = document.getElementById('message');
    message.style.color = "green";
    message.innerText = `Attempting to login as ${role}...`;

    console.log("Login details:", email, role);
    
    // In the next step, we will connect this to Firebase!
});
