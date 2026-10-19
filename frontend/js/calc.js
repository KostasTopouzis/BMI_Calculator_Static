export default function calcBMI(formData) {
    // 1. GATHER DATA FROM THE FORM
    const poundToKg = 0.453592;
    const inchToCm = 2.54;

    // Abstract this code away in a dedicated function
    const metricWeight = formData.get('metric-weight');
    const metricHeight = formData.get('metric-height');
    let bmi;
    
    const weightInput = parseFloat(formData.get('weight')) || 0;
    const heightCmInput = parseFloat(formData.get('height-cm')) || 0;
    const heightFeetInput = parseFloat(formData.get('height-feet')) || 0;
    const heightInchesInput = parseFloat(formData.get('height-inches')) || 0;
    // console.log(`W: ${weightInput}, H: ${heightCmInput}`);
    
    // Convert all measurements to a standard unit (kg and cm) for calculation
    const weightInKg = (metricWeight === 'pd') ? weightInput * poundToKg : weightInput;
    const heightInM = (metricHeight === 'feet') ? (heightFeetInput * 12 + heightInchesInput) * inchToCm / 100 : heightCmInput / 100;
    
    bmi = weightInKg / heightInM**2;

    let heightText = metricHeight === 'feet' ? `${heightFeetInput} ft ${heightInchesInput} in` : `${heightCmInput} cm`;
    let weightText = metricWeight === 'pd' ? `${weightInput} lb` : `${weightInput} kg`;
    
    return {htTxt: heightText, 
        wtTxt: weightText,
        BMI: bmi
    }
}
