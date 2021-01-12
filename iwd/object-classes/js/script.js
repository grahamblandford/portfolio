/*  Name:    Graham Blandford
    Date:    August 5th, 2020
    Purpose: Scripting for INFO-3114-01-20S Project 2

    Demonstrates use of Classes for object creation
    Also utilizes key/pairs using maps to maintain data states, e.g. if a record is new or
    in the process of being edited.
*/

// Setup data state constants 
const DATA_STATE_UNCHANGED = 0;
const DATA_STATE_CHANGED   = 1;

// Setup globals for device arrays
let videoData = [];
let hddData = [];
let ssdData = [];

////////////////////////////////////// SETUP DEVICE CLASSES ///////////////////////////////////////

// Setup (Base) Device class
class Device {
    constructor(deviceName, replacementCost, supplierName, serialNumber) {
        this._deviceName = deviceName;
        this._replacementCost = replacementCost;
        this._supplierName = supplierName;
        this._serialNumber = serialNumber;

        // Status to indicate if enabled (true) or disabled (false)
        this._status = true; // enabled by default;
    }

    // Name
    get deviceName() {
        return this._deviceName;
    }
    set deviceName(value) {
        if (value) {
            this._deviceName = value;
        }
    }

    // Replacement Cost
    get replacementCost() {
        return this._replacementCost;
    }
    set replacementCost(value) {
        if (value) {
            this._replacementCost = value;
        }
    }

    // Supplier Name
    get supplierName() {
        return this._supplierName;
    }
    set supplierName(value) {
        if (value) {
            this._supplierName = value;
        }
    }

    // Serial #
    get serialNumber() {
        return this._serialNumber;
    }
    set serialNumber(value) {
        if (value) {
            this._serialNumber = value;
        }
    }

    // Device status               
    get status() {
        return this._status;
    }

    // Enable the device
    enable() {
        this._status = true;
    }

    // Disable the device
    disable() {
        this._status = false;
    }
}

// Video Device class
class VideoDevice extends Device {
    constructor(deviceName, replacementCost, supplierName, serialNumber, resolution, type) {
        super(deviceName, replacementCost, supplierName, serialNumber);
        this._resolution = resolution;
        this._type = type;
    }

    // Resolution
    get resolution() {
        return this._resolution;
    }
    set resolution(value) {
        if (value) {
            this._resolution = value;
        }
    }

    // Type
    get type() {
        return this._type;
    }
    set type(value) {
        if (value) {
            this._type = value;
        }
    }

    // Static method that we can call to create a new device
    static newVideo () {
        return new VideoDevice("", 0.00, "", "", "", "");
    }    
}

// Disk Device class
class DiskDevice extends Device {
    constructor(deviceName, replacementCost, supplierName, serialNumber, size, transferRate) {
        super(deviceName, replacementCost, supplierName, serialNumber);
        this._size = size;
        this._transferRate = transferRate;
    }

    // Size
    get size() {
        return this._size;
    }
    set size(value) {
        if (value) {
            this._size = value;
        }
    }

    // Transfer Rate
    get transferRate() {
        return this._transferRate;
    }
    set transferRate(value) {
        if (value) {
            this._transferRate = value;
        }
    }
}

// Hard Disk class
class HardDisk extends DiskDevice {
    constructor(deviceName, replacementCost, supplierName, serialNumber, size, transferRate, platterSize, numberPlatters) {
        super(deviceName, replacementCost, supplierName, serialNumber, size, transferRate);
        this._platterSize = platterSize;
        this._numberPlatters = numberPlatters;
    }

    // Platter Size
    get platterSize() {
        return this._platterSize;
    }
    set platterSize(value) {
        if (value) {
            this._platterSize = value;
        }
    }

    // # Platters
    get numberPlatters() {
        return this._numberPlatters;
    }
    set numberPlatters(value) {
        if (value) {
            this._numberPlatters = value;
        }
    }

    // Static method that we can call to create a new device
    static newHardDisk () {
        return new HardDisk("", 0.00, "", "", "", "", "", 0);
    }        
}

// Solid State Drive Class
class SSD extends DiskDevice {
    constructor(deviceName, replacementCost, supplierName, serialNumber, size, transferRate, type, wearLeveling) {
        super(deviceName, replacementCost, supplierName, serialNumber, size, transferRate);
        this._type = type;
        this._wearLeveling = wearLeveling;
    }

    // Type
    get type() {
        return this._type;
    }
    set type(value) {
        if (value) {
            this._type = value;
        }
    }

    // Platter Size
    get wearLeveling() {
        return this._wearLeveling;
    }
    set wearLeveling(value) {
        if (value) {
            this._wearLeveling = value;
        }
    }
    // Static method that we can call to create a new device
    static newSSD () {
        return new SSD("", 0.00, "", "", "", "","", "" );
    }      
}            

////////////////////////////////////// CODE ENTRY ///////////////////////////////////////

// Maps to control data states
let videoCtlMap = new Map( 
    [
        ["CURRENT-INDEX",  0],
        ["DATA-STATE",     DATA_STATE_UNCHANGED],
        ["DATE-IS-NEW",    false],
        ["DATA-ERRORS",    []],
        ["FORM-FIELDS",    $gel("container-video").querySelectorAll("input[type='text'], select, input[type='checkbox']")],
        ["FORM-BUTTONS",   $gel("video-buttons").querySelectorAll("button")],
        ["FORM-ERRORS",    $gel("video-errors")]
    ]
);        

let hddCtlMap = new Map( 
    [
        ["CURRENT-INDEX",  0],
        ["DATA-STATE",     DATA_STATE_UNCHANGED],
        ["DATE-IS-NEW",    false],
        ["DATA-ERRORS",    []],
        ["FORM-FIELDS",    $gel("container-hdd").querySelectorAll("input[type='text'], select, input[type='checkbox']")],
        ["FORM-BUTTONS",   $gel("hdd-buttons").querySelectorAll("button")],
        ["FORM-ERRORS",    $gel("hdd-errors")]
    ]
);   

let ssdCtlMap = new Map( 
    [
        ["CURRENT-INDEX",  0],
        ["DATA-STATE",     DATA_STATE_UNCHANGED],
        ["DATE-IS-NEW",    false],
        ["DATA-ERRORS",    []],
        ["FORM-FIELDS",    $gel("container-ssd").querySelectorAll("input[type='text'], select, input[type='checkbox']")],
        ["FORM-BUTTONS",   $gel("ssd-buttons").querySelectorAll("button")],
        ["FORM-ERRORS",    $gel("ssd-errors")]
    ]
);  

// Load sample data
loadData();

// Add event listeners

// Events: Buttons
$gel("video-btn-prev").addEventListener("click",   function(){ prevVideo(); });
$gel("video-btn-next").addEventListener("click",   function(){ nextVideo(); });
$gel("video-btn-new").addEventListener("click",    function(){ newVideo(); });
$gel("video-btn-update").addEventListener("click", function(){ updateVideo(); });
$gel("video-btn-cancel").addEventListener("click", function(){ cancelUpdateVideo(); });

$gel("hdd-btn-prev").addEventListener("click",   function(){ prevHDD(); });
$gel("hdd-btn-next").addEventListener("click",   function(){ nextHDD(); });
$gel("hdd-btn-new").addEventListener("click",    function(){ newHDD(); });
$gel("hdd-btn-update").addEventListener("click", function(){ updateHDD(); });
$gel("hdd-btn-cancel").addEventListener("click", function(){ cancelUpdateHDD(); });

$gel("ssd-btn-prev").addEventListener("click",   function(){ prevSSD(); });
$gel("ssd-btn-next").addEventListener("click",   function(){ nextSSD(); });
$gel("ssd-btn-new").addEventListener("click",    function(){ newSSD(); });
$gel("ssd-btn-update").addEventListener("click", function(){ updateSSD(); });
$gel("ssd-btn-cancel").addEventListener("click", function(){ cancelUpdateSSD(); });

// Events: Inputs
videoCtlMap.get("FORM-FIELDS").forEach(e => { 
    if ( e.id == "video-status" ) {
        e.addEventListener("input", function() { 
            enableDisableDevice( videoData[videoCtlMap.get("CURRENT-INDEX")], e.checked ); })
    }
    else {
        e.addEventListener("input", function() { 
            videoChanged();
            validateVideo(); })
    }
});

hddCtlMap.get("FORM-FIELDS").forEach(e => { 
    if ( e.id == "hdd-status" ) {
        e.addEventListener("input", function() { 
            enableDisableDevice( hddData[hddCtlMap.get("CURRENT-INDEX")], e.checked ); })
    }
    else {
        e.addEventListener("input", function() { 
            hddChanged();
            validateHDD(); })
    }
});

ssdCtlMap.get("FORM-FIELDS").forEach(e => { 
    if ( e.id == "ssd-status" ) {
        e.addEventListener("input", function() { 
            enableDisableDevice( ssdData[ssdCtlMap.get("CURRENT-INDEX")], e.checked ); })
    }
    else {
        e.addEventListener("input", function() { 
            ssdChanged();
            validateSSD(); })
    }
});

// Show first of each Device
showVideo();
showHDD();
showSSD();

////////////////////////////////// VIDEO ///////////////////////////////

// Show the current video
function showVideo() {

    if ( videoData.length == 0 ) {
        setButtons(videoData, videoCtlMap);
        return;
    }
    let videoIndex = videoCtlMap.get("CURRENT-INDEX");

    // Retrieve current array element
    let video = videoData[videoIndex];

    // Show record count
    $gel("video-header").innerHTML = ( "Video Devices (" + ( videoIndex + 1 ).toString() + " of " + videoData.length + ")" );

    // Iterate through the inouts and assign values
    // from the data
    videoCtlMap.get("FORM-FIELDS").forEach(function(e) {

        // Use the data attribute
        let dataName = e.getAttribute("data-name");

        // Set the value of the control
        switch(e.type) {
            case "checkbox":
                e.checked = video[dataName];
            default:
                e.value = video[dataName];
            }
    });
    
    // Enable/Disable buttons
    videoCtlMap.set("DATA-STATE", DATA_STATE_UNCHANGED);
    setButtons(videoData, videoCtlMap);
}

// Go to prev video
function prevVideo() {
    let videoIndex = videoCtlMap.get("CURRENT-INDEX");
    if (videoIndex > 0) {
        videoCtlMap.set("CURRENT-INDEX", --videoIndex);
        showVideo();
    }
}

// Go to next video
function nextVideo() {
    let videoIndex = videoCtlMap.get("CURRENT-INDEX");
    if (videoIndex < videoData.length - 1) {
        videoCtlMap.set("CURRENT-INDEX", ++videoIndex);
        showVideo();
    }
}

// Create a new video
function newVideo() {

    // Add Device
    videoData.push(VideoDevice.newVideo()); 
    videoCtlMap.set("CURRENT-INDEX", videoData.length - 1); // Move to end
    videoCtlMap.set("DATE-IS-NEW", true);

    // Display
    showVideo(); 

    // Mark dirty
    videoChanged();
}

// Save Changes
function updateVideo() {

    // Retrieve current array element
    let video = videoData[videoCtlMap.get("CURRENT-INDEX")];

    if ( validateVideo() == true ) {

        // Now it's much simpler to add to the
        // collection & the map
        videoCtlMap.get("FORM-FIELDS").forEach(function(e) {

            // Use the data attribute
            let dataName = e.getAttribute("data-name");

            // Set the value of the control
            switch( e.type ) {
                case "checkbox":
                    if (dataName != "status") {
                            video[dataName] = e.checked;
                    }
                default:
                    video[dataName] = (dataName == "replacementCost" ) ? parseFloat(e.value).toFixed(2) : e.value;
            }
        });

        videoCtlMap.set("DATA-STATE", DATA_STATE_UNCHANGED);
        showVideo();    
    }     
}

// Validate input
function validateVideo() {

    // Array to store error messages
    let errs = [];

    videoCtlMap.get("FORM-FIELDS").forEach(function(e) {

        // Use the data attributes to validate
        let dataName = e.getAttribute("data-name");

        // Set the value of the control
        switch( dataName ) {
            case "deviceName":
                if ( e.value.length == 0 ) {
                    errs.push("A device name is required");
                } 
                break;
            case "replacementCost":
                if ( isNaN( Number( e.value) ) ) {
                    errs.push("The cost must be a number");
                }
                break;                
            case "supplierName":
                if ( e.value.length == 0 ) {
                    errs.push("The supplier name is required");
                }
                break;
            case "serialNumber":
                if ( e.value.length == 0 ) {
                    errs.push("The serial number name must be specified");
                }
                break;
            case "resolution":
                if ( e.value.length == 0 ) {
                    errs.push("The device resolution is required");
                }
                break;
            case "type":
                if ( e.value.length == 0 ) {
                    errs.push("The type of device must be specified");
                }
                break;
        }
    });

    // Check for errors
    if ( errs.length == 0 ) {
        showErrors(videoCtlMap.get("FORM-ERRORS"));
        return true;
    }
    // Record the errors
    videoCtlMap.set("DATA-ERRORS", errs);
    
    // Show the errors
    showErrors(videoCtlMap.get("FORM-ERRORS"), errs);
    return false;
}

// Cancel the edit
function cancelUpdateVideo() {

    // Needs to check if ADD video, so we can remove it
    if ( videoCtlMap.get("DATE-IS-NEW") == true ) {
        videoData.pop(); // Remove last element of array
        videoCtlMap.set("DATE-IS-NEW", false);
        videoCtlMap.set("CURRENT-INDEX", videoData.length - 1);
    }

    // Clear Errors
    videoCtlMap.set("DATA-ERRORS", []);

    showVideo();
    showErrors( videoCtlMap.get("FORM-ERRORS"), videoCtlMap.get("DATA-ERRORS") )    
}

// Function to mark a record as "dirty"
function videoChanged(e) {
    videoCtlMap.set("DATA-STATE", DATA_STATE_CHANGED);                
    setButtons(videoData, videoCtlMap);
}

////////////////////////////////// HARD DISK ///////////////////////////////

// Show the current hdd
function showHDD() {

    if ( hddData.length == 0 ) {
        setButtons(hddData, hddCtlMap);
        return;
    }

    let hddIndex = hddCtlMap.get("CURRENT-INDEX");

    // Retrieve current array element
    let hdd = hddData[hddIndex];

    // Show record count
    $gel("hdd-header").innerHTML = ( "Hard Disks (" + ( hddIndex + 1 ).toString() + " of " + hddData.length + ")" );

    // Iterate through the inouts and assign values
    // from the data
    hddCtlMap.get("FORM-FIELDS").forEach(function(e) {

        // Use the data attribute
        let dataName = e.getAttribute("data-name");

        // Set the value of the control
        switch(e.type) {
            case "checkbox":
                e.checked = hdd[dataName];
            default:
                e.value = hdd[dataName];
            }
    });
    
    // Enable/Disable buttons
    hddCtlMap.set("DATA-STATE", DATA_STATE_UNCHANGED);
    setButtons(hddData, hddCtlMap);
}

// Go to prev hdd
function prevHDD() {
    let hddIndex = hddCtlMap.get("CURRENT-INDEX");
    if (hddIndex > 0) {
        hddCtlMap.set("CURRENT-INDEX", --hddIndex);
        showHDD();
    }
}

// Go to next hdd
function nextHDD() {
    let hddIndex = hddCtlMap.get("CURRENT-INDEX");
    if (hddIndex < hddData.length - 1) {
        hddCtlMap.set("CURRENT-INDEX", ++hddIndex);
        showHDD();
    }
}

// Create a new hdd
function newHDD() {

    // Add Device
    hddData.push(HardDisk.newHardDisk()); 
    hddCtlMap.set("CURRENT-INDEX", hddData.length - 1); // Move to end
    hddCtlMap.set("DATE-IS-NEW", true);

    // Display
    showHDD(); 

    // Mark dirty
    hddChanged();
}

// Save Changes
function updateHDD() {

    // Retrieve current array element
    let hdd = hddData[hddCtlMap.get("CURRENT-INDEX")];

    if ( validateHDD() == true ) {

        // Now it's much simpler to add to the
        // collection & the map
        hddCtlMap.get("FORM-FIELDS").forEach(function(e) {

            // Use the data attribute
            let dataName = e.getAttribute("data-name");

            // Set the value of the control
            switch( e.type ) {
                case "checkbox":
                    if (dataName != "status") {
                            hdd[dataName] = e.checked;
                    }
                default:
                    hdd[dataName] = (dataName == "replacementCost" ) ? parseFloat(e.value).toFixed(2) : e.value;
            }
        });

        hddCtlMap.set("DATA-STATE", DATA_STATE_UNCHANGED);
        showHDD();    
    }     
}

// Validate input
function validateHDD() {

    // Array to store error messages
    let errs = [];

    hddCtlMap.get("FORM-FIELDS").forEach(function(e) {

        // Use the data attributes to validate
        let dataName = e.getAttribute("data-name");

        // Set the value of the control
        switch( dataName ) {
            case "deviceName":
                if ( e.value.length == 0 ) {
                    errs.push("A device name is required");
                } 
                break;
            case "replacementCost":
                if ( isNaN( Number( e.value) ) ) {
                    errs.push("The cost must be a number");
                }
                break;                
            case "supplierName":
                if ( e.value.length == 0 ) {
                    errs.push("The supplier name is required");
                }
                break;
            case "serialNumber":
                if ( e.value.length == 0 ) {
                    errs.push("The serial number name must be specified");
                }
                break;
            case "size":
                if ( e.value.length == 0 ) {
                    errs.push("The disk size is required");
                }
                break;
            case "transferRate":
                if ( e.value.length == 0 ) {
                    errs.push("The transfer rate must be specified");
                }
                break;
            case "platterSize":
                if ( e.value.length == 0 ) {
                    errs.push("The platter size must be specified");
                }
                break;                
            case "numberOfPlatters":
                if ( e.value.length == 0 ) {
                    errs.push("The number of platters must be specified");
                }
                break;                
        }
    });

    // Check for errors
    if ( errs.length == 0 ) {
        showErrors(hddCtlMap.get("FORM-ERRORS"));
        return true;
    }
    // Record the errors
    hddCtlMap.set("DATA-ERRORS", errs);
    
    // Show the errors
    showErrors(hddCtlMap.get("FORM-ERRORS"), errs);
    return false;
}

// Cancel the edit
function cancelUpdateHDD() {

    // Needs to check if ADD hdd, so we can remove it
    if ( hddCtlMap.get("DATE-IS-NEW") == true ) {
        hddData.pop(); // Remove last element of array
        hddCtlMap.set("DATE-IS-NEW", false);
        hddCtlMap.set("CURRENT-INDEX", hddData.length - 1);
    }

    // Clear Errors
    hddCtlMap.set("DATA-ERRORS", []);

    showHDD();
    showErrors( hddCtlMap.get("FORM-ERRORS"), hddCtlMap.get("DATA-ERRORS") )    
}

// Function to mark a record as "dirty"
function hddChanged(e) {
    hddCtlMap.set("DATA-STATE", DATA_STATE_CHANGED);                
    setButtons(hddData, hddCtlMap);
}

////////////////////////////////// SOLID STATE DRIVES ///////////////////////////////

// Show the current ssd
function showSSD() {

    if ( ssdData.length == 0 ) {
        setButtons(ssdData, ssdCtlMap);
        return;
    }

    let ssdIndex = ssdCtlMap.get("CURRENT-INDEX");

    // Retrieve current array element
    let ssd = ssdData[ssdIndex];

    // Show record count
    $gel("ssd-header").innerHTML = ( "Solid State Drives (" + ( ssdIndex + 1 ).toString() + " of " + ssdData.length + ")" );

    // Iterate through the inouts and assign values
    // from the data
    ssdCtlMap.get("FORM-FIELDS").forEach(function(e) {

        // Use the data attribute
        let dataName = e.getAttribute("data-name");

        // Set the value of the control
        switch(e.type) {
            case "checkbox":
                e.checked = ssd[dataName];
            default:
                e.value = ssd[dataName];
            }
    });
    
    // Enable/Disable buttons
    ssdCtlMap.set("DATA-STATE", DATA_STATE_UNCHANGED);
    setButtons(ssdData, ssdCtlMap);
}

// Go to prev ssd
function prevSSD() {
    let ssdIndex = ssdCtlMap.get("CURRENT-INDEX");
    if (ssdIndex > 0) {
        ssdCtlMap.set("CURRENT-INDEX", --ssdIndex);
        showSSD();
    }
}

// Go to next ssd
function nextSSD() {
    let ssdIndex = ssdCtlMap.get("CURRENT-INDEX");
    if (ssdIndex < ssdData.length - 1) {
        ssdCtlMap.set("CURRENT-INDEX", ++ssdIndex);
        showSSD();
    }
}

// Create a new ssd
function newSSD() {

    // Add Device
    ssdData.push(SSD.newSSD()); 
    ssdCtlMap.set("CURRENT-INDEX", ssdData.length - 1); // Move to end
    ssdCtlMap.set("DATE-IS-NEW", true);

    // Display
    showSSD(); 

    // Mark dirty
    ssdChanged();
}

// Save Changes
function updateSSD() {

    // Retrieve current array element
    let ssd = ssdData[ssdCtlMap.get("CURRENT-INDEX")];

    if ( validateSSD() == true ) {

        // Now it's much simpler to add to the
        // collection & the map
        ssdCtlMap.get("FORM-FIELDS").forEach(function(e) {

            // Use the data attribute
            let dataName = e.getAttribute("data-name");

            // Set the value of the control
            switch( e.type ) {
                case "checkbox":
                    if (dataName != "status") {
                            ssd[dataName] = e.checked;
                    }
                default:
                    ssd[dataName] = (dataName == "replacementCost" ) ? parseFloat(e.value).toFixed(2) : e.value;
            }
        });


        ssdCtlMap.set("DATA-STATE", DATA_STATE_UNCHANGED);
        showSSD();    
    }     
}

// Validate input data
function validateSSD() {

    // Array to store error messages
    let errs = [];

    ssdCtlMap.get("FORM-FIELDS").forEach(function(e) {

        // Use the data attributes to validate
        let dataName = e.getAttribute("data-name");

        // Set the value of the control
        switch( dataName ) {
            case "deviceName":
                if ( e.value.length == 0 ) {
                    errs.push("A device name is required");
                } 
                break;
            case "replacementCost":
                if ( isNaN( Number( e.value) ) ) {
                    errs.push("The cost must be a number");
                }
                break;
            case "supplierName":
                if ( e.value.length == 0 ) {
                    errs.push("The supplier name is required");
                }
                break;
            case "serialNumber":
                if ( e.value.length == 0 ) {
                    errs.push("The serial number name must be specified");
                }
                break;
            case "size":
                if ( e.value.length == 0 ) {
                    errs.push("The disk size is required");
                }
                break;
            case "transferRate":
                if ( e.value.length == 0 ) {
                    errs.push("The transfer rate must be specified");
                }
                break;
            case "type":
                if ( e.value.length == 0 ) {
                    errs.push("The type must be specified");
                }
                break;                
        }
    });

    // Check for errors
    if ( errs.length == 0 ) {
        showErrors(ssdCtlMap.get("FORM-ERRORS"));
        return true;
    }
    // Record the errors
    ssdCtlMap.set("DATA-ERRORS", errs);
    
    // Show the errors
    showErrors(ssdCtlMap.get("FORM-ERRORS"), errs);
    return false;
}

// Cancel the edit
function cancelUpdateSSD() {

    // Needs to check if ADD ssd, so we can remove it
    if ( ssdCtlMap.get("DATE-IS-NEW") == true ) {
        ssdData.pop(); // Remove last element of array
        ssdCtlMap.set("DATE-IS-NEW", false);
        ssdCtlMap.set("CURRENT-INDEX", ssdData.length - 1);
    }

    // Clear Errors
    ssdCtlMap.set("DATA-ERRORS", []);

    showSSD();
    showErrors(  ssdCtlMap.get("FORM-ERRORS"), ssdCtlMap.get("DATA-ERRORS") )    
}

// Function to mark a record as "dirty"
function ssdChanged(e) {
    ssdCtlMap.set("DATA-STATE", DATA_STATE_CHANGED);                
    setButtons(ssdData, ssdCtlMap);
}

////////////////////////////////// COMMON FUNCTIONS ///////////////////////////////

// Function to display or clear errors
function showErrors(div, errors) {

    let html = "";

    // If we have no errors, just clear the div
    if (errors === undefined) {
        div.innerHTML = html;
        return;
    }

    // Iterate through the errors
    for (let i = 0; i < errors.length; i++) {
        html += '<div class="alert alert-danger alert-dismissible fade show" role="alert">' +
            errors[i] + 
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
            + '</div>';
    }
    // Show
    div.innerHTML = html;
}      

// Function to Enable or Disable container buttons
// based on current index & data state
function setButtons(data, ctlr) {
    
    // Get the device controller values
    let currentIndex = ctlr.get("CURRENT-INDEX");
    let dataState = ctlr.get("DATA-STATE");
    let buttons = ctlr.get("FORM-BUTTONS");

    buttons.forEach(e => {
        switch(e.innerHTML) {
            case "Prev":
                e.disabled = (currentIndex == 0 || dataState == 1);
                break;
            case "Next":
                e.disabled = (currentIndex == data.length - 1 || dataState == 1 || data.length == 0);
                break;
            case "New":
                e.disabled = (dataState == 1);
                break;
            case "Update":
                e.disabled = (dataState == 0);
                break;
            case "Cancel":
                e.disabled = (dataState == 0);
                break;
        }
    })
}

// Helper function to reduce typing
function $gel(id) {
    return document.getElementById(id);
}

// Function to Enable/Disable an object
// on-demand (No save) required
function enableDisableDevice(device, enabled) {
    if ( enabled == true ) {
        device.enable();
    }
    else {
        device.disable();
    }
}

// Function to create some data that we
// might normally populate from a database
function loadData() {

    // Videos
    videoData.push(new VideoDevice("21.5\" Screen LED-Lit Monitor",            116.99,      "Acer",      "UM.WV6AA.B01 V226HQL",    "1920 x 1080", "LED"));
    videoData.push(new VideoDevice("32\" 720p HD Smart LED TV (2018)",         229.99,      "Samsung",   "UN32M4500BFXZC",          "720P",        "LED"));
    videoData.push(new VideoDevice("22\" Screen LCD Monitor",                  141.99,      "LG",        "22BK400H-B",              "1920 x 1080", "LCD"));
    videoData.push(new VideoDevice("Smart LED Television (2019), 32\"",        219.99,      "TCL",       "32S325-CA",               "720P",        "LED"));
    videoData.push(new VideoDevice("1080i Display",         199.99,     "Lenovo",   "LTD-1.05M9",   "1366 x 768", "LED"));
    videoData.push(new VideoDevice("4K Ultra HD Monitor",   3299.99,    "Toshiba",  "T-7392H18",    "3840 x 2160", "Plasma"));

    // HDDs
    hddData.push(new HardDisk("Seagate BarraCuda 2TB Internal Hard Drive", 74.99, "Seagate", "ST2000DMZ08/DM008", "2TB", "220MB/s", "2.5\"", 2));
    hddData.push(new HardDisk("WD Red 8TB NAS Internal Hard Drive", 264.99, "Western Digital", "WD80EFAX-68LHPN0", "8TB", "540MB/s", "3.5\"", 4));
    hddData.push(new HardDisk("Seagate IronWolf 4TB NAS Internal Hard Drive HDD", 139.99, "Seagate", "ST4000VNZ08/VN008", "4TB", "180MB/s", "3.5\"", 4));
    hddData.push(new HardDisk("WD Blue 1TB PC Hard Drive - 7200 RPM Class Hard Drive", 59.99, "Western Digital", "WD10EZEX-60WN4A0", "1TB", "100MB/s", "3.5\"", 4));

    // SSDs
    ssdData.push(new SSD("Samsung 860 EVO 500GB SATA 2.5\" Internal SSD", 99.99, "Samsung", "MZ-76E500/AM", "500GB", "520MB/s", "Flash", true));
    ssdData.push(new SSD("Samsung 970 EVO Plus 500GB NVMe M.2 Internal SSD", 159.99, "Samsung", "MZ-V7S500B/AM", "500GB", "3500MB/s", "DRAM", true));
    ssdData.push(new SSD("WD Blue 3D NAND 500GB Internal PC SSD", 89.05, "Western Digital", "WDS400T2B0A", "4TB", "530MB/s", "DRAM", false));
    ssdData.push(new SSD("MINIX 240GB PC SSD - SATA3 6Gbps/ M.2 2280", 159.99, "MINIX", "B07Y53684G", "240GB", "400MB/s", "Flash", false));
} 