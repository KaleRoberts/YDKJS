// Kale Roberts

// My own understanding and some examples from You don't know JS series by Kyle Simpson

/* Closure example */

var makeAdder = function makeAdderFunc(x) {
	// The parameter x is an inner variable
	
	// Inner function add() uses 'x' so it has a closure over it
	// Remember that inner functions can see the variables and parameters of outer functions but outer functions cannot access inner function variables or parameters.
	// Unless they are specifically passed to the outer function as a parameter.
	var add = function addFunc(y) {
		return y + x;
	};
	
	return add;
}

var plusOne = makeAdder(1); // The function call of makeAdder(x) returns the function name add. So right now plusOne is a place holder for the function name add.
console.log(plusOne(3)); // Here I'm actually calling the add function, since makeAdder returns the function name of add. If I do plusOne(anynumber) that's essentially the same as calling the add function.
// add(10);

var plusTen = makeAdder(10);
console.log(plusTen(13));


/* Module example (similar to closure but using an object here) */

var User = function userFunc(){
	var username; // Need to understand why these are even used.
	var password; // As far as I can tell nothing is happening with them in this example. 
	
	var doLogin = function doLoginFunc(user, pw){
		username = user;  // I think here doLogin has closure of username and password from the outer function.
		password = pw;
		
		console.log("Your user name is " + username);
		console.log("Your password is " + password);
		// Perform some other login work here
	}
	
	var publicAPI = {  // Recall also, this is object literal notation.
		login : doLogin	// doLogin is now a method of the publicAPI object. The object and method are both part of the User function's scope.
	};
	
//  console.log("This is username from the outer scope: " + username); // And these both show up as undefined.
//	console.log("This is password from the outer scope: " + password);
	
	return publicAPI; // Here is how we are making the 'publicAPI' accessible to the outside world. By returning the object we can access it's properties later on.
};

// Create a 'User' module instance 
var fred = User(); // So now fred is set to what User() returns, which is the publicAPI object. And thus fred can access all of the functions of publicAPI.

fred.login("Fred", "12Battery34!");


var foo = function fooFunc(){
	var a = 2;
	return a;
};

var bar = function barFunc(){
	var b = foo;
	console.log(b());
}

foo();

/******************************************/
/* Chapter 2 this and Object bindings     */
/******************************************/

function baz(){
	//call-stack is: baz
	//so the call-site is in the global scope
	
	console.log("baz");
	bar(); // <-- call-site for 'bar'
};

function bar(){
	// call-stack is: baz -> bar
	// so the call-site is now in baz
	
	console.log("bar");
	foo(); // <-- call-site for foo
};

function foo(){
	debugger;
	// call-stack is: baz -> bar -> foo
	// so the call-site is now in foo
	
	console.log("foo");
}

baz(); // <-- call-site for baz


/* Default Binding Example */

var foo = function fooFunc() {
	"use strict";
	console.log(this.a);
}

var a = 2;

foo();

/* Implicit Binding Example */

var foo = function fooFunc(){
	debugger;
	console.log(this.a);
};

var obj = {
	a : 2,
	foo : foo // foo is added a reference property after the function has been declared
};

obj.foo(); // Prints out 2


/* Another implicit binding example
	Everything in Order Page 22
	It is only the top/last level of of an object property reference chain that matters to the call-site
	This is why 42 is printed instead of 2. In our call-site obj2 is the last object reference, therefore this.a is referencing the value of property a under obj2. 
*/

var foo = function fooFunc(){
	console.log(this.a);
}

var obj2 = {
	a : 42,
	foo : foo
};

var obj1 = {
	a : 2,
	obj2 : obj2
};

obj1.obj2.foo(); // Should print out 42


/* Implicit loss of 'this' binding */

var foo = function fooFunc(){
	console.log(this.a);
}

var obj = {
	a : 2,
	foo : foo
};

var bar = obj.foo; // function reference/alias

var a = "Ooops, global a instead of obj property a value"; // a is also a property in obj

bar(); // Should print out "Ooops, global..." And default binding applies to this call-site
bar.call(obj); // This will print out 2 - Explicit binding applies to this call-site
// Unless you were to change this to an explicit bind, using something like call or apply. If I say bar.call(obj); I've now
// explicitly bound foo function's this to obj.


/* Another implicit loss of 'this' binding with function callback */

var foo = function fooFunc(){
	console.log(this.a);
}

var doFoo = function doFooFunc(fn){
	//'fn' is just an argument that will reference the foo function
	
	fn.call(); // <-- Here is the call-site for foo
}

var obj = {
	a : 2,
	foo : foo
}

var a = "Ooops, global a instead of obj property a";

doFoo( obj.foo ); // Will print out "Ooops, global...



/* Implicit binding loss passing to a built-in js function */

var foo = function fooFunc(){
	console.log(this.a);
}

var obj = {
	a : 2,
	foo : foo
};

var a = "Ooops, global a";

setTimeout(obj.foo, 100);



// Explicit Binding Examples

var foo = function fooFunc(){
	console.log(this.length);
}

var a = "Oops is this a global??";

var obj = {
	a : 2
};

foo.call("Kale"); // I believe this is an example of boxing.
// I'm passing simple primitive value of type String as the this binding. My string is getting wrapped in its object form
// as new String("Kale")


/* Hard Binding Example */

var foo = function fooFunc(){
	console.log(this.a);
};

var obj = {
	a : 2
};

var bar = function barFunc(){
	foo.call(obj);
};


bar(); // 2
setTimeout(bar,100); // 2
bar.call(window); // 2


/* Another example, but now we're wrapping a function with hard binding */

var foo = function fooFunc(something){
	console.log(this.a, something);
	return this.a + something;
};

var obj = {
	a : 2
};

var bar = function barFunc() { // So here I've wrapped the foo function which has explicit binding with another function called bar
	// debugger;
	return foo.apply(obj, arguments); // This is an explicit and strong binding (hard binding)
};

// Also, since I've used the apply method we can pass arguments to foo.apply through bar ( this is the argument pass through the book talks about)
bar(4); // Just invoking bar will execute the console.log statement and also return this.a + something
// But if I assign a variable to the return value of bar() then I have to console.log the variable in
// order to see the return value.

// console.log(b);

// var b = bar(3); // 2 3
// console.log(b); // Which will print out 5
// I think the console.log is unnecessary 


/* Creating a reusable helper function
	Demonstrating hard-binding again but now with a 'bind' helper to demonstrate what bind does(Page 19) */

var foo = function fooFunc(something){
	console.log(this.a, something);
	return this.a + something;
};

// bind helper function, demonstrates what bind is basically doing.
var bind = function bindFunc(fn, obj){
	return function() {					// This is something new to me, haven't made a return block ever. Returns an anonymous function which in turn returns the passed fn argument fn.apply(obj, arguments)
		return fn.apply(obj, arguments); // Example of what Function.prototype.bind is kind of doing.
	};
};

var obj = {
	a : 2
};

var bar = bind(foo,obj); // So bar now is assigned to the return block which is fn.apply(obj, arguments);

var b = bar(3); /* So if you comment out the function return assignment and the bar(3) call, console.log(b) returns 5 still. I'm wondering if */
					/*  this has something to do with the global window object? I'm not even calling the functions as far as I know though when those are commented.*/
console.log(b);    /* For some reason b had gotten cached to the developer console, closed out the window and opened up a new session to fix */


/* Using built-in Function.prototype.bind which was implemented in ES5 */

var foo = function fooFunc(something){
	//debugger;
	console.log(this.a, something);
	return this.a + something;
};

var obj = {
	a : 2
};

var bar = foo.bind(obj, 3);
var b = bar(3);
console.log(b);



/*& API call "contexts" */

var foo = function fooFunc(el){
	console.log(el, this.id);
};

var obj = {
	id : "Awesome!"
};

// use 'obj' as 'this' for 'foo(...)' calls
[1,2,3].forEach(foo, obj);
// Should print out 1, Awesome! 2, Awesome! 3, Awesome


/* Using new binding overriding hard-binding */

var foo = function fooFunc(p1,p2){
	this.val = p1 + p2;
};

var bar = foo.bind(null, "p1");
console.log(bar.val);

var baz = new bar ("p2");

console.log(baz.val);


/* bind.js taken from Kevin Conway's github */
/* Provides some good examples of Prototyping and implicit, explicit, and hard-binding of this */

(function () {
	"use strict";
	
	var counter;
	var logger;
	var addEight;
	
	/*
	Kevin's comments
	*/
	
	function Counter(start){
		this.current = start;
		this.next = function nextFunc() {
			var value = this.current; //  value starts at whatever we've instantiated the new function call with
			this.current += 1;		  // We update the value of current, then when next is invoked again (if it is) value is reassigned this.current from the last run in the line above
			debugger;
			return value;
		};
	}
		
		counter = new Counter (0);
		
		console.log(counter.next()); // This should print 0
		console.log(counter.next()); // This should print 1
		
		/*
		This function performs a loop and calls a callback
		after each iteration
		*/
		
		function loopAndCallback(fn, logger){
			var x = 0;
			//logger = logger || console.log; // Chrome dev console does not like this
			for (x = 0; x < 10; x++){
				console.log('LOL!!!!');
				fn();
			}
		};
		
		/*
		counter = new Counter(0);
		console.log(counter.current); // Should print out 0 // So counter.current = 0
		loopAndCallback(counter.next); // I think the this context is lost here
		console.log(counter.next()); // Would print 0 if Uncaught Exception wasn't thrown
		*/
		
		counter = new Counter(0);
		loopAndCallback(counter.next.bind(counter)); // This should hard bind to next method's this
		console.log(counter.next()); // Should print 10
		
		counter = new Counter(0);
		logger = console.log.bind(null, "DERP!!!!"); // Supposedly works in Node.js
		loopAndCallback(counter.next.bind(counter), logger);
}());	

/* Small example of partial application */

var foo = function fooFunc(p1, p2){
	this.val = p1 + p2;
}

// We can use 'null' here because we don't care about the 'this' hard-binding in this particular scenario
// and it will be overridden by the 'new' call anyway

var bar = foo.bind( null, "p1"); // So null is what we're passing as the object? And "p1" as an argument?
// Which makes "p1" a default argument value after we've done hard-binding.

var baz = new bar ( "p2" );

baz.val; // p1p2


/* Ignored this */

var foo = function fooFunc(a,b){
	console.log("a:" + a + ", b:" + b);
};

// Using foo.apply to spread out an array as parameters, not sure how the array is spread out.
// Is it sliced? I'm guessing apply will treat arrays this way.
// We're passing null as the this binding, so the array is treated as both arguments?
foo.apply(null, [2,3]);

var bar = foo.bind(null, 2); // This is making 2 the default argument for a.
bar(3); // Since 2 is the default argument for a, bar(3) will pass 3 to b - thus a:2 and b:3


/* Safest use of this */
// It is safter to use a completely empty object when you're trying to perform partial application
// or curry functions
// This is to avoid default binding in case you're using some third-party function that does make a 'this' reference
// The so called DMZ object is used in this fashion:

var foo = function fooFunc(a,b){
	console.log( "a:" + a + ", b:" + b );
};

// The DMZ empty object
var ø = Object.create(null);

foo.apply( ø, [2,3]); // a:2, b:3

// Currying with bind
var bar = foo.bind(ø, 2); // Pretty much similar to passing in null as the this binding, but we're using completely empty object instead
bar(3);


/* Softening Binding */
// Wasn't able to get this working. I get a missing ) after argument list on the line with obj : this

(function () {
"use strict";
	if (!Function.prototype.softBind) {
		Function.prototype.softBind = function(obj) {
			var fn = this;
			// capture any curried parameters
			var curried = [].slice.call( arguments,1 );
			var bound = function() {
				return fn.apply(
					(!this || this === (window || global)) ?
						obj : this
					curried.concat.apply(curried, arguments));
			};
			bound.prototype = object.create(fn.prototype);
			return bound;
		};
	}
	
	var foo = function fooFunc() {
		console.log("name: " + this.name);
	}
	
	var obj = {name: "obj"},
		obj2 = {name: "obj2"},
		obj3 = {name: "obj3"};
		
	var fooOBJ = foo.softBind(obj);
	
	fooOBJ(); // name: obj
	
	obj2.foo = foo.softBind(obj); // This is adding a property I think?
	if (obj2.hasOwnProperty(foo) === true){
		console.log ("We added foo as a method to obj2");
	}
	else{
		console.log("obj2 doesn't have foo as a property");
	};
	obj2.foo(); // Should print name: obj2
	
	fooOBJ.call(obj3); // Should print name: obj3
}());

/******************************************/
/*        Chapter 3 Objects				  */
/******************************************/


// Built-in objects and subtypes
var strObject = new String("I am a string object"); // strObject is a newly constructed object of sub-type String
console.log(typeof strObject);
strObject instanceof String;

Object.prototype.toString.call ( strObject );


var myObject = {
	a : 2
};

var idx;

var wantA = true;

if(wantA) {
	idx = "a";
}

//later

console.log( myObject[idx] ); // 2

var myObject = {};

myObject[true] = "foo";
myObject[3] = "bar";
myObject[myObject] = "baz";

for (var info in myObject){
	console.log(info + " " + myObject[info]);
};

var myObject = {
	true : "foo",
	3 : "bar",
	myObject : "baz"
};

/* Computed Property Names for Objects */
// Performing this type of property naming is included in ES6

var prefix = "foo";

var myObject = {
	[prefix + "bar"] : "Hello",
	[prefix + "baz"] : "world"
};

console.log(myObject["foobar"]);
console.log(myObject["foobaz"]);

// This is probably something you'll want to understand as you look into ES6 more.

// var myOtherObject = {
	// [Symbol.Something] : "Hello World"
// };

// console.log(myOtherObject.Symbol.Something);

/* Property vs. Method */

// Function and method are mostly interchangeable, just know that declaring a function inside of an object
// literal notation doesn't cause that function to magically belong to the object.
// It's just that there are multiple references to the same function object.
var myObject = {
	foo : function(){
		console.log("foo");
	}
};

var someFoo = myObject.foo;

console.log(someFoo); // function foo() {...}

myObject.foo; // function foo() {...}


/* Arrays */

// So this is a bad practice, you want to use arrays to store values at numeric indicies
//   and use objects to store key/value pairs.
// Also trying to add a property to an array and making it look like a number will update
//   an existing index if it has been defined. Such as myArray["2"] = "Some words"
//   would end up changing the value at index 2 of this array.

(function arrayTest() {
var myArray = ["foo", 42, "bar"];

// myArray.baz = "baz";
myArray["baz"] = "baz";
myArray["2"] = "Some words"; // This will actually change myArray[2] which is "bar" to "Some words"

console.log(myArray.length);

myArray.baz;

for (var info in myArray) {
	console.log(info + ":" + myArray[info]);
}
}());


/* Duplicating Objects */

// Shallow v Deep Copy
(function copyFunc() {

function anotherFunction() {
};

var anotherObject = {
	c: true
};

var anotherArray = [];

var myObject = {
	a: 2,
	b: anotherObject,
	c: anotherArray,
	d: anotherFunction
};

var newObj = Object.assign( {}, myObject );

console.log(newObj.a); // 2
console.log(newObj.b === anotherObject); // true
console.log(newObj.c === anotherArray); // true
console.log(newObj.d === anotherFunction); // true
}());


/* Property Descriptors */
// So the properties of an object have a notion of characteristics, 
//   in that they can be writeable, enumerable, and configurable

(function() {
	
var myObject = {
	a : 2,
	myObject : myObject
};
	
console.log(Object.getOwnPropertyDescriptor (myObject, "a"));
console.log(Object.getOwnPropertyDescriptor (myObject, "myObject"));
/*
Object { //  This is the descriptor definition for property a
		value: 2, 
		writable: true, 
		enumerable: true, 
		configurable: true
		}
*/
}());

// So those are the default values for the property descriptor characteristics for a normal property.
// Object.defineProperty(...) can be used to add, or modify a new property as long as it is configurable.
// Adding a property in this fashion allows us to add properties manually and explicitly. This wouldn't be used
// 		unless there was a need to modify one of the descriptor characteristics from its normal behaviour.

(function() {

var myObject = {};

Object.defineProperty ( myObject, "a", {
	value : 2,
	writeable : true,
	configurable : true,
	enumerable : true
} );

console.log(myObject.a);
}());

(function() {
// "use strict";
var Kale = {
	name : "Kale",
	age : 26,
	gender : "M",
	occupation : "QA"
};

var birthday = new Date(1988, 10, 02, 46, 36, 12, 42); // Strict mode doesn't like the Date object for some reason.
birthday.toString();
console.log(birthday);
Kale.birthday = birthday; // This fails in strict mode, apparently we're not allowed octal literals in strict mode.
console.log(Kale.birthday.toJSON()); // Just wanted to see how this would look in JSON

Object.defineProperty( Kale, "age", { // I'm setting the enumerable property descriptor of my age to false
	enumerable : false
});

Object.seal(Kale); // So this demonstrates seal the Kale object, which will change the configurable property descriptor to false

for (var info in Kale){
	console.log(Object.getOwnPropertyDescriptor(Kale, info));
}

Object.freeze(Kale); // And I can call freeze afterwards and not have an error thrown because writeable can be changed from True to False (but not False back to True)

for (var info in Kale){
	console.log(Object.getOwnPropertyDescriptor(Kale, info));
}


for (var info in Kale) { // Now when I enumerate through the object, age should not show up.
	console.log(info + ": " + Kale[info]);
}
}()); //  Remember that this is an immediately invoked function expression (IIFE sometimes called, "iffy")

/* [[Get]] */
// So this is actually what is being performed behind the scenes when you are attempting property access:

var myObject = {
	a: 2
};

if (myObject.hasOwnProperty("a")){ // And I have a feeling hasOwnProperty is inside Get somewhere.
	console.log(true);
}
else 
	console.log(false);
	
console.log(myObject.a);

// A [[Get]] operation is performed here. Like an IIFE on myObject that looks a little like this: [[Get]]())
// And I have a feeling that [[Get]]()) is using the hasOwnProperty method/function, but I'm not sure how yet.

/* [[Put]] */
// Calls a hidden function much as [[Get]] does.

// Defining an explicit get on these two properties
(function (){
var myObject = {
	// Define a getter for 'a'
	get a() {	// I guess this is just saying when I ask for a return 2.
		return 2;
	}
};

Object.defineProperty(myObject, "b",
	{
		//Define a getter for 'b'
		get : function(){ return this.a * 2 },
		
		//Make sure b shows up as an object property if I go looking for it
		enumerable : true
	}
);

console.log(myObject.a);

console.log(myObject.b);

for (var info in myObject) {
	console.log(info + ": " + myObject[info]);
}
}());


// Since no setter has been defined, trying to assign a new value to 'a' silently throws the assignment away.
//	 In strict mode you get "Cannot set property a of myObject, which only has a getter.
// Even if there was a valid setter though, the custom getter is hard-coded to return only 2, so the set operation would be moot.
// You almost always want to declare both the getter and the setter.

(function () {
"use strict";
	var myObject = {
		get a() {
			return 2;
		}
	};
	
	myObject.a = 3;
	
	console.log(myObject.a);
}());

// Here we're defining the getter and the setter.
// YDKJS says that this._a_ (the _a_ part) is just another variable. I even changed it to cat, which worked just fine.

(function() {
	var myObject = {
		// define a getter for 'a'
		get a() {
			return this._a_;
		},
		
		// define a setter for 'a'
		set a(val) {
			this._a_ = val * 2;
		}
	}
	
	myObject.a = 2;
	console.log(myObject.a);
}());


/* Existence Checking */
// Asking an object if it has a certain property without getting the property's value
(function() {
	var myObject = {
		a : 2
	};

	console.log(("a" in myObject)); // Using the in operator will check to see if the property exists anywhere in the object (first?) or if it exists in any level of the [[Prototype]] chain.
	console.log(("b" in myObject));

	console.log(myObject.hasOwnProperty("a")); // Using hasOwnProperty only checks the object you are referencing, does not check any of the [[Prototype]] chain.
	console.log(myObject.hasOwnProperty("b"));
	
	console.log(Object.prototype.hasOwnProperty.call(myObject, "a"));
	
}());
// Keep in mind that using the in operator should only be used with Objects and not for arrays.

// I wrote this to perform checks on Object properties, if the property is not enumerable then set it to enumerable.
// Also make sure the the object is not frozen, which if it were would prevent us from making changes to the property descriptors.
// This would be a way to start traversing the [[Prototype]] chain of an object. If I wanted to get all the properties for a particular object
//   and then the rest of the objects in it's [[Prototype]] chain they would all have to be enumerable. I wouldn't know the property names to check though,
//   if they were not enumerable.
// See Page 58 - 59 YDKJS this and Object Prototypes

(function() {
	var myObject = {};
	
	Object.defineProperty( myObject, "a", {
	value : 2,
	writeable : true,
	configurable : true,
	enumerable : false
	});
	
	console.log("Here are the property descriptors for 'a' :");
	console.log(Object.getOwnPropertyDescriptor (myObject, "a"));

	if ( (myObject.propertyIsEnumerable( "a" ) === false) && (Object.isSealed(myObject) === false) ) { // Check if the object has been sealed, which would have marked all properties as configurable : false
		Object.defineProperty(
			myObject,
			"a",
			{ enumerable : true, value : 2 }
			)
			for (var info in myObject) {
				console.log(info + " : " + myObject[info]);
			}
			console.log(Object.getOwnPropertyDescriptor (myObject, "a"));
		}
	else {
		for (var info in myObject) {
			console.log(info + " : " + myObject[info]);
		}
		console.log(Object.getOwnPropertyDescriptor (myObject, "a"));
	};
	
	console.log(Object.keys(myObject));
}());

/******************************************/
/* Chapter 4 Mixing (Up) "Class" Objects */
/******************************************/

/* Explicit Mixins */

(function () {
	function mixin ( sourceObj, targetObj ) {
		for (var key in sourceObj) {
			// only copy the property if isn't already present in the source
			if (!(key in targetObj)) {
				targetObj[key] = sourceObj[key];
			}
		}
		
		return targetObj;
	}
	
	var Vehicle = {
		engines : 17,
		
		ignition : function ignitionFunc() {
			console.log("Starting my engine");
		},
		
		drive : function driveFunc() {
			this.ignition();
			console.log("Steering and moving forward");
		}
	};
	
	var Car = mixin(Vehicle, {
		wheels : 4,
		
		drive : function driveFunc() {
			Vehicle.drive.call(this);
			console.log("Rolling on all " + this.wheels + " wheels.");
		}
	} );
	
	Vehicle.drive();
	Car.drive();
	
	console.log(Car.engines); // Prints out 17, we're referencing the value in Vehicle.engines
}());


/******************************************/
/* Chapter 5 Prototypes */
/******************************************/


(function() {
	var anotherObject = {
		a : 2
	};
	
	var myObject = Object.create(anotherObject);

	myObject.a = 5;
	console.log(myObject.a);
	console.log(anotherObject.a);
}());

(function() {

	"use strict";
	var myObject = {};

	Object.defineProperty(myObject, "a", {
	value : 2,
	writeable : false,
	configurable : true,
	enumerable : false
	});

	var anotherObject = Object.create(myObject);

	//anotherObject.a = 10; // If this assignment is left this way, you will get an error
						  // You cannot assign to a read only property
						  // Which is actually a little odd when you think about it because anotherObject.a is really just a reference to myObject.a
						  // No such inheritance copying has actually occurred for anotherObject.
						  // This restriction also only applies to = assignment for properties.
						  // And, as you can see this is not enforced when performing Object.defineProperty on anotherObject

	Object.defineProperty (anotherObject, "a", {
		value : 10,
		writeable : true,
		cofigurable : true,
		enumerable : true
	});

	console.log(anotherObject.a);
}());

/* Class Functions */

(function () {
	"use strict";

	function Foo() {
		var a = 2;
		console.log (a);
	}

	var b = new Foo();

	console.log(Object.getPrototypeOf(b)); // You can traverse different properties of Foo {} in Chrome developer console here
	console.log(Object.getPrototypeOf(b) === Foo.prototype); // true
}());

/* Prototypal Inheritance */

(function () {
	"use strict";

	function Foo(name) {
		this.name = name;
	};

	Foo.prototype.myName = function () {
		return this.name;
	};

	function Bar(name, label) {
		Foo.call(this, name);
		this.label = label;
	};

	// Here we make a new 'Bar.prototype'
	// which is linked to 'Foo.prototype'

	Bar.prototype = Object.create(Foo.prototype);

	// At this point 'Bar.prototype.constructor' is gone, and would manually have to be fixed for .constructor property to match Bar as the value.

	Bar.prototype.myLabel = function() {
		return this.label;
	};

	var a = new Bar("a", "obj a");

	console.log(a.myName()); // Prints "a" which is using the method on Foo, up the [[Prototype]] chain.
	console.log(a.myLabel()); // Prints "obj a" 
}());

/* Inspecting "Class" Relationships */
(function () {
	"use strict";

	function Foo() {
		console.log("Some information");
	};

	Foo.prototype.blah = ["Twelve", 112];

	var a = new Foo(); // Constructor call of Foo, linking a.prototype with Foo.prototype // This also prints out "Some information"

	console.log(a.blah); // Print out the array

	// The next question with Prototypes is the following: If we have an object is there a way we can find out what object it delegates to?

	console.log(a instanceof Foo); // Prints true
	// instanceof operator takes a  plain object as its lefthand operand and a function as its righthand operand

	// It would seem that it's cleaner to use Foo.prototype.isPrototypeOf(a);
}());

/* Object links */
(function () {
	"use strict";

	var foo = {
		something: function() {
			console.log( "Tell me something good..." );
		}
	};

	var bar = Object.create(foo); // 

	bar.something();

	console.log(foo.isPrototypeOf(bar)); // Prints true This is asking if foo appears anywhere in bar's prototype chain.

	console.log(Object.getPrototypeOf(bar)); // The prototype of bar is Object

}());

/* Widget "Classes" */

// This is messy and not very simple, trying to override classes and mock super
// The notion of is full of head aches.
(function () {
	"use strict";

	//Parent "class"
	function Widget(width, height) {
		this.width = width || 50;
		this.height = height || 50;
		this.$elem = null;
	}

	Widget.prototype.render = function($where) {
		if(this.$elem) {
			this.$elem.css ( {
				width: this.width + "px",
				height: this.height + "px"
			}).appendTo ($where);
		}
	};

	//Child "Class"
	function Button(width, height, label) {
		// "super" constructor call
		Widget.call( this, width, height );
		this.label = label || "Default";

		this.$elem = $("<button>").text(this.label);
	};

	// Make "Button" "inherit" from Widget
	Button.prototype = Object.create(Widget.prototype);

	// Override the base inherited render method
	Button.prototype.render = function($where) {
		// "super" call
		Widget.prototype.render.call(this, $where);
		this.$elem.click(this.onClick.bind(this));
	};

	Button.prototype.onClick = function(evt) {
		console.log ("Button " + this.label + " clicked!" );
	};

	$( document ).ready(function() {
		var $body = $(document.body);
		var btn1 = new Button(125, 30, "Hello");
		var btn2 = new Button(150, 40, "World");

		btn1.render($body);
		btn2.render($body);
	});

}());

/* Simplified version with OLOO */

// The OLOO Design pattern better supports separation of concerns
// You have the ability to construct objects at the beginning of the program and then
// initialize them with a specific setup when they are pulled from the pool and actually used.

(function() {
	"use strict";

	// Here's the Widget object with object literal notation.
	var Widget = {
		init: function(width, height) {
			this.width = width || 50;
			this.height = height || 50;
			this.$elem = null;
		},
		insert: function($where) {
			if (this.$elem) {
				this.$elem.css( {
					width: this.width + "px",
					height: this.height + "px"
				}).appendTo($where);
			}
		}
	}

	var Button = Object.create(Widget);

	Button.setup = function(width, height, label){
		//delegated call
		this.init(width, height);
		this.label = label || "Default";

		this.$elem = $("<button>").text(this.label);
	};
	Button.build = function($where) {
		//delegated call
		this.insert($where);
		this.$elem.click(this.onClick.bind(this));
	};
	Button.onClick = function(evt) {
		console.log("Button '" + this.label + "' clicked");
	};

	$(document).ready(function() {
		var $body = $(document.body);

		var btn1 = Object.create(Button); // Construction
		btn1.setup(125, 30, "Hello"); // Initialization

		var btn2 = Object.create(Button);	// Same here, construction
		btn2.setup(150, 40, "World");		// Initialization

		btn1.build($body);
		btn2.build($body);
	});

}());



/* Scope and Closures */

There are three major parts to breaking down the following assignment:
var a = 2;

var   a     =    2   ;

First is Tokenizing/Lexing: The string is broken up into chunks that are referred to as tokens.

Next is parsing: The array (stream) of tokens are taken and turned into a tree of nested elements,
	collectively they represent the grammatical sttructure of the program. The tree is called an Abstract Syntax tree

Then Code Generation: The process of taking an Abstract Syntax Tree and actually refining it into executable code.
Javascript is a compiled language, albeit a very quickly compiled language handled by the V8 engine.

var a = 2; Has to be compiled before it is executed, usually executed right away.

Engine
Compiler
Scope

var a = 2; This is a LHS reference
We want to find the variable as a target for the =2 assignnment

console.log (a); This is a RHS reference
We aren't concrened with assignment, nothing is being assigned to a, instead we're looking up to retrieve
the value stored in a so we can pass that to console.log();

(LHS) More concisely means, who is the target of the assignment as in a = 2, where a is the target.

(RHS) More concisely means, who is the source of the assignment as in console.log(a);

// Proper desing of keeping private details inside the scope of the doSomething function
// This is an example of function scope.
(function main(){
	"use strict";

	function doSomething(a){
		
		function doSomethingElse(a) {
			return a - 1;
		}

		var b;

		b = a + doSomethingElse ( a * 2 );

		console.log( (b * 3 ) );
	}

	// console.log(b * 2); // ReferenceError: b is not defined. There is no b in the scope so the Engine returns RefError

	doSomething( 2 ); // Prints out 15

}());

// Collision avoidance
(function main () {
	"use strict";

	function foo() {
		function bar(a) {
			// i = 3; // Changing the 'i' in the enclosing scope's for-loop, i set to a fixed value of 3 it remains unchanged every time the for loop is evaluated.
			console.log( a + i );
		}

		for (var i = 0; i < 10; i++) {
			bar (i * 2 ); // This is an infinite loop
		}
	}

	foo();

// })();
}()); // Either of the two closing wrapper immediate executions work, they are merely a matter of preference.
// I guess this one }()); Looks slightly cleaner.

// Anonymous vs. Named functions
// Function expressions are typically seen as callback parameters such as:

setTimeout( function() {					// This is an anonymous function expression
	console.log("I waited 1 whole seconed");
}, 1000);


// Named function used as the callback
setTimeout( function timoutHandler() {
	debugger;
	console.log("I have waited 1 second");
}, 1000);

// Passing an arument into an IIFE

var a = 2;

(function IIFE (global) { 	// This immediately invoked function execution takes a parameter that we're calling global
	var a = 3;
	console.log(a); // 3
	console.log(global.a); // 2
}(window));		// The global window object is getting passed in here to the global parameter

console.log(a); // 2


undefined = true; // setting a land-mine for other code! avoid!

(function IIFE( undefined ){

    var a;
    if (a === undefined) {
        console.log( "Undefined is safe here!" );
    }

}());

(function () {
	"use strict";

	var a = 2;

	(function IIFE ( def ) {
		def ( window );
		})(function def ( global ) {
			var a = 3;
			console.log(a); // 3
			console.log(global.a); // 2
	});

}());


// Block Scoping

// You can block scope using a with statement, but don't use with statements in Javascript, they are lazy.

// Here's an example of try/catch block Scoping
(function() {
	"use strict";

	try {
	    undefined(); // illegal operation to force an exception!
	}
	catch (err) {
	    console.log( err ); // works!
	}

	try {			// Some linters will complain about the re-use of err in this try/catch block.
		undefined();
	}
	catch (err) {
		console.log( err ); // Even though err is safely block-scoped in the catch block.
	}

	console.log( err ); // ReferenceError: `err` not found
}());

// Explicit block Scoping
// * Doesn't execute in Dev Console *

(function() {
	"use strict";

	var foo = true;

	if (foo) {
		{
			let bar = foo * 2;
			bar = something(bar);
			console.log(bar);
		}
	};

	console.log( bar ); // ReferenceError
}());

(function() {
	"use strict";

	var foo = true, baz = 10;

	if (foo) {
	    let bar = 3;

	    if (baz > bar) { // <-- don't forget `bar` when moving!
	        console.log( baz );
	    }
	}
}());	


(function() {
	"use strict";

	function foo() {
		var a;	// Remember declaration comes first when looking at the scope in question

		console.log(a); // undefined

		a = 2;	// And assignmnets are left in place.
	}

	foo();

}());

(function() {
	"use strict";

	foo();	// TypeError foo is not a function

	var foo = function bar() {
		console.log("This won't get printed");
	}
}());

// Closure

function baz() {
	"use strict";

	var a = 10;

	function foo(){
		console.log(a * 2);
	}

	foo();
};

baz();

var c = 5;

(function main() {
	"use strict";
		function baz() {
			"use strict";

			var a = 10;

			var foo = function fooFunc(){	// Here foo has closure over the scope of baz, foo also has closure over the global scope
				console.log(a  * 2);
				console.log(c);
			}

			foo();
		}
}());

baz();


// Real closure

function foo() {
	var a = 2;

	function bar() {
		console.log(a);
	};

	return bar; // Retruning a reference to bar from foo.
};

var baz = foo();  // Now baz is assigned to what foo is returning, which is the function object bar. If I want to invoke bar, I would do baz();

baz();  // This is where closure comes in, because we are actually executing bar outside of its declared lexical scope.
// Closure is bar's reference to the inner scope of foo.
// One would normally think that after we've executed the foo function and assigned to baz it would get garbage collected. We've left it's scope and we're done, but not quite.
// The inner scope of foo is in fact still in use and does not go away. The function bar() is using that scope.
// Because of where it was declared bar() has lexical scope closure over the inner scope of foo(), which keeps that scope alive for bar() to reference at a later time.
// Closure allows a function to continue to access the lexical scope it was defined in at author-time.


function foo() {
	var a = 2;

	function baz() {
		console.log( a ); // 2
	}

	bar (baz);
}

function bar(fn) {
	fn(); // Another great example of closure.
};

// It's mostly transporting an inner function outside of it's lexical scope, so that we can maintain a scope reference to where it was originally declared,
// then wherever that function gets executed that closure will be exercised.

function wait(message) {
	setTimeout(function timer() {
		console.log(message);
	}, 1000);
}

wait("Look it's more closure");

// Loop and Closure

for(var i = 1; i <=5; i++) {		// This doesn't necessarily work as intended. It's the same i each time, there's only one in the scope.
	(function () { 
		setTimeout(function timer() {	// This is not enough to have scope close over if the scope is just empty.
			console.log(i);
		}, i * 1000);
	}());
}

// This is probably one of the better examples of closure to reference.
for (var i = 1; i <= 5; i++) {
	(function() {		
		var j = i;						// The IIFE needs it's own copy of the value of i for each iteration.
		setTimeout (function timer() {
			console.log(i);
		}, j * 1000);
	}());
}

for (var i = 1; i <=5; i++) {
	(function (j) {					// The IIFE is used to have a new scope per-iteration. A per-iteration block scope was necessary for this to work.
		setTimeout (function timer() {	// This function and the above peform the same task. The closure is also the same.
			console.log(j);						
		}, j * 1000);
	}(i));
};

(function () {
	"use strict";

	for(let i = 1; i <=5; i++) {		// And if we wanted to, we can use ES6 let so that 'i' is initialized again for every iteration.
		setTimeout(function timer() {	// The variable is not declared just once for the loop, it is initialized at each subsequent iteration
			console.log(i);				// with the value of the previous iteration.
		}, i * 1000);
	};
}());


/* Modules */

(function main() {
	"use strict";

	function CoolModule() {		// This is known in JavaScript as the module, it serves as the outer enclosing function
		var something = "cool";
		var another = [1,2,3];

		function doSomething() {		// The enclosing function, CoolModule, must return back at least one inner function
			console.log(something);		// So that this inner function has closure over the private scope, and can access and/or modify that private state.
		};

		function doAnother() {
			console.log(another.join (" ! "));
		};

		return {						// When we return this object-literal, we are exposing the module, it's essentially a public API for the module.
			doSomething : doSomething,	// We reference the inner functions but NOT the inner data variables something and another.
			doAnother: doAnother		// Those inner data variables are to remain hidden and private
		};
	};

	var foo = CoolModule();	// Invoking CoolModule() so that a module instance is created. Creates a new Module instance everytime it's invoked.
	// Without the execution of the outer function the inner scope and closures would not occur.

	foo.doSomething(); // Should print out cool
	foo.doAnother(); // 1 ! 2 ! 3 !

}());


(function main() {			// This is a slight variation of the above Module definition.
	"use strict";

	var foo = (function CoolModule() {	// Setting the IIFE of CoolModule to foo, insures that we only have one instance
		var something = "cool";			// Which this could be considered a Singleton.
		var another = [1,2,3];

		function doSomething() {
			console.log(something);
		};

		function doAnother() {
			console.log(another.join (" ! "));
		};

		return {
			doSomething : doSomething,
			doAnother : doAnother
		};
	}());

	foo.doSomething();
	foo.doAnother();

}());


(function main() {
	"use strict";

	function CoolModule(id) {	// Since Modules are just functions they can recieve parameters.
		function identify() {
			console.log(id);
		};

		return identify;
	};

	var foo1 = CoolModule("foo 1");
	var foo2 = CoolModule("foo 2");

	foo1();
	foo2();
}());

//OR

(function main() {
	"use strict";

	function CoolModule(id) {
		function identify() {
			console.log(id);
		};

		return {
			identify : identify
		};
	};

	var foo1 = CoolModule("This is foo 1");
	var foo2 = CoolModule("This is foo 2");

	foo1.identify();
	foo2.identify();

}());

(function main() {
	"use strict";

	var foo = (function CoolModule(id) {
		function change() {
			publicAPI.identify = identify2; // Allows ability to modify the publicAPI
		};

		function identify1() {
			console.log(id);
		};

		function identify2() {
			console.log(id.toUpperCase());
		};

		var publicAPI = {
			change : change,
			identify : identify1
		};

		return publicAPI;
	}("foo module"));

	foo.identify();	// Invokes/calls identify1
	foo.change();	// Changes the property value of publicAPI.identify to function object identify2;
	foo.identify();

}());

// Example of Modern Module use

(function main () {
	"use strict";

	var MyModules = (function Manager() {
		var modules = {};

		function define(name, deps, impl) {
			for (var i = 0; i < deps.length; i++) {
				deps[i] = modules[deps[i]];
			}
			modules[name] = impl.apply(impl, deps);
		};

		function get(name) {
			return modules[name];
		};

		return {
			define: define,
			get: get
		};
	}());

	MyModules.define("bar", [], function(){
		function hello(who) {
			return "Let me introduce: " + who;
		};

		return {
			hello : hello
		};
	});

	MyModules.define("foo", ["bar"], function(bar){
		var hungry = "hippo";

		function awesome() {
			console.log(bar.hello(hungry).toUpperCase());
		};

		return {
			awesome : awesome
		};
	});

	var bar = MyModules.get("bar");
	var foo = MyModules.get("foo");

	console.log(
		bar.hello("hippo")
	);

	foo.awesome();

}());


(function () {		// Just going back over while and do while loops
	"use strict";

	let b = true;

	do {
		console.log ("Print a");
		b = false;
	} while(b);

	b = true;

	while(b){
		console.log("Print b");
		b = false;
	};

}());