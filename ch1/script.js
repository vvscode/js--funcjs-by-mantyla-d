// imperitive

// create some objects to store the data.
var columbian = {
  name: 'columbian',
  basePrice: 5
};
var frenchRoast = {
  name: 'french roast',
  basePrice: 8
};
var decaf = {
  name: 'decaf',
  basePrice: 6
};

// we'll use a helper function to calculate the cost
// according to the size and print it to an HTML list
function printPrice(coffee, size) {
  if (size === 'small') {
    var price = coffee.basePrice + 2;
  } else if (size === 'medium') {
    var price = coffee.basePrice + 4;
  } else {
    var price = coffee.basePrice + 6;
  }

  // create the new html list item
  var node = document.createElement("li");
  var label = coffee.name + ' ' + size;
  var textnode = document.createTextNode(label + ' price: $' + price);
  node.appendChild(textnode);
  document.getElementById('products1').appendChild(node);
}

// now all we need to do is call the printPrice function
// for every single combination of coffee type and size
printPrice(columbian, 'small');
printPrice(columbian, 'medium');
printPrice(columbian, 'large');
printPrice(frenchRoast, 'small');
printPrice(frenchRoast, 'medium');
printPrice(frenchRoast, 'large');
printPrice(decaf, 'small');
printPrice(decaf, 'medium');
printPrice(decaf, 'large');

//----------------------------------------
// functional

// this function is needed but not included in this chapter because it's a demonstration
// and will be explained in a later chapter
var plusMixin = function(oldObj, mixin) {
  var newObj = oldObj;
  newObj.prototype = Object.create(oldObj.prototype);
  for (var prop in mixin) {
    if (mixin.hasOwnProperty(prop)) {
      newObj.prototype[prop] = mixin[prop];
    }
  }
  return newObj;
};

var plusMixin1 = function(oldObj, mixin) {
  // Construct the [[Prototype]] for the new object
  var newObjPrototype = Object.create(Object.getPrototypeOf(oldObj));

  // Mix-in the mixin into the newly created object
  Object.keys(mixin).map(function(k) {
    newObjPrototype[k] = mixin[k];
  });
  // Use this newly created and mixed-in object as the [[Prototype]] for the result
  return Object.create(newObjPrototype);
};

// separate the data and logic from the interface
var printPrice = function(price, label) {
  var node = document.createElement("li");
  var textnode = document.createTextNode(label + ' price: $' + price);
  node.appendChild(textnode);
  document.getElementById('products2').appendChild(node);
}

// create function objects for each type of coffee
var columbian = function() {
  this.name = 'columbian';
  this.basePrice = 5;
};
var frenchRoast = function() {
  this.name = 'french roast';
  this.basePrice = 8;
};
var decaf = function() {
  this.name = 'decaf';
  this.basePrice = 6;
};

// create object literals for the different sizes
var small = {
  getPrice: function() {
    return this.basePrice + 2
  },
  getLabel: function() {
    return this.name + ' small'
  }
};
var medium = {
  getPrice: function() {
    return this.basePrice + 4
  },
  getLabel: function() {
    return this.name + ' medium'
  }
};
var large = {
  getPrice: function() {
    return this.basePrice + 6
  },
  getLabel: function() {
    return this.name + ' large'
  }
};

// put all the coffee types and sizes into arrays
var coffeeTypes = [columbian, frenchRoast, decaf];
var coffeeSizes = [small, medium, large];

// build new objects that are combinations of the above
// and put them into a new array
var coffees = coffeeTypes.reduce(function(previous, current) {
  var newCoffee = coffeeSizes.map(function(mixin) {
    // `plusMixin` function for functional mixins, see Ch.7
    var newCoffeeObj = plusMixin(current, mixin);
    return new newCoffeeObj();
  });
  return previous.concat(newCoffee);
}, []);

// we've now defined how to get the price and label for each
// coffee type and size combination, now we can just print them
coffees.forEach(function(coffee) {
  printPrice(coffee.getPrice(), coffee.getLabel());
});

var peruvian = function() {
  this.name = 'peruvian';
  this.basePrice = 11;
};

var extraLarge = {
  getPrice: function() {
    return this.basePrice + 10
  },
  getLabel: function() {
    return this.name + ' extra large'
  }
};


coffeeTypes.push(peruvian);
coffeeSizes.push(extraLarge);

coffeeTypes
  .reduce(function(previous, current) {
    var newCoffee = coffeeSizes.map(function(mixin) {
      // `plusMixin` function for functional mixins, see Ch.7
      var newCoffeeObj = plusMixin(current, mixin);
      return new newCoffeeObj();
    });
    return previous.concat(newCoffee);
  }, [])
  .forEach(function(coffee) {
    printPrice(coffee.getPrice(), coffee.getLabel());
  });