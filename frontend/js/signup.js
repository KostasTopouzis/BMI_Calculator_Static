const signupForm = document.getElementById('signup-form');
const usrErrMessage = document.getElementById('usr-error-message');
const pwdErrMessage = document.getElementById('pwd-error-message');
const generalMessage = document.getElementById('general-message');

const errorMessageTimeouts = new WeakMap();
const ERROR_MESSAGE_DURATION = 5000;
const ERROR_MESSAGE_TRANSITION_DURATION = 300;

function displayErrMessage(element, message) {
  const previousTimeout = errorMessageTimeouts.get(element);
  if (previousTimeout) {
    clearTimeout(previousTimeout);
  }

  element.textContent = message;
  element.classList.add('is-visible');
  const timeout = setTimeout(() => {
    element.classList.remove('is-visible');
    setTimeout(() => {
      if (!element.classList.contains('is-visible')) {
        element.textContent = '';
      }
    }, ERROR_MESSAGE_TRANSITION_DURATION);
    errorMessageTimeouts.delete(element);
  }, ERROR_MESSAGE_DURATION);
  errorMessageTimeouts.set(element, timeout);
}

function clearErrMessage(element) {
  const timeout = errorMessageTimeouts.get(element);
  if (timeout) {
    clearTimeout(timeout);
    errorMessageTimeouts.delete(element);
  }

  element.textContent = '';
  element.classList.remove('is-visible');
}

function checkCredentials(username, password) {
  if (username.length < 8 || username.length > 50) {
    return {
      failedCredential: 'username',
      errorMsg: 'Username must be between 8 and 50 characters long.'
    };
  }

  if (password.length < 8 || password.length > 255) {
    return {
      failedCredential: 'password',
      errorMsg: 'Password must be between 8 and 255 characters long.'
    };
  }

  if (/[^\w-]/.test(username)) {
    return {
      failedCredential: 'username',
      errorMsg: 'Invalid username: only A-Z, a-z, 0-9, _ and - are allowed.'
    };
  }

  return null;
}

async function createAccount(payload) {
  const response = await fetch('http://localhost:7071/api/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const responseData = await response.json();
  if (!response.ok) {
    const error = new Error(responseData.message || 'Unable to create account.');
    error.status = response.status;
    throw error;
  }

  return responseData;
}

signupForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearErrMessage(usrErrMessage);
  clearErrMessage(pwdErrMessage);
  generalMessage.hidden = true;
  generalMessage.textContent = '';
  generalMessage.classList.remove('is-success', 'is-error');

  const formData = new FormData(signupForm);
  const username = (formData.get('username') || '').trim();
  const password = formData.get('password') || '';

  if (!username) {
    displayErrMessage(usrErrMessage, 'You forgot to fill in your username!');
    return;
  }
  if (!password) {
    displayErrMessage(pwdErrMessage, 'You forgot to fill in your password!');
    return;
  }

  const validationError = checkCredentials(username, password);
  if (validationError) {
    const fieldMessage = validationError.failedCredential === 'username'
      ? usrErrMessage
      : pwdErrMessage;
    displayErrMessage(fieldMessage, validationError.errorMsg);
    return;
  }

  const submitButton = signupForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;

  try {
    const response = await createAccount({ username, password });
    generalMessage.textContent = response.message;
    generalMessage.classList.add('is-success');
    generalMessage.hidden = false;
    signupForm.reset();
  } catch (error) {
    if (error.status === 409) {
      displayErrMessage(usrErrMessage, error.message);
    } else {
      generalMessage.textContent = error.status
        ? 'An unexpected error occurred. Please try again later.'
        : 'Unable to connect to the signup service. Please try again.';
      generalMessage.classList.add('is-error');
      generalMessage.hidden = false;
      console.error('Signup request failed:', error);
    }
  } finally {
    submitButton.disabled = false;
  }
});
