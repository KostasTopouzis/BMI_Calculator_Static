const loginBtn = document.getElementById('login-btn');

loginBtn.addEventListener('click', async () => {
    try {
        const response = await fetch('/api/hello');

        if(!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const message = await response.text();

        sessionStorage.setItem('apiMessage', message);

        window.location.href = 'welcome.html';
    } catch(error) {
        console.error('API request failed: ', error);
        alert('Could not connect to the server.');
    }
});