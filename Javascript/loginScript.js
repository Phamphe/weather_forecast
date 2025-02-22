const loginBtn = document.querySelector("#login");
const registerBtn = document.querySelector("#register");
const loginForm = document.querySelector(".login-form");
const registerForm = document.querySelector(".register-form");


// Event to toggle form display
loginBtn.addEventListener('click', () => {
    loginBtn.style.backgroundColor = "#4189BA";
    registerBtn.style.backgroundColor = "rgba(255, 255, 255, 0.2)";

    loginForm.style.left = "50%";
    registerForm.style.left = "-50%";

    loginForm.style.opacity = 1;
    registerForm.style.opacity = 0;
})

registerBtn.addEventListener('click', () => {
    loginBtn.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
    registerBtn.style.backgroundColor = "#4189BA";

    loginForm.style.left = "150%";
    registerForm.style.left = "50%";

    loginForm.style.opacity = 0;
    registerForm.style.opacity = 1;
})


const logInputField = document.getElementById('logPassword');
const logInputIcon = document.getElementById('log-pass-icon');

const regInputField = document.getElementById('regPassword');
const regInputIcon = document.getElementById('reg-pass-icon');



//Easy access login
// document.getElementById('loginButton').addEventListener('click', function() {
//     const username = document.querySelector('.login-form input[type="text"]').value;
//     const password = document.querySelector('.login-form input[type="password"]').value;

//     if (username.trim() !== '' && password.trim() !== '') {
//         window.location.href = 'dashboard.html';
//     }
// });

// // Register form handler
// document.getElementById('registerButton').addEventListener('click', function() {
//     const username = document.querySelector('.register-form input[type="text"]').value;
//     const email = document.querySelector('.register-form input[placeholder="Email"]').value;
//     const password = document.querySelector('.register-form input[type="password"]').value;

//     if (username.trim() !== '' && email.trim() !== '' && password.trim() !== '') {
//         window.location.href = 'dashboard.html';
//     }
// });

//Event to View Password

function myLogPassword() {
    if (logInputField.type === 'password') {
        logInputField.type = 'text';
        logInputIcon.classList.remove("fa-lock");
        logInputIcon.classList.add("fa-eye-slash");
    } else {
        logInputField.type = 'password';
        logInputIcon.classList.remove("fa-eye-slash");
        logInputIcon.classList.add("fa-lock");
    }
}

function myRegPassword() {
    if (regInputField.type === 'password') {
        regInputField.type = 'text';
        regInputIcon.classList.remove("fa-lock");
        regInputIcon.classList.add("fa-eye-slash");
    } else {
        regInputField.type = 'password';
        regInputIcon.classList.remove("fa-eye-slash");
        regInputIcon.classList.add("fa-lock");
    }
}

// Event Listener when user starts typing
function changeIcon(value) {
    if (value.length > 0) {
        logInputIcon.classList.remove("fa-lock");
        logInputIcon.classList.add("fa-eye-slash");

        regInputIcon.classList.remove("fa-lock");
        regInputIcon.classList.add("fa-eye-slash");
    } else {

    }
}










