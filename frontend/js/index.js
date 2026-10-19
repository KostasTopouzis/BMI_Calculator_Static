import calcBMI from './calc.js'

document.addEventListener('DOMContentLoaded', () => {
    const bmiForm = document.getElementById('bmi-form');
    const saveRecordBtn = document.getElementById('save-record');
    const metricHeightSelect = document.getElementById('metric-height');
    const metricWeightSelect = document.getElementById('metric-weight');
    const cmGroup = document.getElementById('cm-group');
    const feetInchesGroup = document.getElementById('feet-inches-group');
    const bmiResult = document.getElementById('bmi-result');

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

    let highlightedRow = null;
    let formData, idx;

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

    // Set initial state on page load
    toggleWeightUnit();
    toggleHeightInputs();

    // Listen for changes on the metric-height select element
    metricWeightSelect.addEventListener('change', toggleWeightUnit);
    metricHeightSelect.addEventListener('change', toggleHeightInputs);

    bmiForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // If a row is already highlighted, remove its styling first
        if (highlightedRow) {
            highlightedRow.classList.remove('table-active', 'fs-5', 'text-light');
            highlightedRow.style.outline = 'none';
        }

        formData = new FormData(bmiForm);
        const results = calcBMI(formData);
        let bmi = results.BMI;
        let heightText = results.htTxt;
        let weightText = results.wtTxt;
        
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
        bmiResult.innerHTML = `Height: ${heightText}<br>Weight: ${weightText}<br>BMI: ${bmi.toFixed(2)}<br>Category: ${category}`;

        highlightedRow = document.getElementById(`cat-${idx}`);
        if(highlightedRow) {
            highlightedRow.classList.add('table-active', 'fs-5');
            highlightedRow.style.outline = '1px solid lightblue';
            highlightedRow.style.color = "white";
        }
    });

    bmiForm.addEventListener('reset', (event) => {
        event.preventDefault();

        bmiForm.querySelectorAll('input[type="number"]').forEach((input) => {
            input.value = '';
        });

        bmiResult.innerHTML = "Choose your preferred metric units \
                    and fill in your measurements. Your results will show here.";
        // If a row is highlighted, remove its styling and reset the state variable
        if (highlightedRow) {
            highlightedRow.classList.remove('table-active', 'fs-5', 'text-light');
            highlightedRow.style.outline = 'none';
            highlightedRow = null;
        }
    });
});