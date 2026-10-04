const loginForm = document.getElementById('login-form')
const usrErrMessage = document.getElementById('usr-error-message');
const pwdErrMessage = document.getElementById('pwd-error-message');
const genErrMessage = document.getElementById('general-error-message');


// Auxiliary function for message display
function displayErrMessage(element, message) {
  element.textContent = message;
  element.style.display = 'flex';
  setTimeout(() => {
    element.style.display = 'none';
  }, 5000);
}

function displayGeneralErrMessage(message) {
    genErrMessage.textContent = message;
    genErrMessage.style.display = 'flex';
    setTimeout(() => {
        genErrMessage.style.display = 'none';
    }, 5000);
}

function checkCredentials(username, password) {
  if (username.length < 8) {
    return {
        isValid: false, 
        failedCredential: 'username',
        errorMsg: 'Username should be at least 8 characters long'
    };
  }
  
  if (password.length < 8) {
    return {
        isValid: false, 
        failedCredential: 'password',
        errorMsg: 'Password must be at least 8 characters long'
    };
  }
  
  if (/[^\w-]/.test(username)) { 
    return {
        isValid: false, 
        failedCredential: 'username',
        errorMsg: 'Invalid username: only A-Z, a-z, 0-9 and _ are allowed'
    };
  }
 
  return {
    isValid: true, 
    errorMsg: null
  };
}


async function connectAPI(payload) {
  try {
    const response = await fetch('http://localhost:7071/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
  
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
    }

    const responseData = await response.json();
    return responseData;
    
  } catch (error) {
    // Log the error for the developer and re-throw so the caller knows it failed
    console.error("API Connection Failed:", error);
    throw error; 
  }
}

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(loginForm);
    const username = (formData.get('username') || '').trim();
    const password = formData.get('username') || '';
    
    if(!username) {
        displayErrMessage(usrErrMessage, 'You forgot to fill in your username!');
        return;
    }
    if(!password) {
        displayErrMessage(pwdErrMessage, 'You forgot to fill in your password!');
        return;
    }

    const status = checkCredentials(username, password);

    if(!status.isValid) {
        if(status.failedCredential === 'username')
            displayErrMessage(usrErrMessage, status.errorMsg);
        else
            displayErrMessage(pwdErrMessage, status.errorMsg);
        return;
    }

    try {
        const apiResponse = await connectAPI({username, password});

        sessionStorage.setItem('apiMessage', JSON.stringify(apiResponse));
        window.location.href = 'welcome.html';

    } catch (error) {
        displayGeneralErrMessage('Login failed. Please, try again later.');
    }
});