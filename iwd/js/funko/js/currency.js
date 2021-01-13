// Currency

// object construtor
function Currency(curr, desc, rate, def, img)
{
    this.currency = curr;
    this.description = desc;
    this.rate = rate;
    this.default = def; // true or false
    this.image = img;

    // for the select list
    this.toString = function() {
        return this.description + " (" +
                this.currency + ")";
    }
}
