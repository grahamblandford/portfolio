// gets session date time and adds
// to page
function getSessionDateTime() {

    // get current date
    var cDT = new Date();

    var monthNames = ["January"
                    , "February"
                    , "March"
                    , "April"
                    , "May"
                    , "June"
                    , "July"
                    , "August"
                    , "September"
                    , "October"
                    , "November"
                    , "December"];

    // display in dd MMMMMMMM YYYY HH:mm:ss format
    var displayDate = cDT.getDate() + " " + monthNames[cDT.getMonth()] + " " + cDT.getFullYear()
                    + " " + cDT.getHours() + ":" + cDT.getMinutes() + ":" + cDT.getSeconds();

    document.getElementsByClassName("session-date-time")[0].innerHTML = "Session Date: " + displayDate;
}