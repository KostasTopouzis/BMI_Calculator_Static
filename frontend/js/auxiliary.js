const errorMessageTimeouts = new WeakMap();
const ERROR_MESSAGE_DURATION = 5000;
const ERROR_MESSAGE_TRANSITION_DURATION = 300;

// Auxiliary function for message display
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

async function connectAPI(payload, apiEndpoint) {
  const urlPath = '/api/' + apiEndpoint.trim();
  console.log(urlPath);

  try {
    const response = await fetch(urlPath, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
  
    if (!response.ok) {
      const error = new Error('Login failed');
      error.status = response.status;
      throw error;
    }

    const responseData = await response.json();

    return responseData;
    
  } catch (error) {
    // Log the error for the developer and re-throw so the caller knows it failed
    console.error("API Connection Failed:", error);
    throw error; 
  }
}

export { displayErrMessage, checkCredentials, connectAPI };