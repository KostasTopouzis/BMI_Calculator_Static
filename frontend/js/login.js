import { displayErrMessage, checkCredentials, connectAPI } from "./auxiliary.js";

const loginForm = document.getElementById('login-form');
const loginUsrErrMessage = document.getElementById('login-usr-error-message');
const loginPwdErrMessage = document.getElementById('login-pwd-error-message');
const loginGenErrMessage = document.getElementById('login-general-error-message');

let loginErrorMessage = '';


loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const loginFormData = new FormData(loginForm);
    const username = (loginFormData.get('username') || '').trim();
    const password = loginFormData.get('password') || '';
    
    if(!username) {
        displayErrMessage(loginUsrErrMessage, 'You forgot to fill in your username!');
        return;
    }
    if(!password) {
        displayErrMessage(loginPwdErrMessage, 'You forgot to fill in your password!');
        return;
    }

    const status = checkCredentials(username, password);

    if(!status.isValid) {
        if(status.failedCredential === 'username')
            displayErrMessage(loginUsrErrMessage, status.errorMsg);
        else
            displayErrMessage(loginPwdErrMessage, status.errorMsg);
        return;
    }

    try {
        const apiResponse = await connectAPI({username, password}, 'login');

        if (typeof apiResponse.access_token !== 'string' || !apiResponse.access_token) {
            throw new Error('Login response did not include an access token.');
        }
    
        sessionStorage.setItem('access_token', apiResponse.access_token);
        sessionStorage.setItem('apiMessage', JSON.stringify(apiResponse.username));
        window.location.href = 'account.html';

    } catch (error) {
      if(error.status === 500) {
        loginErrorMessage = 'An unexpected error occured. Please, try again later.';
      }
      else {
        loginErrorMessage = 'Authentication failed.';
      }

      displayErrMessage(loginGenErrMessage, loginErrorMessage);
    }
});

