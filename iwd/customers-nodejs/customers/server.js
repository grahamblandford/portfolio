/*  Name:    server.js
    By:      Graham Blandford
    Date:    2020-11-21
    Purpose: Server-side Scripting for INFO-3144-02-20F Project 2
*/

// create express object from express module
let express = require('express');

// create body parser object from body-parser package
let bodyParser = require('body-parser');

// call express constructor to create express application object
let app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/'));

// create a handler (using an arrow function) for the HTTP GET request
// use the __dirname global value to create fully qualified url
app.get('/', (request, response) => response.sendFile(__dirname + "/index.html"));

// create a mssql SQL object from mssql module (package)
let sql = require("mssql");

// create configuration object literal for connection string
// must use SQL authentication
// note the the \\ in the SQL server name
let config = {
    user: 'sa',
    password: 'Windows1',
    server: 'LAPTOP-EAFGP503\\SQLEXPRESS',
    database: 'Store'
};


// customers/get
app.post('/customers/get', (request, response) => {

    // Get document body
    let postBody = request.body;

    // Connect to SQL
    sql.connect(config, function (err) {

        if (err) {
            console.log(err);
        }

        // create a SQL query string with place holder values
        let queryString = "SELECT CusID, FirstName, LastName, Address, City, Province, PostalCode FROM Customers WHERE CusID = @CusID";

        // create Request object
        let request = new sql.Request();

        // input the parameter values and associated SQL Server types
        request.input("CusID", sql.Int, postBody.CusID)

        // chain the query
        request.query(queryString, function (err, recordsets) {
            if (err) {
                console.log(err);
            }

            // output recordset as a response for debugging purposes
            // console.log(recordsets);

            // check we have results
            if (recordsets.rowsAffected > 0) {

                // extract fromm recordset
                let customer = recordsets.recordset[0];

                postBody.CusID = customer.CusID;
                postBody.firstName = customer.FirstName;
                postBody.lastName = customer.LastName;
                postBody.address = customer.Address;
                postBody.city = customer.City;
                postBody.province = customer.Province;
                postBody.postalCode = customer.PostalCode;
                response.send(postBody);

            } else {

                // empty
                postBody.firstName = "";
                postBody.lastName = "";
                postBody.address = "";
                postBody.city = "";
                postBody.province = "";
                postBody.postalCode = "";

                // return an error;
                postBody.errors = "Customer '" + postBody.CusID + "' not found";
                response.send(postBody);
            }
        });
    });
});

// customers/list
app.post('/customers/list', (request, response) => {

    // Get document body
    let postBody = request.body;

    // Connect to SQL
    sql.connect(config, function (err) {

        if (err) {
            console.log(err);
        }

        // create a SQL query string with place holder values
        let queryString = "SELECT CusID, (FirstName + ' ' + LastName) AS FullName, FirstName, LastName, Address, City, Province, PostalCode FROM Customers ORDER BY CusID";

        // create Request object
        let request = new sql.Request();

        // chain the query
        request.query(queryString, function (err, recordsets) {
            if (err) {
                console.log(err);
            }

            // output recordset as a response for debugging purposes
            // console.log(recordsets);

            // check we have results
            if (recordsets.rowsAffected > 0) {

                // Return the recordset
                postBody.data = recordsets.recordset;
                response.send(postBody);

            } else {

                // empty
                postBody.data = [];
                response.send(postBody);
            }
        });
    });
});

// customers/create
app.post('/customers/create', (request, response) => {

    // Get document body
    let postBody = request.body;

    // Connect to SQL
    sql.connect(config, function (err) {

        if (err) {
            console.log(err);
        }

        // create a SQL query string with place holder values
        let queryString = "INSERT INTO Customers (FirstName, LastName, Address, City, Province, PostalCode) VALUES (@FirstName, @LastName, @Address, @City, @Province, @PostalCode)";

        // create Request object
        let request = new sql.Request();

        // input the parameter values and associated SQL Server types
        request.input("FirstName", sql.VarChar(50), postBody.firstName)
            .input("LastName", sql.VarChar(50), postBody.lastName)
            .input("Address", sql.VarChar(50), postBody.address)
            .input("City", sql.VarChar(50), postBody.city)
            .input("Province", sql.VarChar(20), postBody.province)
            .input("PostalCode", sql.VarChar(10), postBody.postalCode)

        // chain the query
        request.query(queryString, function (err, recordsets) {
            if (err) {
                console.log(err);
            }

            // output recordset as a response for debugging purposes
             //console.log(recordsets);

            // check we have results
            if (recordsets.rowsAffected > 0) {

                // create the SQL to get the last "identity" field value
                queryString = "SELECT @@IDENTITY AS 'newID'";
                request.query(queryString, function (err, resultsets) {
                    if (err) {
                        console.log(err);
                    }

                    // Return the new customer id
                    postBody.CusID = resultsets.recordset[0].newID;
                    response.send(postBody);
                });

            } else {
                // empty
                postBody.CusID = "";

                // return an error;
                postBody.errors = "Unable to create new customer.";
                response.send(postBody);
            }
        });

    });
});

// customers/update
app.post('/customers/update', (request, response) => {

    // Get document body
    let postBody = request.body;

    // Connect to SQL
    sql.connect(config, function (err) {

        if (err) {
            console.log(err);
        }

        // create a SQL query string with place holder values
        let queryString = "UPDATE Customers SET FirstName = @FirstName, LastName = @LastName, Address = @Address, City = @City, Province = @Province, PostalCode = @PostalCode WHERE CusID = @CusID";

        // create Request object
        let request = new sql.Request();

        // input the parameter values and associated SQL Server types
        request.input("CusID", sql.Int, postBody.CusID)
            .input("FirstName", sql.VarChar(50), postBody.firstName)
            .input("LastName", sql.VarChar(50), postBody.lastName)
            .input("Address", sql.VarChar(50), postBody.address)
            .input("City", sql.VarChar(50), postBody.city)
            .input("Province", sql.VarChar(20), postBody.province)
            .input("PostalCode", sql.VarChar(10), postBody.postalCode);

        // chain the query
        request.query(queryString, function (err, recordsets) {
            if (err) {
                console.log(err);
            }

            // output recordset as a response for debugging purposes
            // console.log(recordsets);

                // check we have results
            if (recordsets.rowsAffected > 0) {
                    response.send(postBody);
            } else {
                // empty
                // return an error;
                postBody.errors = "Unable to update customer.";
                response.send(postBody);
            }
        });
    });
});

// customers/delete
app.post('/customers/delete', (request, response) => {

    // Get document body
    let postBody = request.body;

    // Connect to SQL
    sql.connect(config, function (err) {
        if (err) {
            console.log(err);
        }

        //// create a SQL query string with place holder values
        let queryString = "DELETE FROM Customers WHERE CusID = @CusID";

        // create Request object
        let request = new sql.Request();

        // input the parameter values and associated SQL Server types
        request.input("CusID", sql.Int, postBody.CusID);

        // chain the query
        request.query(queryString, function (err, recordsets) {
            if (err) {

                console.log(err);
            }

            // output recordset as a response for debugging purposes
            // console.log(recordsets);

            // check we have results
            if (recordsets.rowsAffected > 0) {
                response.send(postBody);
            } else {
                // return an error;
                postBody.errors = "Unable to delete customer.";
                response.send(postBody);
            }
        });
    });
});

// create the web server running on configured port
// or argument
// or hard-coded 3000
let port = process.env.port || process.argv[2] || 3000;

let server = app.listen(port, function () {
    console.log('Server is running..');
});