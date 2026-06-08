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
        // if already logged in but still in index.html go to main page (schedule)
        if (htmlName == 'index.html' || htmlName == '')
        {
            openPage('schedule');
        }
    }
    // if not on index.html but not logged in go to index.html
    else if (htmlName != 'index.html' && htmlName != '') openPage("index");
}

async function kick(allowed)
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

    if (!allowed[data.resTipe - 1]) openPage('schedule');
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

async function registerAdmin()
{
    const name = document.getElementById("reg-name").value;
    const regemail = document.getElementById("reg-email").value;
    const regpw = document.getElementById("reg-pass").value;
    const tipe = document.getElementById("reg-tipe").value;

    const response = await fetch(con + "registerAdmin",
    {
        method: 'POST',
        headers:
        {
            "Content-Type": "application/json"
        },
        body: JSON.stringify
        ({
            email: localStorage.getItem("email"),
            pw: localStorage.getItem("password"),
            name: name,
            regemail: regemail,
            regpw: regpw,
            tipe: tipe
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

async function logout()
{
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    redirect();
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
            inputID: document.getElementById("user-selector-dropdown").value
        })
    });
    const data = await response.json();
    console.log(data);

    data.forEach(e => putBox(e.idJadwal, e.idKursus, e.hari, e.jamAwal, e.jamAkhir,
        e.nama, e.id, e.mapel, e.jenjang));
}

function putBox(idJadwal, idKursus, hari, jamAwal, jamAkhir, nama, id, mapel, jenjang)
{
    const box = document.createElement("div");
    box.className = "schedule-box";
    box.innerHTML = `(${idJadwal}, ${idKursus})<br>${mapel} ${jenjang}<br>${nama} (${id})`;
    let col = 1;
    if (hari == 'Selasa') col = 2;
    else if (hari == 'Rabu') col = 3;
    else if (hari == 'Kamis') col = 4;
    else if (hari == 'Jumat') col = 5;
    else if (hari == 'Sabtu') col = 6;
    else if (hari == 'Minggu') col = 7;
    
    box.style.gridColumn = `${col} / ${col + 1}`;
    box.style.gridRow = `${jamAwal - 7} / ${jamAkhir - 7}`;
    box.style.maxHeight = `${10 * (jamAkhir - jamAwal)}rem`;
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

    if (data != null && data.resTipe != 3)
        document.querySelectorAll('[viewableby]').forEach(e =>
        {
            if (e.getAttribute("viewableby") != data.resTipe) e.style.display = "none";
        });
}

async function populateDropdown(index, dropdownID)
{
    const response = await fetch(con + "getItems",
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
    target.value = null;
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
    target.value = null;
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

async function changeAccountInformation() {
    // 1. Grab all input textContents
    const email1 = document.getElementById("email-kontak-1").value.trim();
    const email2 = document.getElementById("email-kontak-2").value.trim();
    const phone1 = document.getElementById("nomor-kontak-1").value.trim();
    const phone2 = document.getElementById("nomor-kontak-2").value.trim();
    const jenjang = document.getElementById("idJenjang").value;
    const pengalaman1 = document.getElementById("pengalaman-1").value.trim();
    const pengalaman2 = document.getElementById("pengalaman-2").value.trim();

    // 2. Decouple them into separate arrays
    const emailList = [];
    if (email1) emailList.push(email1);
    if (email2) emailList.push(email2);

    const phoneList = [];
    if (phone1) phoneList.push(phone1);
    if (phone2) phoneList.push(phone2);

    const pengalamanList = [];
    if (pengalaman1) pengalamanList.push(pengalaman1);
    if (pengalaman2) pengalamanList.push(pengalaman2);

    try {
        // 3. Send decoupled data arrays to the server
        const response = await fetch(con + "changeAccountInformation", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                accountEmail: localStorage.getItem('email'), 
                accountPw: localStorage.getItem('password'),
                emails: emailList,  // Array of strings: ["e1", "e2"]
                phones: phoneList,   // Array of strings: ["p1", "p2"]
                jenjang: jenjang,
                pengalamans: pengalamanList // Array of strings: ["peng1", "peng2"]
            })
        });

        const data = await response.json();
        
        if (data.success) {
            alert("Account information changed successfully!");
        } else {
            alert("Update failed: " + (data.message || "Unknown error"));
        }

    } catch (error) {
        console.error("Network error:", error);
        alert("Server connection failed.");
    }
}

async function loadAccountInformation()
{
    const response = await fetch(con + "getContacts",
    {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: localStorage.getItem('email'), 
            pw: localStorage.getItem('password')
        })
    });

    const data = await response.json();
    console.log(data);

    if (data.resEmail.length > 0)
        document.getElementById("email-kontak-1").value =
        `${data.resEmail[0].alamatEmail}`;
    if (data.resEmail.length > 1)
        document.getElementById("email-kontak-2").value =
        `${data.resEmail[1].alamatEmail}`;
    if (data.resPhone.length > 0)
        document.getElementById("nomor-kontak-1").value =
        `${data.resPhone[0].nomorTelepon}`;
    if (data.resPhone.length > 1)
        document.getElementById("nomor-kontak-2").value =
        `${data.resPhone[1].nomorTelepon}`;
    if (data.resPengalaman.length > 0)
        document.getElementById("pengalaman-1").value =
        `${data.resPengalaman[0].deskripsi}`;
    if (data.resPengalaman.length > 1)
        document.getElementById("pengalaman-2").value =
        `${data.resPengalaman[1].deskripsi}`;
    if (data.resJenjang != null)
        document.getElementById("idJenjang").value =
        `${data.resJenjang}`;
}

async function searchAccount()
{
    const response = await fetch(con + "searchUser",
    {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            inputID: document.getElementById("search-ID").value
        })
    });

    const data = await response.json();
    console.log(data);

    if (data.resEmail.length > 0)
        document.getElementById("email-kontak-1-res").textContent =
        `${data.resEmail[0].alamatEmail}`;
    else document.getElementById("email-kontak-1-res").textContent = "-";
    if (data.resEmail.length > 1)
        document.getElementById("email-kontak-2-res").textContent =
        `${data.resEmail[1].alamatEmail}`;
    else document.getElementById("email-kontak-2-res").textContent = "-";
    if (data.resPhone.length > 0)
        document.getElementById("nomor-kontak-1-res").textContent =
        `${data.resPhone[0].nomorTelepon}`;
    else document.getElementById("nomor-kontak-1-res").textContent = "-";
    if (data.resPhone.length > 1)
        document.getElementById("nomor-kontak-2-res").textContent =
        `${data.resPhone[1].nomorTelepon}`;
    else document.getElementById("nomor-kontak-2-res").textContent = "-";
    if (data.resPengalaman.length > 0)
        document.getElementById("pengalaman-1-res").textContent =
        `${data.resPengalaman[0].deskripsi}`;
    else document.getElementById("pengalaman-1-res").textContent = "-";
    if (data.resPengalaman.length > 1)
        document.getElementById("pengalaman-2-res").textContent =
        `${data.resPengalaman[1].deskripsi}`;
    else document.getElementById("pengalaman-2-res").textContent = "-";
    if (data.resJenjang != null)
        document.getElementById("idJenjang-res").textContent =
        `${data.resJenjang}`;
    else document.getElementById("idJenjang-res").textContent = "-";
}

async function loadWillingness()
{
    const tbody = document.getElementById("willingness-table");
    tbody.innerHTML = "";

    const response = await fetch(con + "getWillingness",
    {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: localStorage.getItem('email'), 
            pw: localStorage.getItem('password'),
            inputID: document.getElementById("user-selector-dropdown").value
        })
    });

    const data = await response.json();

    data.forEach(e =>
    {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${e.namaMapel ?? ""}</td>
                         <td>${e.namaJenjang ?? ""}</td>
                         <td classname='action-icon' onclick="deleteWillingness(${e.idMapel}, ${e.idJenjang})">✕</td>`;
        tbody.appendChild(row);
    });
}

async function addWillingness()
{
    const response = await fetch(con + "addWillingness",
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
                document.getElementById("user-selector-dropdown").value,
                document.getElementById("idMapel").value,
                document.getElementById("idJenjang").value
            ]
        })
    });
    const data = await response.json();

    if (!data.success) alert("addition failed");
    else loadWillingness();
}

async function deleteWillingness(idMapel, idJenjang)
{
    console.log("here");
    const response = await fetch(con + "deleteWillingness",
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
            inputID: document.getElementById("user-selector-dropdown").value,
            idMapel: idMapel,
            idJenjang: idJenjang
        })
    });
    const data = await response.json();
    if (data.success) loadWillingness();
}

async function loadSlots()
{
    const tbody = document.getElementById("schedule-table");
    tbody.innerHTML = "";
    console.log("loading slots");

    // Determine which guru to load slots for
    const guruID = document.getElementById("user-selector-dropdown").value;

    const response = await fetch(con + "getSlots",
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
            inputID: guruID
        })
    });
    const data = await response.json();
    console.log(data);

    data.forEach(e =>
    {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${e.hari ?? ""}</td>
                         <td>${e.jamAwal ?? ""}</td>
                         <td>${e.jamAkhir ?? ""}</td>
                         <td classname='action-icon' onclick="deleteSlot('${e.hari}', ${e.jamAwal}, ${e.jamAkhir})">✕</td>`;
        tbody.appendChild(row);
    });
}

async function addSlot()
{
    const guruID = document.getElementById("user-selector-dropdown").value;
    
    const response = await fetch(con + "addSlot",
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
                guruID,
                document.getElementById("dayVal").value,
                document.getElementById("startTime").value,
                document.getElementById("endTime").value
            ]
        })
    });
    const data = await response.json();

    if (!data.success) alert("addition failed");
    else loadSlots();
}

async function deleteSlot(hari, jamAwal, jamAkhir)
{
    const response = await fetch(con + "deleteSlot",
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
            idGuru: document.getElementById("user-selector-dropdown").value,
            hari: hari,
            jamAwal: jamAwal,
            jamAkhir: jamAkhir
        })
    });
    const data = await response.json();
    if (data.success) loadSlots();
}

let selectedTimeSlots = [];

function selectRow(row)
{
    selectedTimeSlots.push(row);
    
    const cell = row.children[5];
    cell.setAttribute("onclick", "deselectRow(this.parentElement)");
    cell.textContent = "✕";
    
    row.remove();
    document.getElementById("selected-time-slots").appendChild(row);
}

function deselectRow(row)
{
    selectedTimeSlots.filter(item => item !== row);
    
    const cell = row.children[5];
    cell.setAttribute("onclick", "selectRow(this.parentElement)");
    cell.textContent = "✛";
    
    row.remove();
    document.getElementById("unselected-time-slots").appendChild(row);
}

async function showValidSlots()
{
    selectedTimeSlots = [];
    const response = await fetch(con + "iHateMyself",
    {
        method: 'POST',
        headers:
        {
            "Content-Type": "application/json"
        },
        body: JSON.stringify
        ({
            mapel: document.getElementById('mapel').value,
            jenjang: document.getElementById('jenjang').value
        })
    });
    const data = await response.json();
    console.log(data);

    const tbody = document.getElementById("unselected-time-slots");
    tbody.innerHTML = "";
    document.getElementById("selected-time-slots").innerHTML = "";

    data.forEach(e =>
    {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${e.idGuru ?? ""}</td>
                        <td>${e.namaGuru ?? ""}</td>
                        <td>${e.hari ?? ""}</td>
                        <td>${e.jamAwal ?? ""}</td>
                        <td>${e.jamAkhir ?? ""}</td>
                        <td class='action-icon' onclick="selectRow(this.parentElement)">✛</td>`;
        row.value =
        {
            idGuru: e.idGuru,
            hari: e.hari,
            jamAwal: e.jamAwal,
            jamAkhir: e.jamAkhir
        }
        tbody.appendChild(row);
    });
}

async function createCourse()
{
    let rows = [];
    for (const e of selectedTimeSlots) rows.push(e.value);
    console.log(rows);

    const response = await fetch(con + "hardestPartHere",
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
            mapel: document.getElementById('mapel').value,
            jenjang: document.getElementById('jenjang').value,
            tanggalAwal: document.getElementById('tanggalAwal').value,
            tanggalAkhir: document.getElementById('tanggalAkhir').value,
            rows: rows
        })
    });
    const data = await response.json();
    
    if (!data.success) alert("course creation failed!");
    else
    {
        alert("course creation success!");
        openPage("schedule");
    }
}

// on page startup call redirect and hideObjects
document.addEventListener("DOMContentLoaded", redirect);
document.addEventListener("DOMContentLoaded", hideObjects);