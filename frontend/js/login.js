const loginBtn = document.getElementById('login-btn');
const loginForm = document.getElementById('login-form')

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault()

    const formData = new FormData(loginForm);
    // const d = JSON.stringify(formData)
    // console.log(d, typeof d)

    try {
        const response = await fetch("http://localhost:7071/api/login", {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.body}`);
        }

        const data = await response.json();
        // console.log(data, typeof data, data.length);

        sessionStorage.setItem("apiMessage", JSON.stringify(data));

        window.location.href = "welcome.html";
    } catch (error) {
        console.error("API request failed:", error);
        // alert("Could not connect to the server.");
    }
});