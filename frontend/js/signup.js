import { displayErrMessage, checkCredentials, connectAPI } from "./auxiliary.js";

const signupForm = document.getElementById('signup-form');
const signupUsrErrMessage = document.getElementById('signup-usr-error-message');
const signupPwdErrMessage = document.getElementById('signup-pwd-error-message');
const signupGenErrMessage = document.getElementById('signup-general-error-message');

let signupErrorMessage = '';

signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const signupFormData = new FormData(signupForm);
    const username = (signupFormData.get('username') || '').trim();
    const password = signupFormData.get('password') || '';
    
    if(!username) {
        displayErrMessage(signupUsrErrMessage, 'You forgot to fill in your username!');
        return;
    }
    if(!password) {
        displayErrMessage(signupPwdErrMessage, 'You forgot to fill in your password!');
        return;
    }

    const status = checkCredentials(username, password);

    if(!status.isValid) {
        if(status.failedCredential === 'username')
            displayErrMessage(signupUsrErrMessage, status.errorMsg);
        else
            displayErrMessage(signupPwdErrMessage, status.errorMsg);
        return;
    }

    try {
        const apiResponse = await connectAPI({username, password}, 'signup');
    
        sessionStorage.setItem('apiMessage', JSON.stringify(apiResponse.username));
        window.location.href = 'welcome.html';

    } catch (error) {
      if(error.status === 401) {
        signupErrorMessage = 'This username is already taken. Please, try another one.';
      }
      else if(error.status === 500) {
        signupErrorMessage = 'An unexpected error occured. Please, try again later.';
      }
      else {
        signupErrorMessage = 'Authentication failed.';
      }

      displayErrMessage(signupGenErrMessage, signupErrorMessage);
    }
});