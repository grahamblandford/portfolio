/*  Name:    app.js
    By:      Graham Blandford
    Date:    2020-11-21
    Purpose: Client-side Scripting for INFO-3144-02-20F Project 2
*/

// Setup an constants
const VIEW = 0;
const EDIT = 1;
const ADDNEW = 2;

// Globals

// edit Modes
let editMode;

// Customer object used to handle some state nuances
let customer = {
    CusID: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",

    recordLength: function () {
        let len = 0;
        Object.keys(this).forEach(e => len += this[e].length);
        return len;
        },

    clear: function () {
        this.CusID = ""
        this.firstName = ""
        this.lastName = ""
        this.address = ""
        this.city = ""
        this.province = ""
        this.postalCode = ""
        }
    };

// ***************************************************
// post Request event handlers uses jQuery .post method
// to issue request and process response (callback)

// Initial page load
function init() {

    // set VIEW only
    editMode = VIEW;

    // render form
    renderForm();
}

// Render th form controls
function renderForm() {

    if (editMode == VIEW) {

        $gel("customer-id").disabled = false;
        $gel("first-name").disabled = true;
        $gel("last-name").disabled = true;
        $gel("address").disabled = true;
        $gel("city").disabled = true;
        $gel("province").disabled = true;
        $gel("postal-code").disabled = true;

        $gel("btn-search").disabled = false;
        $gel("btn-create").disabled = false;
        $gel("btn-edit").disabled = (customer.recordLength() == 0);
        $gel("btn-undo").disabled = true;
        $gel("btn-save").disabled = true;
        $gel("btn-delete").disabled = (customer.recordLength() == 0);

    } else if (editMode == ADDNEW || editMode == EDIT) {

        $gel("customer-id").disabled = true;
        $gel("first-name").disabled = false;
        $gel("last-name").disabled = false;
        $gel("address").disabled = false;
        $gel("city").disabled = false;
        $gel("province").disabled = false;
        $gel("postal-code").disabled = false;

        $gel("btn-search").disabled = true;
        $gel("btn-create").disabled = true;
        $gel("btn-edit").disabled = true;
        $gel("btn-undo").disabled = false;
        $gel("btn-save").disabled = false;
        $gel("btn-delete").disabled = true;
    }
}

// Populate the form data from the customer object
function renderCustomer() {

    // Update the UI
    $gel("customer-id").value = customer.CusID;
    $gel("first-name").value = customer.firstName;
    $gel("last-name").value = customer.lastName;
    $gel("address").value = customer.address;
    $gel("city").value = customer.city;
    $gel("province").value = customer.province;
    $gel("postal-code").value = customer.postalCode;
}

// Display customers
function displayCustomers() {

    let div = $gel("display-customers-modal-body");

    let html = '<table id="table - activity" class="table table - light table - striped">' +
                    '<thead class="thead-dark">' +
                        '<tr>' +
                        '    <th scope="row" colspan="4" style="text-align: center;">Customers</th>' +
                        '</tr>' +
                        '<tr>' +
                        '    <th scope="col">Customer No.</th>' +
                        '    <th scope="col">Full Name</th>' +
                        '    <th scope="col">City</th>' +
                        '    <th scope="col"></th>' +
                        '</tr>' +
                    '</thead >' +
                    '<tbody id="tbody-customers">'

    $.post("/customers/list", {
    },
        // callback function returns status and data as object literal
        function (data, status) {

            // data represents an array of customers
            let customers = data.data;

            // if we have customers
            if (customers.length) {

                customers.forEach(customer => {
                    html += '<tr>' +
                        '<td>' + customer.CusID + '</td>' +
                        '<td>' + customer.FullName + '</td>' +
                        '<td>' + customer.City + '</td>' +
                        '<td><button type="button" class="btn btn-danger" data-dismiss="modal" value="' + customer.CusID + '" onclick="setCustomer(this);">Select</button></td>' +
                        '</tr>';
                });

            } else {
                html += '<tr>' +
                    '<td>No customers found.</td>' +
                    '</tr>';
             }

            html += '</tbody>' +
                '</table >';
            div.innerHTML = html;
        });
}

// Function to interface the modal customer
// with getCustomer
function setCustomer(e) {

    $($gel("display-customers-modal")).modal('hide');
    $gel("customer-id").value = e.value;
    getCustomer();
}

// Get customer
function getCustomer() {

    let id = $gel("customer-id").value;

    if (id > '') {

        $.post("/customers/get", {
            CusID: id
        },
            // callback function returns status and data as object literal
            function (data, status) {
                if (data.errors) {
                    showAlert(data.errors);

                    // Clear customer
                    customer.clear();

                    // Render Customer
                    renderCustomer();

                    // Render Form
                    renderForm();

                } else {
                    $gel("first-name").value = data.firstName;
                    $gel("last-name").value = data.lastName;
                    $gel("address").value = data.address;
                    $gel("city").value = data.city;
                    $gel("province").value = data.province;
                    $gel("postal-code").value = data.postalCode;

                    // Edit customer
                    // We could put this into auto-edit mode
                    // by omitting the VIEW:
                    //
                    // editCustomer(VIEW);

                    // View Customer
                    editCustomer(VIEW);
                }
            });

    } else {

        $($gel("display-customers-modal")).modal();
        displayCustomers();
        return;
    }
} 

// Create a customer
function createCustomer() {

    // Use the object for temporary storage
    // & to determine edit state

    // Clear customer Object
    customer.clear();

    // Render Customer
    renderCustomer();

    // Edit (NEW) Customer
    editCustomer(ADDNEW);
}

// Edit a customer
function editCustomer(mode = EDIT) {

    // Use the object for temporary storage
    // & to determine edit state
    customer.CusID = $gel("customer-id").value
    customer.firstName = $gel("first-name").value
    customer.lastName = $gel("last-name").value
    customer.address = $gel("address").value
    customer.city = $gel("city").value
    customer.province = $gel("province").value
    customer.postalCode = $gel("postal-code").value

    // Set the edit mode
    editMode = mode;
    renderForm();

    // Set focus to first field
    $gel("first-name").focus();

}

function cancelEdit() {

    // Revert changes
    renderCustomer();

    // Switch back to view mode
    editMode = VIEW;
    renderForm();
}

// Save customer
function saveCustomer() {

    // Check if we are adding or uodating
    if (editMode == ADDNEW) {
        insertCustomer();
    } else if (editMode == EDIT) {
        updateCustomer();
    }
} 

function insertCustomer() {

    $.post("/customers/create", {
        firstName: $gel("first-name").value,
        lastName:$gel("last-name").value,
        address: $gel("address").value,
        city: $gel("city").value,
        province: $gel("province").value,
        postalCode: $gel("postal-code").value
    },
        // callback function returns status and data as object literal
        function (data, status) {
            if (data.errors) {
                showAlert(data.errors);
            } else {
                $gel("customer-id").value = data.CusID;

                // Assign values to the customer record
                customer.CusID = $gel("customer-id").value
                customer.firstName = $gel("first-name").value
                customer.lastName = $gel("last-name").value
                customer.address = $gel("address").value
                customer.city = $gel("city").value
                customer.province = $gel("province").value
                customer.postalCode = $gel("postal-code").value

                editMode = VIEW;
                renderForm();
            }
        });
}

function updateCustomer() {

    $.post("/customers/update", {
        CusID: parseInt($gel("customer-id").value),
        firstName: $gel("first-name").value,
        lastName: $gel("last-name").value,
        address: $gel("address").value,
        city: $gel("city").value,
        province: $gel("province").value,
        postalCode: $gel("postal-code").value
    },
        // callback function returns status and data as object literal
        function (data, status) {
            if (data.errors) {
                showAlert(data.errors);
            } else {
                $gel("customer-id").value = data.CusID;

                // Assign values to the customer record
                customer.CusID = $gel("customer-id").value
                customer.firstName = $gel("first-name").value
                customer.lastName = $gel("last-name").value
                customer.address = $gel("address").value
                customer.city = $gel("city").value
                customer.province = $gel("province").value
                customer.postalCode = $gel("postal-code").value

                editMode = VIEW;
                renderForm();
            }
        });
}

// Delete a customer
function deleteCustomer() {

    $.post("/customers/delete", {
        CusID: parseInt($gel("customer-id").value)
    },
    // callback function returns status and data as object literal
    function (data, status) {
        if (data.errors) {
            showAlert(data.errors);
        } else {
            // Clear customer
            customer.clear();

            // Render Customer
            renderCustomer();

            // Render Form
            renderForm();
        }
    });
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
    setTimeout(function () { showAlert(); }, 3000);
}

// Helper function for getElementByID
function $gel(id) {
    return document.getElementById(id);
}