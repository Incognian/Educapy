async function register()
{
    const name = document.getElementById("reg-name").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-pass").value;

    const response = await fetch("http://localhost:3000/register/" + name + "/" + email + "/" + password,
    {
        method: 'POST'
    });
    const data = await response.json();

    console.log("test");
    console.log(data);
}