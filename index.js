const main = document.getElementById("main");
let controller = new AbortController();

function Clear(){
    controller.abort();
    return main.innerHTML = ""
}

async function ViewComments(post){
    controller.abort();
    controller = new AbortController();
    let parsedPost = post;
    let comments = [];
    const signal = controller.signal;
    await fetch(`https://jsonplaceholder.typicode.com/posts/${parsedPost.id}/comments`, {signal})
        .then(response => response.json())
        .then(json => comments = json)
    
    let htmlcomments = "";

    for (let i = 0; i < comments.length; i++) {
        htmlcomments += `<div class="comment">
            <div class="from">From: ${comments[i].name}</div>
            <div class="body">${comments[i].body}</div>
        </div>`;
    }

    const popup = `<div class="popup" id="popup">
        <button onclick="ClosePopup()">Close</button>
        <div class="post">
            <div class="title">
                ${parsedPost.title}
            </div>
            <div class="body">
                ${parsedPost.body}
            </div>
        </div><br>
        <div id="comments">
            ${htmlcomments}
        </div>
    </div>`;
    document.getElementById("popuporigin").innerHTML = popup;

    let popupwindow = document.getElementById("popup");
    popupwindow.style.height = "0px";
    setTimeout(() => {
        popupwindow.style.height = "90vh";
    }, 500);
}

function ClosePopup(){
    controller.abort();
    controller = new AbortController();
    let popupwindow = document.getElementById("popup");
    setTimeout(() => {
        popupwindow.style.height = "0px";
    }, 1);
    setTimeout(() => {
        popupwindow.remove();
    }, 500);
}

async function ShowPosts(){
    Clear();
    controller = new AbortController();
    var posts = [];
    const signal = controller.signal;
    await fetch('https://jsonplaceholder.typicode.com/posts/', {signal})
        .then(response => response.json())
        .then(json => posts = json)

        
    for (let i = 0; i < posts.length; i++) {
        var onclicktxt = JSON.stringify(posts[i]);
        let user;
        await fetch(`https://jsonplaceholder.typicode.com/users/${posts[i].userId}`, {signal})
            .then(response => response.json())
            .then(json => user = json)
        
        main.innerHTML += `
            <div class="post">
                <div class="title">
                    ${posts[i].title}
                </div>
                <div class="body">
                    ${posts[i].body}
                </div>
                <div>By: ${user.name}</div>
                <button onclick='ViewComments(${onclicktxt})'>Comments</button>
            </div><br>`;
    }
}

async function GetTodos(){
    Clear();
    controller = new AbortController();
    let todos = [];
    const signal = controller.signal;
    await fetch('https://jsonplaceholder.typicode.com/todos/', {signal})
        .then(response => response.json())
        .then(json => todos = json)
    
    for (let i = 0; i < todos.length; i++) {
        let user;
        await fetch(`https://jsonplaceholder.typicode.com/users/${todos[i].userId}`, {signal})
            .then(response => response.json())
            .then(json => user = json)

        var status = todos[i].completed ? '<div class="status complete"></div>' : '<div class="status progress"></div>';

        main.innerHTML += `<div class="todo">
            <div class="user">${user.name}</div>
            <div class="body">${todos[i].title}</div>
            <div class="d-flex">
                Status: ${status}
            </div>
        </div>`
    }
}
