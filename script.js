window.onload = function() {
    updateNavbar();
    let homePage = document.getElementById("home_button");
    let loginForm = document.getElementById("login_form");
    if(loginForm) {
        loadLogin();
    } 
    else if(homePage) {
        loadHome();
    }
    else {
        loadPost();
    }
};

function loadHome() {
    fetch("data.json")
    .then(response => response.json())
    .then(data => {
        let container = document.querySelector(".left_column");
        for(let post of data.posts) {
            let card = document.createElement("div");
            card.className = "card";
            card.id = post.id;
            card.innerHTML = `
                <h2>${post.title}</h2>
                <h5>Published on ${post.date}</h5>
                <img src="images/${post.image}">
                <p>${post.paragraphs[0]}</p>
                <p>${post.paragraphs[1]}</p>
                <a href="post.html?id=${post.id}" class="read_more">Read More</a>
            `;
            container.appendChild(card);
        }
    });
}

function loadPost() {
    let params = new URLSearchParams(window.location.search);
    let postId = params.get("id");
    let key = "views_" + postId;
    let views = localStorage.getItem(key) || 0;
    localStorage.setItem(key, parseInt(views) + 1);
    fetch("data.json")
    .then(response => response.json())
    .then(data => {
        let container = document.querySelector(".left_column");
        let card = document.createElement("div");
        let post = data.posts.find(p => p.id == postId);
        card.className = "card";
        card.id = post.id;
        card.innerHTML = `
            <h2>${post.title}</h2>
            <h5>Published on ${post.date}</h5>
            <img src="images/${post.image}">
        `;
        for(let i = 2; i < post.paragraphs.length; i++) {
            card.innerHTML += `<p>${post.paragraphs[i]}</p>`;
        }
        container.appendChild(card);
    });
}

function updateNavbar() {
    let user = sessionStorage.getItem("loggedUser");
    if(user) {
        let login_button = document.getElementById("login_button");
        login_button.innerText = user[0].toUpperCase() + user.slice(1);
        login_button.style.backgroundColor = "#088fdd";
    }
}

function loadLogin() {
    let container = document.querySelector(".card");
    let user = sessionStorage.getItem("loggedUser");
    if(user) {
        container.innerHTML = `
            <h2>You are logged in!</h2>
            <p>User: <b>${user[0].toUpperCase() + user.slice(1)}</b></p>
            <button id="logout_button">Log Out</button>
        `;
        document.getElementById("logout_button").onclick = function(event) {
            event.stopPropagation();
            sessionStorage.removeItem("loggedUser");
            location.reload();
        };
    } 
    else {
        document.getElementById("login_form").onsubmit = function(f) {
            f.preventDefault();
            let user = document.getElementById("username").value;
            let password = document.getElementById("password").value;
            let regexLen = /^.{4,}$/;
            if(!regexLen.test(user)) {
                alert("Username must have at at least 4 characters!");
                return; 
            }
            if(!regexLen.test(password)) {
                alert("Password must have at at least 4 characters!");
                return; 
            }
            fetch("data.json")
            .then(response => response.json())
            .then(data => {
                let validUser = data.users.find(u => u.user == user && u.password == password);
                if(validUser) {
                    sessionStorage.setItem("loggedUser", user);
                    location.reload();
                }
                else {
                    alert("Invalid username or password!");
                }
            });
        };
    }
}

document.onkeydown = function(f) {
    let input = document.activeElement.tagName;
    if(input == 'INPUT') {
        return;
    }
    if(f.key.toLowerCase() == 'b') {
        let colors = ["red", "orange", "yellow", "lightblue", "blue", "purple"]
        let i = Math.floor(Math.random() * colors.length);
        document.body.style.backgroundColor = colors[i];
    }
    console.log(`Background color of ${f.currentTarget.nodeName} changed to: ${window.getComputedStyle(document.body).backgroundColor}`)
    setTimeout(function() {
        document.body.style.backgroundColor = "#f1f1f1";
    }, 30000);
};
