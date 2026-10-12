import {createHeaderRow, fillTable} from "./table_functions.js";

const table = document.querySelector("#stats-bmi-table");
const thead = document.createElement('thead');
table.appendChild(thead);

const headers = ['Weight', 'Height', 'BMI'];
const data = [[95.4, 190.0, 29.0], [89.50, 170.56, 27.9], [78.02, 184.90, 19.23]];


const fillCountriesData = function () {
    thead.appendChild(createHeaderRow(headers));
    fillTable(table, data, true);
}

fillCountriesData();
