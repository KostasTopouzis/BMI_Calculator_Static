// fetches records upon loading 'account_stats.html'
document.addEventListener('DOMContentLoaded', async(event) => {
  event.preventDefault();
  try {
    const accessToken = sessionStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('You must log in before fetching records.');
    }

    const response = await fetch('/api/records', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      method: 'GET'
    });

    if(!response.ok) {
      throw new Error(response.status, response.statusText)
    }

    // else success
    const record = await response.json();

    if(!record) {
      return('You have no saved measurements. Make a new measurement and save it!');
    }
  }
  catch(error) {
    if(error.status == 500) {
      return('message');
    }
    else {
      return('Unknown server error. Please, try again later.');
    }
  }
});