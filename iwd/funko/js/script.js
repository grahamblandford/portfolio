// script.js
//
// Graham Blandford
// April 2nd, 2020
//
// main page script for funko site

// global objects

// currencies
var currencyData = [];

// use a global object to track
// current currency
var currency = "";

// products & carts
var storeItemData = [];
var cartItemData = [];

// initial 
function initialize() {

    getSessionDateTime();

    // create the currency data
    currencyData.push(new Currency("CAD", "Canadian Dollar $", 1.00, true, "canada.png"));
    currencyData.push(new Currency("USD", "US Dollar $", 0.67, false, "usa.png"));

    // setup the currency <select>
    var select = document.getElementById("select-currency");

    for (var i = 0; i < currencyData.length; i++)
    {
        var data = currencyData[i];

        // create <option>
        var option = document.createElement("option");
        option.value = data.currency;
        option.innerText = data.toString();

        // handle the default & assign to
        // global currency object
        option.selected = data.default; 
        if (data.default == true)
        {
            currency = data;
        }

        // add to <select>
        select.appendChild(option);
    }

    // create store items
    loadStoreItemData();

    // display store items
    displayStoreItems();

    // display cart items
    displayCartItems();
}

// store item functions
function loadStoreItemData()
{
    storeItemData.push(new StoreItem("Dobby",               15.99,  10,     1, "Harry Potter",      3.99, ["Wonderful!", "Amazing Product!"], "Dobby is a free Elf",                    "dobby.jpg"));
    storeItemData.push(new StoreItem("Dumbledore",          12.99,  15,     2, "Harry Potter",      3.99, [], "These are worrying times, Harry",        "dumbledore.jpg"));
    storeItemData.push(new StoreItem("Jimmy",               79.99,  0,      1, "Pulp Fiction",      3.99, [], "I know it's good coffee",                "jimmy.jpg"));
    storeItemData.push(new StoreItem("Arya",                25.99,  1,      2, "Game of Thrones",   3.99, [], "Cersei, Ilyn Payne, The Hound..",        "Arya.jpg"));
    storeItemData.push(new StoreItem("Brienne of Tarth",    59.99,  1,      1, "Game of Thrones",   3.99, [], "I am sworn to protect",                  "Brienne.jpg"));
    storeItemData.push(new StoreItem("Butch",               129.99, 8,      2, "Pulp Fiction",      4.99, ["So happy to get this. Thanks!"], "Zed's dead baby",                        "butch.jpg"));
    storeItemData.push(new StoreItem("Cersei",              29.99,  1,      1, "Game of Thrones",   4.99, [], "Power is power",                         "Cersei.jpg"));
    storeItemData.push(new StoreItem("Tonks",               99.99,  1,      3, "Harry Potter",      3.99, [], "Don't call me Nymphadora!",               "tonks.jpg"));
    storeItemData.push(new StoreItem("Daenerys",            69.99,  16,     1, "Game of Thrones",   3.99, [], "Dracarys!",                              "Daenerys.jpg"));
    storeItemData.push(new StoreItem("Drogo",               49.99,  2,      1, "Game of Thrones",   3.99, ["Brilliant!"], "Shekh ma shieraki anni",                 "Drogo.jpg"));
    storeItemData.push(new StoreItem("Hagrid",              39.99,  1,      1, "Harry Potter",      3.99, [], "I probably shouldn't have said that",    "hagrid.jpg"));
    storeItemData.push(new StoreItem("Night King",          99.99,  1,      2, "Harry Potter",      3.99, [], "<looks sinister>",                        "Night King.jpg"));
    storeItemData.push(new StoreItem("Ron",                 99.99,  1,      1, "Harry Potter",      3.99, ["Great Product!", "Superb!"], "Bloody Hell Harry!",                      "ron.jpg"));
    storeItemData.push(new StoreItem("Sansa",               39.99,  20,     3, "Game of Thrones",   3.99, [], "I'm a slow learner, it's true. ..",       "SansaStark.jpg"));
    storeItemData.push(new StoreItem("Harry",               109.99, 6,      1, "Harry Potter",      3.99, [], "Expelliarmus!",                          "harry.jpg"));
    storeItemData.push(new StoreItem("Quidditch Harry",     139.99, 7,      4, "Harry Potter",      3.99, [], "Expelliarmus!",                          "harryquidditch.jpg"));
    storeItemData.push(new StoreItem("Jon Snow",            29.99,  5,      2, "Game of Thrones",   3.99, [], "I know nothing...",                      "JonSnow.jpg"));
    storeItemData.push(new StoreItem("Hermione",            99.99,  1,      1, "Harry Potter",      3.99, [], "Or even worse, expelled!",               "hermione.jpg"));
    storeItemData.push(new StoreItem("Joffrey",             39.99,  20,     5, "Game of Thrones",   3.99, [], "I cannot abide the wailing of women",    "Joffrey.jpg"));
    storeItemData.push(new StoreItem("Jules",               109.99, 1,      1, "Pulp Fiction",      3.99, ["My favourite! Thanks!", "Happy Customer Here!"], "I will strike down upon thee with great vengeance and furious anger", "jules.jpg"));
    storeItemData.push(new StoreItem("McGonagall",          109.99, 1,      1, "Harry Potter",      3.99, [], "Five Points Will Be Awarded To Each Of You For Sheer Dumb Luck.", "mcgonagall.jpg"));
    storeItemData.push(new StoreItem("Mia Wallace",         129.99, 1,      1, "Pulp Fiction",      4.99, [], "Don't be a square Daddio",                "mia.jpg"));
    storeItemData.push(new StoreItem("Vincent Vega",        99.99,  1,      1, "Pulp Fiction",      4.99, [], "No man, they got the metric system",      "vincent.jpg"));
    storeItemData.push(new StoreItem("Snape",               99.99,  1,      1, "Harry Potter",      3.99, ["Not my favourite POP, but satifactory all the same"], "Always...",                               "snape.jpg"));
    storeItemData.push(new StoreItem("Voldemort",           99.99,  1,      1, "Harry Potter",      3.99, [], "Avada Kedavra!",                          "voldemort.jpg"));
    storeItemData.push(new StoreItem("Tormund",             39.99,  20,     4, "Game of Thrones",   3.99, [], "They call me 'Giantsbane. ' Want to know why?",     "Tormund.jpg"));
}

// display store items
function displayStoreItems()
{
    // get the div
    var sectionItems = document.getElementById("section-storeitem-display");

    // clear the display
    sectionItems.innerHTML = "";

    // query selector to find selected category
    var category = document.querySelector("#select-category option:checked").value;

    // setup table, body and row
    var table = document.createElement("table");
    table.id = "table-storeitems";

    var tbody = document.createElement("tbody");
    var tr = document.createElement("tr");

    // iterate through store items and create
    // a dynamic table
    for (var i = 0; i < storeItemData.length; i++)
    {
        var data = storeItemData[i];

        // filter category
        if (data.category == category || category == 'All Products')
        {
            // store item in a column            
            var td = document.createElement("td");

            // price
            var pPrice = document.createElement("p");
            pPrice.className = "p-itemprice"
            pPrice.innerHTML = "$" + convertCurrency(data.price).toFixed(2) + " " + currency.currency;

            // name
            var h2 = document.createElement("h2");
            h2.innerHTML = data.name

            // let's create a divItemHeader with embedded divs 
            // & image so we can do some nice fade effects
            var divItemHeader = document.createElement("div");
            divItemHeader.className = "div-storeitem";

            // create image
            var image = document.createElement("img");
            image.className = "image-storeitem";
            image.src = "images/" + data.image;
            image.alt = "image " + image;

            divItemHeader.appendChild(image); // add the image the to div

            // center
            var divItemBody = document.createElement("div");
            divItemBody.className = "div-storeitem-middle";

            var button = document.createElement("button");
            button.id = "button-view-" + data.id;
            button.className = "button-storeitem-view";
            button.innerText = "View";
            button.onclick = function() {
                var id = this.id.replace("button-view-", "");
                showViewItem(id);
            };

            divItemBody.appendChild(button);
            divItemHeader.appendChild(divItemBody); // add the body
            
            // description
            var pDesc = document.createElement("p");
            pDesc.className = "p-itemdesc"
            pDesc.innerText = data.description;

            // product id, qty available and max per customer
            var pId = document.createElement("p");
            pId.className = "p-itemid"
            pId.innerHTML = "Product ID: " + data.id + "<br>" +  
                            parseInt(data.quantityOnHand) + " Units available<br>" +
                            "(Maximum " + parseInt(data.maxPerCustomer) + " per customer)";

            // add to cart quantity
            //
            // default value is 1 or 0 (if no quantity-on-hand)
            // max is lower of quantityOnHand & maxPerCustomer
            var number = document.createElement("input");
            number.id = "number-qty-" + data.id;
            number.className = "number-qty";
            number.type = "number";
            number.value = Math.min(data.quantityOnHand, 1);
            number.min = number.value;
            number.max = Math.min(data.quantityOnHand, data.maxPerCustomer);
            number.step = "1";

            // add to cart button
            //
            // don't allow click if we have no stock
            var button = document.createElement("button");
            button.id = "button-" + data.id;
            button.className = "button-item";
            button.innerText = "Add to Cart";

            // create function call
            button.onclick = function() {
                var id = this.id.replace("button-", "");
                addItemToCart(id);
              };

            if (data.quantityOnHand == 0) {
                button.disabled = true;
                button.innerText = "Out of Stock";
                number.hidden = true;
            }

            // add elements to column
            td.appendChild(pPrice);
            td.appendChild(h2);
            td.appendChild(divItemHeader);
            td.appendChild(pId);
            td.appendChild(number);
            td.appendChild(button);
    
            // add to row
            tr.appendChild(td);
        }
    }
    // add to the page
    tbody.appendChild(tr);
    table.appendChild(tbody);
    sectionItems.appendChild(table);
}

// add an item to the cart
function addItemToCart(id)
{
    // retrieve the store item we need
    var storeItem = getStoreItem(id);

    // look for item in cart
    var cartItem;
    for (var i = 0; i < cartItemData.length; i++)
    {
        var data = cartItemData[i];
        if (data.id == id)
        {
            cartItem = data;
            break;       
        }
    }

    // check if we found a cart item
    // if we didn't, create one;
    if (cartItem == undefined) // no, we didn't
    {
        cartItem = new CartItem(id, storeItem.price, 0, storeItem.costOfShipping); 
    }

    // get values
    var cart = cartItem.quantity;
    var add = parseInt(document.getElementById("number-qty-" + id).value);
    var qoh = storeItem.quantityOnHand;
    var max = storeItem.maxPerCustomer;

    // validate the quantity which in term
    // will adjust the quantity to the max if necessary
    add = validate(cart, add, qoh, max);

    if ( add > 0) 
    {
        // everything is good
        if (cartItem.quantity == 0)
        {
            // update: cartitem & push
            cartItem.quantity += add;
            cartItemData.push(cartItem);
        }
        else
        {
            // update: cartitem qty
            cartItem.quantity += add;
        }

        // update: storeitem qty
        storeItem.quantityOnHand = storeItem.quantityOnHand - add;

        // display: store
        displayStoreItems();

        // display: cart
        displayCartItems();
    }
}

// function to validate that we
// can add to cart
function validate(cartQuantity, addQuantity, qoh, mpc)
{
    // function will return the quantity to add
    if (addQuantity < 1) {
        // alert: insufficient
        alert("Unable to add this item to the Cart:\n\nQuantity must be at least 1!");
        return 0;        
    }

    // check: inventory level
    if ((addQuantity + cartQuantity) > qoh)
    {
        // alert: insufficient
        alert("Unable to add this item to the Cart:\n\nInsufficient stock!");
        return 0;
    }

    // check: max units & adjust if req.
    if ((addQuantity + cartQuantity) > mpc)
    {
        addQuantity = (mpc - cartQuantity);

        if (addQuantity == 0)
        {
            // alert: max already added
            alert("Unable to add this item to the Cart:\n\nYou already have the maximum\nnumber of this item in your Cart.");
        }
    }

    return addQuantity;
}

// get store item
function getStoreItem(id)
{
    for (var i = 0; i < storeItemData.length; i++)
    {
        var data = storeItemData[i];
        if (data.id == id)
        {
            return data;
        }
    }
}

// item details functions

// show item
function showViewItem(id)
{
    // display item details
    itemDetails(id);

    // show section and go to it
    document.getElementById("section-viewitem").style.display = "block";
    document.getElementById("section-viewitem").scrollIntoView(true);    
}

// hide item section
function hideViewItem()
{
    // hide section
    document.getElementById("section-viewitem").style.display = "none";
}

// display the item details
function itemDetails(id)
{
    // retrieve the item
    var storeItem = getStoreItem(id);

    // fill form elements with image & data
    document.getElementById("legend-item-name").innerText = storeItem.name;
    document.getElementById("image-view-item").src = "images/" + storeItem.image;
    document.getElementById("tb-product-id").value = storeItem.id;
    document.getElementById("tb-price").value = "$" + convertCurrency(storeItem.price).toFixed(2);
    document.getElementById("tb-qty").value = storeItem.quantityOnHand;
    document.getElementById("tb-max").value = storeItem.maxPerCustomer;
    document.getElementById("tb-max").value = storeItem.maxPerCustomer;
    document.getElementById("tb-shipping").value = "$" + convertCurrency(storeItem.costOfShipping).toFixed(2);
    document.getElementById("p-desc").innerHTML = storeItem.description;

    var pText = "";
    for (var i = 0; i < storeItem.reviews.length; i++)
    {
        pText += ('"' + storeItem.reviews[i] + '"<br>');
    } 

    //
    if (pText == "")
    {
        pText = "This item has yet to be reviewed";
    }

    // set the element value
    document.getElementById("p-reviews").innerHTML = pText;
}

// Cart functions

// display cart details
function displayCartItems()
{
    // get the cart <div>
    var sectionCart = document.getElementById("section-cartitem-display");
    
    // clear cart <div>
    sectionCart.innerHTML = "";

    // create cart Item didplay
    // if we have some
    if (cartItemData.length > 0) 
    {
        // setup table:
        //
        // header, body and row
        var table = document.createElement("table");
        table.id = "table-cartitems";

        var tr = document.createElement("tr");

        // headers
        var th = document.createElement("th");
        th.id = "th-cart-name";
        th.innerText = "Cart Item";
        th.className = "td-cart-name";
        tr.appendChild(th);

        th = document.createElement("th");
        th.id = "th-cart-qty";
        th.innerText = "Qty";
        th.className = "td-cart-qty";
        tr.appendChild(th);

        th = document.createElement("th");
        th.id = "th-cart-price";
        th.innerText = "Price";
        th.className = "td-cart-price";
        tr.appendChild(th);

        th = document.createElement("th");
        th.id = "th-cart-line-total";
        th.innerText = "Total";
        th.className = "td-cart-price";
        tr.appendChild(th);

        th = document.createElement("th");
        th.innerText = "";
        th.className = "td-cart-remove";

        tr.appendChild(th);
        table.appendChild(tr);

        // body
        var tbody = document.createElement("tbody");

        // read cart items
        for (var i = 0; i < cartItemData.length; i++)
        {
            var data = cartItemData[i];
            var storeItem = getStoreItem(data.id);

            // create row
            tr = document.createElement("tr");

            // single column            
            td = document.createElement("td");
            td.className = "td-cart-name"

            // name, use h3 for emphasis
            var hName = document.createElement("h3");
            hName.innerHTML = storeItem.name
            td.appendChild(hName);

            // image
            var image = document.createElement("img");
            image.className = "image-cartitem";
            image.src = "images/" + storeItem.image;
            image.alt = "image " + storeItem.name;
            td.appendChild(image);

            // product id
            var pId = document.createElement("p");
            pId.className = "p-cart-itemid"
            pId.innerHTML = "Product ID: " + data.id;
            td.appendChild(pId);
            tr.appendChild(td);

            // qty
            td = document.createElement("td");
            td.className = "td-cart-qty"

            var pQty = document.createElement("p");
            pQty.className = "p-cart-qty"
            pQty.innerHTML = data.quantity;
            td.appendChild(pQty);
            tr.appendChild(td);

            // price
            td = document.createElement("td");
            td.className = "td-cart-price"

            var pPrice = document.createElement("p");
            pPrice.className = "p-cart-price"
            pPrice.innerHTML = "$" + convertCurrency(data.price).toFixed(2);
            td.appendChild(pPrice);
            tr.appendChild(td);

            // line total
            td = document.createElement("td");
            td.className = "td-cart-price"

            var pTotal = document.createElement("p");
            pTotal.className = "p-cart-price"

            var lineTotal = data.quantity * convertCurrency(data.price);
            pTotal.innerHTML = "$" + (lineTotal.toFixed(2));

            td.appendChild(pTotal);
            tr.appendChild(td);
            
            // remove from cart piece
            // default value is 1 or 0 (if no quantity-on-hand)
            // max is lower of quantityOnHand & maxPerCustomer
            td = document.createElement("td");
            td.className = "td-cart-remove"

            // qty
            var num = document.createElement("input");
            num.id = "number-cart-qty-" + data.id;
            num.className = "number-cart-qty";
            num.type = "number";
            num.value = data.quantity;
            num.min = 1;
            num.max = data.quantity;
            num.step = "1";
            td.appendChild(num);

            // image for 'remove from cart'
            var image = document.createElement("img");
            image.src = "images/remove-from-cart.jpg";
            image.id = "image-remove-" + data.id;
            image.alt = "remove from cart";
            image.className = "image-remove-cart-item";

            image.onclick = function() {
                var id = this.id.replace("image-remove-", "");
                removeItemFromCart(id);
            };

            // add the image
            td.appendChild(image);
            tr.appendChild(td);
            tbody.appendChild(tr);
        }

        // add to the page
        table.appendChild(tbody);
        sectionCart.appendChild(table);
    }
    // display cart totals
    calculateCart()
}

// remove item from the cart
function removeItemFromCart(id)
{
    // get the store item
    // to return inventory
    var storeItem = getStoreItem(id);

    for (var i = 0; i < cartItemData.length; i++)
    {
        var data = cartItemData[i];
        if (data.id == id)
        {
            // get cart item
            var quantity = parseInt(document.getElementById("number-cart-qty-" + id).value);

            // update inventory
            storeItem.quantityOnHand += quantity;

            // update cart quantity
            data.quantity -= quantity;

            // if the quantity is zero
            // remove the item from cart
            if (data.quantity <= 0) 
            {
                cartItemData.splice(i, 1);
            } 
            break;
        }
    }

    // display store
    displayStoreItems();

    // display cart
    displayCartItems();
}

// calculate & display
// cart totals
function calculateCart()
{
    const TAXRATE = 0.13; // tax rate

    // totals
    var itemTotal = 0;
    var shipTotal = 0;
    var subTotal = 0;
    var totalTax = 0;
    var orderTotal = 0;

    var cartQty = 0;

    // item & totals
    for (var i = 0; i < cartItemData.length; i++)
    {
        data = cartItemData[i];

        // ensure we have numeric data
        var quantity = parseInt(data.quantity);
        var price = parseFloat(data.price);
        var cOS = parseFloat(data.costOfShipping);

        // increment totals
        cartQty += quantity;
        itemTotal += (quantity * convertCurrency(price));
        shipTotal += (quantity * convertCurrency(cOS));
    }

    subTotal = (itemTotal + shipTotal);
    totalTax = subTotal * TAXRATE;
    orderTotal = subTotal + totalTax;

    var cartButtonText = "No Items in Cart";
    if (cartQty > 0)
    {
        cartButtonText = "Cart   " + cartQty + " item(s)   $" + (orderTotal).toFixed(2);
    }
    document.getElementById("button-cart").innerText = cartButtonText;

    // set element values
    document.getElementById("tb-item-subtotal").value = "$" + itemTotal.toFixed(2);
    document.getElementById("tb-est-ship").value = "$" + shipTotal.toFixed(2);
    document.getElementById("tb-subtotal").value = "$" +  subTotal.toFixed(2);
    document.getElementById("tb-tax").value = "$" + totalTax.toFixed(2);
    document.getElementById("tb-order-total").value = "$" + orderTotal.toFixed(2);

    // only show cart sections if we have items in cart
    var cartDisplaySection = document.getElementById("section-cartitem-display");
    var cartTotalSection = document.getElementById("section-carttotal-display");

    if (cartQty > 0) 
    {
        cartDisplaySection.style.display = "block";
        cartTotalSection.style.display = "block";
    }
    else
    {
        cartDisplaySection.style.display = "none";
        cartTotalSection.style.display = "none";
    }
} 

// reviews
// add the review to the store item
function submitReview()
{
    // retrieve the id & review from the
    // form data
    var id = document.getElementById("tb-product-id").value;
    var tReview = document.getElementById("tb-add-review");

    // check the user has entered something
    if (tReview.value == "")
    {
        alert("Please enter your reviewing before submitting!");
        return;
    }

    // retrieve item
    var storeItem = getStoreItem(id);

    // add review to store item
    storeItem.reviews.push(tReview.value);

    // clear text area
    tReview.value = "";

    // redisplay
    itemDetails(id);
}

// currency functions

// currency changed
function changeCurrency() {

    // set global currency object
    var selectedCurr = document.getElementById("select-currency").value;
    currency = getCurrency(selectedCurr);

    // change icon
    var img = document.getElementById("img-currency");
    img.src = "images/" + currency.image;

    // display: store 
    displayStoreItems();

    // display: cart
    displayCartItems();
}

// function to return the selected currency object
function getCurrency(curr)
{
    for (var i = 0; i < currencyData.length; i++)
    {
        data = currencyData[i];
        if (data.currency == curr)
        {
            return data;
        }
    }
}

function convertCurrency(p)
{
    // find the currency
    for (var i = 0; i < currencyData.length; i++ )
    {

        data = currencyData[i];

        if (data.currency == currency.currency)
        {
            var r = +(p * data.rate).toFixed(2); // a NUMBER (2dp)
            return r; // return
        }
    }
    return +(p * data.rate).toFixed(2); // currency not found, just return price
}