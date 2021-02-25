const postForm = document.getElementById("post-form");
const postButton = document.getElementById("post-form-submit");
const postErrorMsg = document.getElementById("post-error-msg");
const deco = document.getElementById("deco");

getAllposts();
checkConnect();

function checkConnect(){

    if(localStorage.getItem("token")==null || localStorage.getItem("userId")==null ){
        localStorage.clear();
        window.location = "../loginView/login.html";
    }
}

deco.addEventListener("click", (e) => {
    e.preventDefault();
    console.log('deco');
    localStorage.clear();
    window.location = "../loginView/login.html";
})

postButton.addEventListener("click", (e) => {
    e.preventDefault();
    console.log('click');
    const gif = document.querySelector('input[type="file"]');
    const description = postForm.description.value;
    createPost(gif.files[0], description);
})

function createPost(gif, description) {
    const formData = new FormData();
    formData.append('image', gif);
    formData.append('description', description);
    formData.append('userId', localStorage.getItem('userId'));
    
    fetch('http://localhost:3000/post/create',
    {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token'),
        },
        method: "POST",
        body: formData
    })
    .then( response => response.json() )
    .then(function(res){console.log(res)});
} 

function createComment(postid){
    fetch('http://localhost:3000/comm/create',
    {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem('token'),
        },
        method: "POST",
        body: JSON.stringify({
            text: document.getElementById(postid).value,
            userId: parseInt(localStorage.getItem('userId')),
            postId: postid,
        })
    })
    .then( response => response.json())
    .then(function(res){console.log(res)});

    document.location.reload(); 
}

function getAllposts(){
    fetch('http://localhost:3000/post/getall',
    {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem('token'),
        },
        method: "GET"
    }
    )
    .then( response => response.json() )
    //.then(function(res){console.log(res)})
    .then( data => renderPosts(data));
    window.scrollTo(0, 0);
}

async function renderPosts(posts){
    for (const post of posts) {
        if ("content" in document.createElement("template")) {
            const main = document.querySelector('#posts-list')
            let template = document.querySelector("#post");
            const clone = document.importNode(template.content, true);
            let img = clone.querySelector("#gif");
            let desc = clone.querySelector("#desc");
            let date = clone.querySelector('#post-date');
            let del_post = clone.querySelector('#delete');
            let del_user = clone.querySelector('#del_usr');
            let publisher = clone.querySelector('#post-publisher');
            let button = clone.querySelector('button[type="button"]');
            let text = clone.querySelector('textarea');
            text.setAttribute("id", post.id);
            const comm_container = clone.querySelector('#comment_container');

            if(localStorage.getItem('isadmin') == 0){
                 del_post.style.display = 'none';
                 del_user.style.display = 'none';
            }
            else{
                del_post.addEventListener("click", (e) => {
                    e.preventDefault();
                    deletePost(post.id);
                });
                del_user.addEventListener("click", (e) => {
                    e.preventDefault();
                    deleteUser(post.mainuserid);
                })
            }

            button.addEventListener("click", (e) => {
                e.preventDefault();
                createComment(post.id);
            })
            
            for(const comments of post.text){
                let comm_template = document.querySelector('#comment');
                const comm_clone = document.importNode(comm_template.content, true);

                await fetch('http://localhost:3000/auth/' + comments[1],
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem('token'),
                    },
                    method: "GET"
                }
                )
                    .then( response => response.json() )
                    .then(function(res){    
                        (res.name != '' || res.surname != '' ) ? comm_clone.querySelector('#post-publisher').innerHTML = res.surname + ' ' + res.name : comm_clone.querySelector('#post-publisher').innerHTML = res.email.split('@')[0];
                    });
                let comm_text = comm_clone.querySelector('#comment_text');
                let del_com = comm_clone.querySelector('#del_comm');
                let del_usr = comm_clone.querySelector('#del_user');
                if(localStorage.getItem('isadmin') == 0) {
                    del_com.style.display = 'none';
                    del_usr.style.display = 'none';
                }
                else{
                    del_usr.addEventListener("click", (e) => {
                        e.preventDefault();
                        deleteUser(comments[1]);
                    })

                    del_com.addEventListener("click", (e) => {
                        e.preventDefault();
                        deleteComment(comments[2]);
                    })
                }
                comm_text.innerHTML = comments[0];
                comm_container.appendChild(comm_clone);
            }
            
            img.src = post.imgurl;
            desc.innerHTML = post.description;
            date.innerHTML = 'Posté le: ' + post.date.substring(0,10);
            (post.name != '' || post.surname != '' ) ? publisher.innerHTML = post.surname + ' ' + post.name : publisher.innerHTML = post.email.split('@')[0];

            main.appendChild(clone);
        }
    }
}

function deletePost(postid){
    console.log('delete post : ' + postid);
    fetch('http://localhost:3000/post/' + postid,
    {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem('token'),
        },
        method: "DELETE"
    })
    .then( response => response.json())
    .then(function(res){console.log(res)});

    document.location.reload(); 
}

function deleteComment(comid){
    console.log('delete comment : ' + comid);
    fetch('http://localhost:3000/comm/' + comid,
    {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem('token'),
        },
        method: "DELETE"
    })
    .then( response => response.json())
    .then(function(res){console.log(res)});

    document.location.reload(); 
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
    .then( response => {
        if(response.status == 200){
            return  response.json()
        } else {
            throw "unautgiruzed"
        }
       })
    .then(function(res){
        console.log(res);
            localStorage.clear();
            window.location = "../loginView/login.html";
        })
        .catch(error => { 
            console.log(error)
            alert('unauthorized!!!');
        })

}