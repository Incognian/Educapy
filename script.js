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
    // index.html becomes login page
    if (data.resID != null)
    {
        // if already logged in but still in index.html go to main page
        if (htmlName == 'index.html' || htmlName == '')
        {
            openPage('schedule');
        }
    }
    // if not on index.html but not logged in go to index.html
    else if (htmlName != 'index.html' && htmlName != '') openPage("index");
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
    // register doesn't automatically log into newly registered account
}

async function login()
{
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

    // if login successful save the login credentials as variables and then call redirect
    if (data.resID != null)
    {
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);
        redirect();
    }
    else alert("login failed");
}

async function showSchedule()
{
    document.querySelectorAll(".schedule-box").forEach(e => e.remove());

    const response = await fetch(con + "getClasses",
    {
        method: 'POST',
        headers:
        {
            "Content-Type": "application/json"
        },
        body: JSON.stringify
        ({
            email: localStorage.getItem('email'),
            pw: localStorage.getItem('password'),
            // ignore inputID for now
            inputID: 0
        })
    });
    const data = await response.json();
    console.log(data);

    data.forEach(e => putBox(e.hari, e.jamAwal, e.jamAkhir, e.nama, e.id, e.mapel, e.jenjang));
}

function putBox(hari, jamAwal, jamAkhir, nama, id, mapel, jenjang)
{
    const box = document.createElement("div");
    box.className = "schedule-box";
    box.innerHTML = `${mapel}<br>${jenjang}<br>${nama} (${id})`;
    let col = 1;
    if (hari == 'Selasa') col = 2;
    else if (hari == 'Rabu') col = 3;
    else if (hari == 'Kamis') col = 4;
    else if (hari == 'Jumat') col = 5;
    else if (hari == 'Sabtu') col = 6;
    else if (hari == 'Minggu') col = 7;
    
    box.style.gridColumn = `${col} / ${col + 1}`;
    box.style.gridRow = `${jamAwal - 7} / ${jamAkhir - 7}`;
    document.getElementById("actual-schedule").appendChild(box);
}

function openPage(target)
{
    window.location.href = `${target}.html`;
}

async function hideObjects()
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

    document.querySelectorAll('[viewableby]').forEach(e =>
    {
        if (e.getAttribute("viewableby") != data.tipe) e.remove();
    });
}

// async function fillRecordTable(index, tableID, columns)
// {
//     const response = await fetch()
//     {

//     }
// }

async function populateDropdown(index, dropdownID)
{
    const response = await fetch(con + "getID",
    {
        method: 'POST',
        headers:
        {
            "Content-Type": "application/json"
        },
        body: JSON.stringify
        ({
            index: index
        })
    });
    const data = await response.json();
    console.log(data);

    target = document.getElementById(dropdownID);
    data.forEach(e =>
    {
        const item = document.createElement("option");
        item.value = e.id;
        item.textContent = e.nama;

        target.appendChild(item);
    });
}

async function populateGuruDropdown()
{
    const response = await fetch(con + "getTeachers",
    {
        method: 'POST',
        headers:
        {
            "Content-Type": "application/json"
        },
        body: JSON.stringify
        ({
            email: localStorage.getItem('email'),
            pw: localStorage.getItem('password')
        })
    });

    const data = await response.json();
    console.log(data);

    const target = document.getElementById("user-selector-dropdown");

    data.forEach(e =>
    {
        const item = document.createElement("option");
        item.value = e.idPengguna;
        item.textContent = `${e.idPengguna} - ${e.namaPengguna}`;
        target.appendChild(item);
    });

    loadGuruSchedule();
}

async function loadGuruSchedule()
{
    const tbody = document.getElementById("schedule-table");
    tbody.innerHTML = "";
    console.log("test");

    const response = await fetch(con + "getClasses",
    {
        method: 'POST',
        headers:
        {
            "Content-Type": "application/json"
        },
        body: JSON.stringify
        ({
            email: localStorage.getItem('email'),
            pw: localStorage.getItem('password'),
            inputID: document.getElementById("user-selector-dropdown").value
        })
    });
    const data = await response.json();
    console.log(data);

    data.forEach(e =>
    {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${e.idKursus ?? ""}</td>
                         <td>${e.hari ?? ""}</td>
                         <td>${e.jamAwal ?? ""}</td>
                         <td>${e.jamAkhir ?? ""}</td>
                         <td classname='action-icon' onclick="deleteGuruSchedule(${e.idJadwal})">✕</td>`;
        tbody.appendChild(row);
    });
}

async function addGuruSchedule()
{
    const response = await fetch(con + "addClass",
    {
        method: 'POST',
        headers:
        {
            "Content-Type": "application/json"
        },
        body: JSON.stringify
        ({
            email: localStorage.getItem('email'),
            pw: localStorage.getItem('password'),
            param:
            [
                document.getElementById("courseID").value,
                document.getElementById("user-selector-dropdown").value,
                document.getElementById("dayVal").value,
                document.getElementById("startTime").value,
                document.getElementById("endTime").value
            ]
        })
    });
    const data = await response.json();

    if (!data.success) alert("addition failed");
    else loadGuruSchedule();
}

async function deleteGuruSchedule(inputID)
{
    console.log("here");
    const response = await fetch(con + "deleteClass",
    {
        method: 'POST',
        headers:
        {
            "Content-Type": "application/json"
        },
        body: JSON.stringify
        ({
            email: localStorage.getItem('email'),
            pw: localStorage.getItem('password'),
            inputID: inputID
        })
    });
    const data = await response.json();
    if (data.success) loadGuruSchedule();
}

// on page startup call redirect
document.addEventListener("DOMContentLoaded", redirect);
document.addEventListener("DOMContentLoaded", hideObjects);