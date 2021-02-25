const deco = document.getElementById("deco");
const del_usr = document.getElementById("del-user");
const submit = document.querySelector('button[type="submit"]');
const loginForm = document.getElementById("usr-form");

checkConnect();

getUser();

deco.addEventListener("click", (e) => {
    e.preventDefault();
    console.log('deco');
    localStorage.clear();
    window.location = "../loginView/login.html";
})

del_usr.addEventListener("click", (e) => {
    e.preventDefault();
    deleteUser(localStorage.getItem('userId'));
})

function checkConnect(){

    if(localStorage.getItem("token")==null || localStorage.getItem("userId")==null ){
        localStorage.clear();
        window.location = "../loginView/login.html";
    }
}

submit.addEventListener("click", (e) => {
    e.preventDefault();
    fetch('http://localhost:3000/auth/user/' + localStorage.getItem('userId'),
    {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem('token'),
        },
        method: "PUT",
        body: JSON.stringify({
            surname: loginForm.surname.value,
            name: loginForm.name.value,
            role: loginForm.role.value,
        })
    })
    .then( response => response.json())
    .then(function(res){console.log(res)});

    document.location.reload();
})

function getUser(){
    fetch('http://localhost:3000/auth/' + localStorage.getItem('userId'),
    {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem('token'),
        },
        method: "GET",
    }
    )
    .then( response => response.json() )
    .then( data => renderProfil(data));
}

function renderProfil(user){

    const surname = document.getElementById("surname");
    const name = document.getElementById("name");
    const role = document.getElementById("role");

    if(user.surname !== undefined) loginForm.surname.value = user.surname;
    if(user.name !== undefined) loginForm.name.value = user.name;
    if(user.role !== undefined) loginForm.role.value = user.role;
}


function deleteUser(userid){
    console.log('delete user : ' + userid);
    fetch('http://localhost:3000/auth/user/' + userid,
    {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem('token'),
        },
        method: "DELETE"
    })
    .then( response => response.json())
    .then(function(res){console.log(res)});

    localStorage.clear();
    window.location = "../loginView/login.html";
}