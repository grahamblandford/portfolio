/*  Name:    script.js
    By:      Graham Blandford
    Date:    2020-10-04
    Purpose: Scripting for INFO-3144-02-20F Project 1

*/

// Setup an constants
const SHEET_ROWS = 20;
const SHEET_COLUMNS = 10;

// Direction enumerators
const DIR_UP = 0;
const DIR_DOWN = 1;
const DIR_LEFT = 2;
const DIR_RIGHT = 3;

// KeyCode constants
const KEY_CR = 13;
const KEY_TAB = 9;

// Max decimal places
const NUM_DP = 4;

// Browser type
const IS_IE11 = ((window.navigator.userAgent).indexOf("Trident") !== -1);
const IS_CHROME = ((window.navigator.userAgent).indexOf("Chrome") !== -1);
const IS_SAFARI = ((window.navigator.userAgent).indexOf("Safari") !== -1);
        
// Setup global 2D array for data
// let sheetData = [];
var sheetData = new Array(SHEET_ROWS).fill("").map( () => new Array(SHEET_COLUMNS).fill(""));

// Globals for frequently used elements
let refInput = $gel("txt-formula");
let refLabel = $gel("lbl-formula");

// Track the current cell
// Default is A1
let currentCellId = "1_1"; 

// Track the direction we are moving
let direction = DIR_RIGHT;

// Create Spreadsheet is the entry point for
// the page
function createSpreadsheet() {

    // Build Table
    $gel("div-ss").innerHTML = buildTable();

    // Initial render of data
    renderData();

    // Set default Focus
    $gel(currentCellId).focus();

    // Add eventhandlers for Arrow Keys and Tab
    Array.from(document.getElementsByClassName("AlphaColumn")).forEach(e => {
            e.addEventListener('keydown', function(event) {
                switch (event.key) {
                    case "Tab":
                        return; // TAB is already handled intrinsically
                    case "ArrowLeft":
                        direction = DIR_LEFT;
                        break;
                    case "ArrowRight":
                        direction = DIR_RIGHT;
                        break;
                    case "Tab":
                        direction = DIR_RIGHT;
                        break;
                    case "ArrowUp":
                        direction = DIR_UP;
                        break;
                    case "ArrowDown":
                        direction = DIR_DOWN;
                        break;
                    case "Delete":
                        clearCurrentCell();
                        return;
                    default:
                        return;
                }
                setNextCell();
            });
        }
    );
}

// Clear the current cell
function clearCurrentCell() {

    refInput.value = "";
    storeData();
}

// Render the data in the table
function renderData() {

    // Iterate through the array & display
    // Row at a time left-to-right
    for (i = 0; i < SHEET_ROWS; i++) {

        for (j = 0; j < SHEET_COLUMNS; j++) {

            let id = (i + 1) + "_" + (j + 1);
            let value = sheetData[i][j];

            let elem = $gel(id);

            // Check if we have a potential formula to apply
            if ( isFormula(value) ) {
                   value = getSum(value);
                   elem.style.color = "red";
            } else {
                elem.style.color = "black";
            }

            // Round to 4DP
            if (Number(value)) {
                value = Math.round(value * Math.pow(10, NUM_DP)) / Math.pow(10, NUM_DP)
            }

            // Set the value
            elem.innerText = value;
        }   
    };
}

// Clear the data & re-render
function clearData() {

    // Empty the data
    sheetData = new Array(SHEET_ROWS).fill("").map( () => new Array(SHEET_COLUMNS).fill(""));

    // render the empty sheet
    renderData();
}

//--------------------------------------------------------------------------------------------
// Code here taken from example provided in DHTML_Table.html 
// Some minor changes to use constants SHEET_COLUMNS & SHEET_ROWS

// function builds the table based on rows and columns
function buildTable() {

    // start with the table declaration
    var elemDiv = "<table border='1' cellpadding='0' cellspacing='0' class='TableClass'>";

    // next do the column header labels
    elemDiv += "<tr><th></th>";

    for (var j = 0; j < SHEET_COLUMNS; j++) {
        elemDiv += "<th class='BaseRow'>" + String.fromCharCode(j + 65) + "</th>";
    }

    // closing row tag for the headers
    elemDiv += "</tr>";

    // now do the main table area
    for (var i = 1; i <= SHEET_ROWS; i++) {
        elemDiv += "<tr>";
        // ...first column of the current row (row label)
        elemDiv += "<td id='" + i + "_0' class='BaseColumn'>" + i + "</td>";

        // ... the rest of the columns
        for (var j = 1; j <= SHEET_COLUMNS; j++)
            elemDiv += "<td id='" + i + "_" + j + "' tabindex='" + i + "' class='AlphaColumn' onfocus='focusCell(this)' onkeypress='onKeyPressCell(this)'></td>";

        // ...end of row
        elemDiv += "</tr>";
    }

    // finally add the end of table tag
    elemDiv += "</table>";
    return elemDiv;
}

// Function to handle keypress
function onKeyPressInput() {

    // Check for Enter key ONLY
    if (window.event.keyCode === KEY_CR) {

        // Store data
        if (storeData()) {
            setNextCell();
        };
    }
}

// Function to handle keypress
function onKeyPressCell() {
    
    // Ignore the TAB key
    if (window.event.keyCode !== KEY_TAB) {

        // The expectation is that if the user wants to modify a cell,
        // he hits ENTER to edit the contents. If he starts typing,
        // we're going to replace what is in there already
        if (window.event.keyCode != KEY_CR) {
            refInput.select();
        }
        refInput.focus(); 
    }
}

// Store data in sheet
function storeData() {

    // // Get the cell coordinates
    let rc = currentCellId.split('_');
    let row = parseInt(rc[0]);
    let column = parseInt(rc[1]);

    // Validate here
    if (!validateData()) {
        return false;
    }

    // Save data to array
    sheetData[row - 1][column - 1] = refInput.value;

    // Save to current cell
    // Must do this to apply to formulas that may already exist
    $gel(currentCellId).innerText = refInput.value; 

    // Redisplay sheet data
    renderData(); 
    return true;
}

// Validate the input
function validateData() {

    let value = refInput.value;
    let errs = [];

    // Check if is a formula
    if ( isFormula(value) ) {

        // We have the makings of a formula
        let f = value.toUpperCase().substring(5, (value.length -1)).split(":");
        let formulaStart = f[0];
        let formulaEnd = f[1];

        // Retrieve the start and end ARRAY indexes 
        let startColumn = (formulaStart.charCodeAt(0)) - 65;
        let endColumn = (formulaEnd.charCodeAt(0)) - 65;

        // Retrieve the start and end rows
        let startRow = parseInt(formulaStart.substring(1)) - 1;
        let endRow = parseInt(formulaEnd.substring(1)) - 1;

        // Switch arguments if user has specified Ends before Starts
        if ( endColumn < startColumn ) {
            [endColumn, startColumn] = [startColumn, endColumn];
        } else if ( endRow < startRow ) {
            [endRow, startRow] = [startRow, endRow];
        }        

        // Check columns
        if ( ( startColumn < 0 || startColumn > SHEET_COLUMNS - 1) || (endColumn < 0 || endColumn > SHEET_COLUMNS - 1) ) {
            errs.push("Columns must be within the range of " + String.fromCharCode(65) + " to " + String.fromCharCode(SHEET_COLUMNS + 64) + ".");
        } 

        // Check rows
        if ( ( startRow < 0 || startRow > SHEET_COLUMNS - 1) || (endRow < 0 || endRow > SHEET_ROWS - 1) ) {
            errs.push("Rows must be within the range 1 to " + SHEET_ROWS + ".");
        } 
 
        // Check for circular reference
        // Get current cell coordinates
        let rc = currentCellId.split('_');
        let row = parseInt(rc[0]);
        let column = parseInt(rc[1]);

        if ( ( startRow + 1 <= row && endRow + 1 >= row) && ( startColumn + 1 <= column && endColumn + 1 >= column) ) {
            errs.push("Circular references are not supported.")
        }
    } 

    // If we have errors, display them
    // and return false
    if (errs.length > 0) {

        let errmsg = "";
        errs.forEach(e => {
            errmsg += e + "</br>";            
        });

        showAlert(errmsg);
        return false;
    }
    return true;
}
    
// Set Next Cell
function setNextCell() {

    // // Get the cell coordinates
    let rc = currentCellId.split('_');
    let row = parseInt(rc[0]);
    let column = parseInt(rc[1]);

    // Move to the next cell
    switch (direction) {
        case DIR_RIGHT:
            if (column < SHEET_COLUMNS) {
                column++;
            }
            break;
        case DIR_LEFT:
            if (column > 1) {
                column--;
            }
            break;
        case DIR_DOWN:
            if (row < SHEET_ROWS) {
                row++;
            }
            break;
        case DIR_UP:
            if (row > 1) {
                row--;
            }
            break;
    }
    currentCellId = row + "_" + column;

    // Focus to the active cell
    $gel(currentCellId).focus();    
}

// Calculate =SUM()
function getSum(value) {

    // We have the makings of a formula
    let f = value.toUpperCase().substring(5, (value.length -1)).split(":");
    let formulaStart = f[0];
    let formulaEnd = f[1];

    // Retrieve the start and end ARRAY indexes 
    let startColumn = (formulaStart.charCodeAt(0)) - 65;
    let endColumn = (formulaEnd.charCodeAt(0)) - 65;

    // Retrieve the start and end rows
    let startRow = parseInt(formulaStart.substring(1)) - 1;
    let endRow = parseInt(formulaEnd.substring(1)) - 1;

    // Switch arguments if user has specified Ends before Starts
    if ( endColumn < startColumn ) {
        [endColumn, startColumn] = [startColumn, endColumn];
    } else if ( endRow < startRow ) {
        [endRow, startRow] = [startRow, endRow];
    }

    let sum = 0;

    // Iterate rows & columns
    for (row = startRow; row <= endRow; row++) {
        for (col = startColumn; col <= endColumn; col++) {

            // Use the cell value _NOT_ the array
            let cellId = (row + 1) + "_" + (col + 1);

            // Get the data
            let data = $gel(cellId).innerText;

            // If the value is a number, add it to the total
            if (!isNaN(data)) {
                sum = sum + Number(data);
            } 
        }
    }
    // 4DP
    return ( Math.round(sum * Math.pow(10, NUM_DP)) / Math.pow(10, NUM_DP) );
}

// Display Errors
function showAlert(message) {

    // Get error div
    var elem = $gel("div-errors");

    // Check if we are clearing the div
    if (message === undefined) {
        elem.innerHTML = "";
        return;
    }

    // Show the error for a brief period
    // But allow dismissal
    var alert = '<div class="alert alert-danger alert-dismissible fade show" role="alert">' +
            message + 
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
    elem.innerHTML = alert;

    // Dismiss it after a short period
    setTimeout(function() { showAlert();}, 3000);
}   

// Determine if cell value is a formula
function isFormula(data) {

    if (data.substr(0, 4).toUpperCase() == "=SUM" 
        && data.substr(4, 1) == "(" 
        && data.substr(data.length - 1, 1) == ")" ) {
            return true;
    } 
    else {
        return false;
    }
}

// Handle the selection of a cell
function focusCell(ref) {

    // Set current cell
    currentCellId = ref.id;

    // Get the cell coordinates
    let rc = currentCellId.split('_');

    // Create for clarity
    let row = rc[0];
    let column = rc[1];

    // Update the cell label
    showLabel(String.fromCharCode(parseInt(column) + 64) + row);

    // Highlist current cell
    highlightCell(ref);

    // Populate the input with current cell data
    refInput.value = sheetData[row - 1][column - 1];
}

// Show current cell in label
function showLabel(value) {
    refLabel.innerText = value;
}

// Highlight selected cell
function highlightCell(ref) {

    // Reset all column backgrounds
    let cols = document.getElementsByClassName("AlphaColumn");

    Array.from(cols).forEach((col) => {
        col.style.backgroundColor = "";
    });

    // Highlight current cell
    ref.style.backgroundColor = "lavender";
}

// Helper function for getElementByID
function $gel(id) {
    return document.getElementById(id);
}
