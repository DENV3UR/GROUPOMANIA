const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
const loginErrorMsg = document.getElementById("login-error-msg");

loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    const email = loginForm.username.value;
    const password = loginForm.password.value;
    fetchData(email, password);
})

function fetchData(mail, pass) {
    fetch('http://localhost:3000/auth/signup',
    {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: "POST",
        body: JSON.stringify({email: mail, password: pass})
    })
    .then( response => response.json() )
    .then(function(res){
        if(res.token){
            localStorage.setItem("token", res.token);
            localStorage.setItem("userId", JSON.stringify(res.userId));
            localStorage.setItem("isadmin", JSON.stringify(res.isadmin));
            window.location.href = '../postsView/postsFeed.html';
        }else {
            loginErrorMsg.style.opacity = 1;
        }
    });
}