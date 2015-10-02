// I think this is object literal notation
var friends = {
bill: {
    firstName: "Bill",
    lastName: "Gates",
    number: "(206) 555-5555",
    address: ['One Microsoft Way', 'Redmond', 'WA', '98052']
},
steve: {
    firstName: "Steve",
    lastName: "Jobs",
    number: "(512) 531-8779",
    address: ['Some Lame Address', 'NoWhereImportant', 'CA', '69696']
}
};
var list = function (obj) {
    for (var prop in obj) {
        console.log(prop);
    }
};

// And this is kind of object constructor?
var friends = {};
friends.bill = {
    firstName: "Bill",
    lastName: "Gates",
    number: "(206) 555-5555",
    address: ['One Microsoft Way', 'Redmond', 'WA', '98052']
};
friends.steve = {
    firstName: "Steve",
    lastName: "Jobs",
    number: "(512) 531-8779",
    address: ['Some Lame Address', 'NoWhereImportant', 'CA', '69696']
};

var list = function (obj) {
    for (var prop in obj) {
        console.log(prop);
    }
};