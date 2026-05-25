const con = "http://localhost:3000/";

async function redirect()
{
    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');

    const response = await fetch(con + "getID",
    {
        method: 'POST',
        headers:
        {
            "Content-Type": "application/json"
        },
        body: JSON.stringify
        ({
            email: email,
            pw: password
        })
    });
    const data = await response.json();
    console.log(data);

    path = window.location.pathname;
    const htmlName = path.substring(path.lastIndexOf('/') + 1);
    if (data.resID != null)
    {
        if (htmlName == 'index.html') window.location.href = "schedule.html";
    }
    else if (htmlName != 'index.html') window.location.href = "index.html";
}

async function register()
{
    const name = document.getElementById("reg-name").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-pass").value;

    const response = await fetch(con + "register",
    {
        method: 'POST',
        headers:
        {
            "Content-Type": "application/json"
        },
        body: JSON.stringify
        ({
            name: name,
            email: email,
            pw: password
        })
    });
    const data = await response.json();
    console.log(data);

    alert(data.success ? "registration success" : "registration failed");
}

async function login()
{
    window.location.href = "schedule.html";
    const email = document.getElementById("log-email").value;
    const password = document.getElementById("log-pass").value;

    const response = await fetch(con + "getID",
    {
        method: 'POST',
        headers:
        {
            "Content-Type": "application/json"
        },
        body: JSON.stringify
        ({
            email: email,
            pw: password
        })
    });
    const data = await response.json();
    console.log(data);

    if (data.resID != null)
    {
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);
        redirect();
    }
    else alert("login failed");
}
