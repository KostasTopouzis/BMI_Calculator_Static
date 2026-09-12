const loginBtn = document.getElementById('login-btn');

loginBtn.addEventListener("click", async () => {

    try {
        const response = await fetch("http://localhost:7071/api/login");

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        console.log(data, typeof data, data.length);

        sessionStorage.setItem("apiMessage", JSON.stringify(data));

        window.location.href = "welcome.html";
    } catch (error) {
        console.error("API request failed:", error);
        // alert("Could not connect to the server.");
    }
});