// Contains auxilliary functions for record fetching and saving to database

// sends record to api for saving in database. Accepts type json as argument
async function saveRecord(record) {
  // use FormData in account page js and send json to module for save/fetch
  try {
    const response = await fetch('/api/records', {
      headers: '',
      method: 'POST',
      body: record
    });

    if(!response.ok) {
      throw new Error(response.status, response.statusText);
    }

    // else success
    const answer = await response.json();
    if(answer.status == 200) {
      return('Measurement succesfuly saved!');
    }
  }
  catch(error) {
    if(error.status == 403) {
      return('message');
    }
    if(error.status == 500) {
      return('message');
    }
    else {
      return('Unknown server error. Please, try again later.');
    }
  }
}


// fetches records upon loading 'account_stats.html'
document.addEventListener('DOMContentLoaded', async(event) => {
  event.preventDefault();
  try {
    const response = await fetch('/api/records', {
      headers: '',
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

