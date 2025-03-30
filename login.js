document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const formTitle = document.getElementById("form-title");
  
  document.getElementById("show-signup").addEventListener("click", function (event) {
      event.preventDefault();
      loginForm.style.display = "none";
      signupForm.style.display = "block";
      formTitle.textContent = "Sign Up";
  });

  document.getElementById("show-login").addEventListener("click", function (event) {
      event.preventDefault();
      signupForm.style.display = "none";
      loginForm.style.display = "block";
      formTitle.textContent = "Login";
  });
});

