// StoreItem

// StoreItem object constructor
function StoreItem(name, price, qoh, mpc, cat, shipcost, reviews, desc, img)
{
    
    this.id = getNewId();
    this.name = name;
    this.price = price;
    this.quantityOnHand = qoh;
    this.maxPerCustomer = mpc;
    this.category = cat;
    this.costOfShipping = shipcost;
    this.reviews = reviews;
    this.description = desc;
    this.image = img;

    // toString method
    this.toString = function() {

        return  this.id + " " +
            this.name + " " +
            this.description;
    }
}

// // create an id 
function getNewId() {

    const TOKENS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    var itemId = "";
    for (var i = 0; i < 12; i++) //
    {
        itemId += (TOKENS.charAt(Math.floor( Math.random() * TOKENS.length))).toString();
    }
    return itemId;
}