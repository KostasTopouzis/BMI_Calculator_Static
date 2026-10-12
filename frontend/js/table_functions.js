function createHeaderRow(arr) {
    const headerRow = document.createElement("tr");
    for(let header of arr) {
        let tempCell = document.createElement('th');
        tempCell.textContent = header;
        headerRow.appendChild(tempCell);
    }
    return headerRow;
}

function createTableRow(arr) {
    const tableRow = document.createElement('tr');

    for(let item of arr) {
        let tempCell = document.createElement('td');
        tempCell.textContent = item;
        tableRow.appendChild(tempCell);
    }

    return tableRow;
}

function fillTable(table, arr, tb=false) {
    if(tb) {
        const tbody = document.createElement('tbody');
        for(let row of arr) {
            tbody.appendChild(createTableRow(row));
        }
        table.appendChild(tbody);
    }
    else {
        for(let row of arr) {
            table.appendChild(createTableRow(row));
        }
        table.appendChild(tbody);

    }
}

export {createHeaderRow, fillTable};




