// Contains auxilliary functions for record fetching and saving to database

// sends record to api for saving in database.
// Accepts FormData object as argument, converts it to JSON string for fetching.
async function saveRecord(bmiData) {
  const weightInKg = bmiData.get('metric-weight') === 'kg' ? (parseFloat(bmiData.get('weight')) || 0) : ((parseFloat(bmiData.get('weight')) || 0) * 0.453592);
  const heightInCm = bmiData.get('metric-height') === 'cm' ? (parseFloat(bmiData.get('height-cm')) || 0) : (((parseFloat(bmiData.get('height-feet')) || 0) * 12 + (parseFloat(bmiData.get('height-inches')) || 0)) * 2.54);

  const bmiDataObj = {
    metricHeight: bmiData.get('metric-height'),
    metricWeight: bmiData.get('metric-weight'),
    heightCm: heightInCm,
    weightKg: weightInKg,
    bmi: weightInKg / ((heightInCm / 100)**2)
  };

  console.log(JSON.stringify(bmiDataObj));
  // use FormData in account page js and send json to module for save/fetch
  try {
    const accessToken = sessionStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('You must log in before saving a record.');
    }

    const response = await fetch('http://localhost:7071/api/records', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      method: 'POST',
      body: JSON.stringify(bmiDataObj)
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

export { saveRecord }