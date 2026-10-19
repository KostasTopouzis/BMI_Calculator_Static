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

        if (typeof apiResponse.access_token !== 'string' || !apiResponse.access_token) {
            throw new Error('Signup response did not include an access token.');
        }
    
        sessionStorage.setItem('access_token', apiResponse.access_token);
        sessionStorage.setItem('apiMessage', JSON.stringify(apiResponse.username));
        window.location.href = 'account.html';

    } catch (error) {
      if(error.status === 409) {
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