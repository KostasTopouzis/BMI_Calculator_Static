document.addEventListener('DOMContentLoaded', () => {
    const bmiForm = document.getElementById('bmi-form');
    const metricHeightSelect = document.getElementById('metric-height');
    const metricWeightSelect = document.getElementById('metric-weight');
    const cmGroup = document.getElementById('cm-group');
    const feetInchesGroup = document.getElementById('feet-inches-group');
    const saveButton = document.getElementById('save-btn');
    const bmiResult = document.getElementById('bmi-result');

    let highlightedRow = null;

    const categories = [
        'Severe Thinness', 
        'Moderate Thinness',
        'Mild Thinness',
        'Normal',
        'Overweight',
        'Obese Class I',
        'Obese Class II',
        'Obese Class III'
    ];

    const toggleHeightInputs = () => {
        const selectedValue = metricHeightSelect.value;

        if (selectedValue === 'meters') {
            cmGroup.classList.remove('d-none');
            feetInchesGroup.classList.add('d-none');

            // Enable cm inputs, disable feet/inches inputs
            cmGroup.querySelectorAll('input').forEach(input => input.removeAttribute('disabled'));
            feetInchesGroup.querySelectorAll('input').forEach(input => input.setAttribute('disabled', 'true'));
        } else if (selectedValue === 'feet') {
            feetInchesGroup.classList.remove('d-none');
            cmGroup.classList.add('d-none');

            // Enable feet/inches inputs, disable cm inputs
            feetInchesGroup.querySelectorAll('input').forEach(input => input.removeAttribute('disabled'));
            cmGroup.querySelectorAll('input').forEach(input => input.setAttribute('disabled', 'true'));
        }
    };

    const toggleWeightUnit = () => {
        const selectedValue = metricWeightSelect.value;

        if (selectedValue === 'kg') {
            document.getElementById('weight-unit').textContent = 'kg';
        } else if (selectedValue === 'pd') {
            document.getElementById('weight-unit').textContent = 'lb';
        }
    }

    // Set initial state on page load
    toggleWeightUnit();
    toggleHeightInputs();

    // Listen for changes on the metric-height select element
    metricWeightSelect.addEventListener('change', toggleWeightUnit);
    metricHeightSelect.addEventListener('change', toggleHeightInputs);

    bmiForm.addEventListener('submit', (event) => {
        // Prevent the default form submission which reloads the page
        event.preventDefault();

        // If a row is already highlighted, remove its styling first
        if (highlightedRow) {
            highlightedRow.classList.remove('table-active', 'fs-5', 'text-light');
            highlightedRow.style.outline = 'none';
        }

        // 1. GATHER DATA FROM THE FORM
        const poundToKg = 0.453592;
        const inchToCm = 2.54;
        const formData = new FormData(bmiForm);
        const metricWeight = formData.get('metric-weight');
        const metricHeight = formData.get('metric-height');
        let bmi, idx;
        
        const weightInput = parseFloat(formData.get('weight')) || 0;
        const heightCmInput = parseFloat(formData.get('height-cm')) || 0;
        const heightFeetInput = parseFloat(formData.get('height-feet')) || 0;
        const heightInchesInput = parseFloat(formData.get('height-inches')) || 0;
        console.log(`W: ${weightInput}, H: ${heightCmInput}`);
        
        // Convert all measurements to a standard unit (kg and cm) for calculation
        const weightInKg = (metricWeight === 'pd') ? weightInput * poundToKg : weightInput;
        const heightInM = (metricHeight === 'feet') ? (heightFeetInput * 12 + heightInchesInput) * inchToCm / 100 : heightCmInput / 100;
        
        bmi = weightInKg / heightInM**2;
        
        
        // FOR DEBUGGING
        console.log(`BMI: ${bmi}`);

        
        if(bmi < 16.0) {
            idx = 0;
        } else if(bmi >= 16.0 && bmi < 17.0) {
            idx = 1;
        } else if(bmi >= 17.0 && bmi < 18.5) {
            idx = 2;
        } else if(bmi >= 18.5 && bmi < 25.0) {
            idx = 3;
        } else if(bmi >= 25.0 && bmi < 30.0) {
            idx = 4;
        } else if(bmi >= 30.0 && bmi < 35.0) {
            idx = 5;
        } else if(bmi >= 35.0 && bmi < 40.0) {
            idx = 6;
        } else if(bmi >= 40.0) {
            idx = 7;
        }
        
        const category = categories[idx];
        let heightText = metricHeight === 'feet' ? `${heightFeetInput} ft ${heightInchesInput} in` : `${heightCmInput} cm`;
        let weightText = metricWeight === 'pd' ? `${weightInput} lb` : `${weightInput} kg`;
        bmiResult.innerHTML = `Height: ${heightText}<br>Weight: ${weightText}<br>BMI: ${bmi.toFixed(2)}<br>Category: ${category}`;

        highlightedRow = document.getElementById(`cat-${idx}`);
        if(highlightedRow) {
            highlightedRow.classList.add('table-active', 'fs-5');
            highlightedRow.style.outline = '1px solid lightblue';
            highlightedRow.style.color = "white";
        }

        // MAKE SAVE BUTTON APPEAR
        saveButton.classList.remove('d-none');

    });

    bmiForm.addEventListener('reset', () => {
        bmiResult.innerHTML = "Choose your preferred metric units \
                    and fill in your measurements. Your results will show here.";
        saveButton.classList.add('d-none');
        // If a row is highlighted, remove its styling and reset the state variable
        if (highlightedRow) {
            highlightedRow.classList.remove('table-active', 'fs-5', 'text-light', 'shadow-lg');
            highlightedRow.style.outline = 'none';
            highlightedRow = null;
        }
    });
});