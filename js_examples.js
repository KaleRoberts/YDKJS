// Kale Roberts
// Several good javascript examples that I've gone through as I've learned the language

for (i = 1; i < 21; i ++) {
    // if (i % 3 == 0) {
    //     if (i % 5 == 0) {
    //         console.log("FizzBuzz"); // Meaning the number is divisible by 3 and 5
    //     }
    //     else {
    //         console.log("Fizz");
    //     }
    // if (i % 5 == 0) {
        
    // }
    
    // (i % 3 == 0) {
    //     console.log("Fizz");
    // }
    // (i % 5 == 0) {
    //     console.log("Buzz");
    // }
    // if
    // ((i % 3 == 0) && (i % 5 == 0)) { // This should be the first check?
    //     console.log("FizzBuzz");
    // }
    if ((i % 3 == 0) && (i % 5 == 0)) { // Evaluated the more complex condition first. Nested conditional statement.
        console.log("FizzBuzz");		// I could have used a switch case statement as well, which I think is probably a little better, but maybe not in terms of efficiency.
    }									// I guess it really depends on how many statement are evaluated and how many times, which order of magnitude etc.
    else {
        if (i % 3 == 0)
            console.log("Fizz");
        else if (i % 5 == 0) 
            console.log ("Buzz");
        else
            console.log(i);
    }
};

// Simple prompt and respsonse evaluation

var answer = function showAnswer (response) {
    if (response == "YES") {
        console.log("I'm ready for Objects!");
    }
    else {
        console.log("You are not ready for objects");
    }
};

var response = prompt("Are you ready for objects? Yes or No?");
answer(response.toUpperCase());


// Constructor with two functions to calculate rectangle height and width.

(function () {
    "use strict";

    function Rectangle(height, width) {
      this.height = height;
      this.width = width;
      this.calcArea = function calcAreaFunc() {
          return this.height * this.width;
      };
      // put our perimeter function here!
      this.calcPerimeter = function calcPerimeterFunc() {
          return (2 * (this.height + this.width) );
      };
    }

    var rex = new Rectangle(7,3);

    var area = rex.calcArea();
    var perimeter = rex.calcPerimeter();

    console.log(area);
    console.log(perimeter);
}());


// This would be a constructor call to FunctionName
// var objectName = new FunctionName(value for each property); // Remember this is the generic format for creating an object with a constructor.


function Rabbit(adjective) { // This is a constructor that takes a parameter
    this.adjective = adjective; // Recall that standalone functions are decleared using var calcArea = function calcAreaFunction() {
// };
    this.describeMyself = function() {
        console.log("I am a " + this.adjective + " rabbit");
    };
}

// now we can easily make all of our rabbits

var rabbit1 = new Rabbit("fluffy");
rabbit1.describeMyself();

var rabbit2 = new Rabbit("happy");
rabbit2.describeMyself();

var rabbit3 = new Rabbit("sleepy");
rabbit3.describeMyself();


// Circle calculations

function Circle (radius) {
    this.radius = radius;
    this.area = function caclCircleAreaFunc() {
        return Math.PI * this.radius * this.radius;
        
    };
    // define a perimeter method here
    this.perimeter = function calcCirclePerimFunc() {
        return 2 * Math.PI * this.radius;
    }
};

var circle = new Circle(12);

var circArea = circle.area();
var circPerim = circle.perimeter();

console.log("The area of a circle with radius " + circle.radius + " is " + circArea);
console.log("The perimeter of a circle with radius " + circle.radius + " is " + circPerim);




// Address book with object literal notation.
// In other practice I would have defined a constructor and made new person objects each time.

var bob = {
    firstName: "Bob",
    lastName: "Jones",
    phoneNumber: "(650) 777-7777",
    email: "bob.jones@example.com"
};

var mary = {
    firstName: "Mary",
    lastName: "Johnson",
    phoneNumber: "(650) 888-8888",
    email: "mary.johnson@example.com"
};

var contacts = [bob, mary];

function printPerson(person) {
    console.log(person.firstName + " " + person.lastName);
}

function list() {
	var contactsLength = contacts.length;
	for (var i = 0; i < contactsLength; i++) {
		printPerson(contacts[i]);
	}
}

var search = function searchFunc(lastName) {
    var contactsLength = contacts.length;
    for (i = 0; i < contactsLength; i++) {
        if (contacts[i].lastName == lastName) {
            printPerson(contacts[i]);
        }
    }
};

/*Create a search function
then call it passing "Jones"*/

//search("Jones");


function add(firstName, lastName, email, phoneNumber) {
    contacts[contacts.length] = {
        firstName : firstName,
        lastName : lastName,
        email : email,
        phoneNumber : phoneNumber
    }
};

add("Patrick", "Bateman", "pbateman@example.com", "(512) 531-8779");

list();


// Accessing elements of an object with the for/in loop

var nyc = {
    fullName: "New York City",
    mayor: "Bill de Blasio",
    population: 8000000,
    boroughs: 5
};

for (var info in nyc) { // This will print out all of the elements of an object
    console.log(info); // Rather the keys of the object, but not the property values
}

//This will go through all the properties of nyc one by one
// and assign the property name to info on each run of the loop.


// Accessing all property values of an object with the for/in loop

var nyc = {
    fullName: "New York City",
    mayor: "Bill de Blasio",
    population: 8000000,
    boroughs: 5
};

// write a for-in loop to print the value of nyc's properties
for (var info in nyc) {
    console.log(nyc[info]);
};



// Checking if an object has properties, if it doesn't you can add the property and value.

var suitcase = {
    shirt: "Hawaiian"
};

if (suitcase.hasOwnProperty('shorts')) {
    console.log(suitcase.shorts);
}
else
    suitcase.shorts = "board shorts";
    


// Prototyping example

// create your Animal class here
function Animal(name, numLegs) {
    this.name = name;
    this.numLegs = numLegs;
    // this.sayName = function sayNameFunc() { // Again I prefer using the constructor to define the method going to be used by all Animal objects.
    //     console.log("Hi my name is " + this.name);
    // }
}

// create the sayName method for Animal
Animal.prototype.sayName = function sayNameFunc() { // Do I have to use a prototype here? Yes or the constructor doesn't know about the method otherwise.
    console.log("Hi my name is " + this.name);
};


// provided code to test above constructor and method
var penguin = new Animal("Captain Cook", 2);
penguin.sayName();



// Inheritance example


// the original Animal class and sayName method
function Animal(name, numLegs) {
    this.name = name;
    this.numLegs = numLegs;
}
Animal.prototype.sayName = function() {
    console.log("Hi my name is " + this.name);
};

// define a Penguin class
function Penguin(name) {
    this.name = name;
    this.numLegs = 2;
}

// set its prototype to be a new instance of Animal
Penguin.prototype = new Animal();

var penguin = new Penguin("James Harvey");

penguin.sayName();



// Inheritance chain example

// original classes
function Animal(name, numLegs) {
    this.name = name;
    this.numLegs = numLegs;
    this.isAlive = true;
}
function Penguin(name) {
    this.name = name;
    this.numLegs = 2;
}
function Emperor(name) {
    this.name = name;
    this.saying = "Waddle waddle";
}

// set up the prototype chain
Penguin.prototype = new Animal();
Emperor.prototype = new Penguin();

var myEmperor = new Emperor("Jules");

console.log(myEmperor.saying); // should print "Waddle waddle"
console.log(myEmperor.numLegs); // should print 2
console.log(myEmperor.isAlive ); // should print true


// Accessing private methods with public method calls -


function Person(first,last,age) {
   this.firstname = first;
   this.lastname = last;
   this.age = age;
   var bankBalance = 7500;
  
   var returnBalance = function() {
      return bankBalance;
   };
       
   // create the new function here
   this.askTeller = function askTellerFunc() {
       return returnBalance;
   }
}

var john = new Person('John','Smith',30);
console.log(john.returnBalance);
var myBalanceMethod = john.askTeller();
// var myBalance = myBalanceMethod();
console.log(myBalanceMethod());

// So in order to get to the private method we need to use a public method from within the class.
// this.askTeller is returning the entire method and NOT the result of calling the method. That means that when I do var myBalanceMethod = john.askTeller(); myBalanceMethod is now a placeholder for the returnBalance method inside of my Person class. In order to get the bankBalance returned I now can call the function by doing myBalanceMethod(); since that is essentially calling the returnBalance function.