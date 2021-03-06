var Polygon = function(n) {
  this.numSides = n;
};

var Rectangle = function(w, l) {
  this.width = w;
  this.length = l;
};

// the Rectangle's prototype is redefined with Object.create
Rectangle.prototype = Object.create(Polygon.prototype);

// it's important to now restore the constructor attribute
// otherwise it stays linked to the Polygon
Rectangle.prototype.constructor = Rectangle;

// now we can continue to define the Rectangle class
Rectangle.prototype.numSides = 4;
Rectangle.prototype.getArea = function() {
  return this.width * this.length;
};

var Square = function(w) {
  this.width = w;
  this.length = w;
};
Square.prototype = Object.create(Rectangle.prototype);
Square.prototype.constructor = Square;

var s = new Square(5);
console.log(s.getArea()); // 25


var Maybe = function() {
};

var None = function() {
};
None.prototype = Object.create(Maybe.prototype);
None.prototype.constructor = None;
None.prototype.toString = function() {
  return 'None';
};

var Just = function(x) {
  this.x = x;
};
Just.prototype = Object.create(Maybe.prototype);
Just.prototype.constructor = Just;
Just.prototype.toString = function() {
  return "Just " + this.x;
};


// --- FUNCTIONAL INHERITANCE -------------------------------------

var Shirt = function(size) {
  this.size = size;
};

var TShirt = function(size) {
  this.size = size;
};
TShirt.prototype = Object.create(Shirt.prototype);
TShirt.prototype.constructor = TShirt;
TShirt.prototype.getPrice = function() {
  if (this.size == 'small') {
    return 5;
  } else {
    return 10;
  }
}

var ExpensiveShirt = function(size) {
  this.size = size;
}
ExpensiveShirt.prototype = Object.create(Shirt.prototype);
ExpensiveShirt.prototype.constructor = ExpensiveShirt;
ExpensiveShirt.prototype.getPrice = function() {
  if (this.size == 'small') {
    return 20;
  } else {
    return 30;
  }
};

var Store = function(products) {
  this.products = products;
};
Store.prototype.calculateTotal = function() {
  return this.products.reduce(function(sum, product) {
      return sum + product.getPrice();
    }, 10) * TAX; // start with $10 markup, times global TAX var
};

var TAX = 1.08;
var p1 = new TShirt('small');
var p2 = new ExpensiveShirt('large');
var s = new Store([p1, p2]);
console.log(s.calculateTotal()); // Output: 35


var Customer = function() {
};
Customer.prototype.calculateTotal = function(products) {
  return products.reduce(function(total, product) {
      return total + product.getPrice();
    }, 10) * TAX;
};

var RepeatCustomer = function() {
};
RepeatCustomer.prototype = Object.create(Customer.prototype);
RepeatCustomer.prototype.constructor = RepeatCustomer;
RepeatCustomer.prototype.calculateTotal = function(products) {
  return products.reduce(function(total, product) {
      return total + product.getPrice();
    }, 5) * TAX;
};

var TaxExemptCustomer = function() {
};
TaxExemptCustomer.prototype = Object.create(Customer.prototype);
TaxExemptCustomer.prototype.constructor = TaxExemptCustomer;
TaxExemptCustomer.prototype.calculateTotal = function(products) {
  return products.reduce(function(total, product) {
    return total + product.getPrice();
  }, 10);
};

var Store = function(products) {
  this.products = products;
  this.customer = new Customer();
  // bonus exercise: use Maybes from Chapter 5 instead of a default customer instance
};
Store.prototype.setCustomer = function(customer) {
  this.customer = customer;
};
Store.prototype.getTotal = function() {
  return this.customer.calculateTotal(this.products);
};

var p1 = new TShirt('small');
var p2 = new ExpensiveShirt('large');
var s = new Store([p1, p2]);
var c = new TaxExemptCustomer();
s.setCustomer(c);
console.log(s.getTotal()); // Output: 45


// --- MIXINS -----------------------------------------------

var small = {
  getPrice: function() {
    return this.basePrice + 6;
  },
  getDimensions: function() {
    return [44, 63]
  }
};
var large = {
  getPrice: function() {
    return this.basePrice + 10;
  },
  getDimensions: function() {
    return [64, 83]
  }
};

var Shirt = function() {
  this.basePrice = 1;
};
Shirt.getPrice = function() {
  return this.basePrice;
};
var TShirt = function() {
  this.basePrice = 5;
  this.title = 't-shirt';
};
TShirt.prototype = Object.create(Shirt.prototype);
TShirt.prototype.constructor = TShirt;

var ExpensiveShirt = function() {
  this.basePrice = 10;
  this.title = 'permium shirt';
};
ExpensiveShirt.prototype = Object.create(Shirt.prototype);
ExpensiveShirt.prototype.constructor = ExpensiveShirt;


Object.prototype.addMixin = function(mixin) {
  for (var prop in mixin) {
    if (mixin.hasOwnProperty(prop)) {
      this.prototype[prop] = mixin[prop];
    }
  }
};

TShirt.addMixin(small);
var p1 = new TShirt();
console.log(p1.getPrice()); // Output: 11

TShirt.addMixin(large);
var p2 = new TShirt();
console.log(p2.getPrice()); // Output: 15

Object.prototype.plusMixin = function(mixin) {
  // create a new object that inherits from the old
  var newObj = this;
  newObj.prototype = Object.create(this.prototype);
  for (var prop in mixin) {
    if (mixin.hasOwnProperty(prop)) {
      newObj.prototype[prop] = mixin[prop];
    }
  }
  return newObj;
};

var SmallTShirt = TShirt.plusMixin(small); // creates a new class
var smallT = new SmallTShirt();
console.log(smallT.getPrice());  // Output: 11

var LargeTShirt = TShirt.plusMixin(large);
var largeT = new LargeTShirt();
console.log(largeT.getPrice()); // Output: 15
console.log(smallT.getPrice()); // Output: 11 (not effected by 2nd mixin call)


// mixins
var small = {
  getPrice: function() {
    return this.basePrice + 6;
  },
  getDimmentions: function() {
    return [44, 63]
  },
  getTitle: function() {
    return 'small ' + this.title; // small or medium or large
  },
};
var medium = {
  getPrice: function() {
    return this.basePrice + 8;
  },
  getDimmentions: function() {
    return [54, 73]
  },
  getTitle: function() {
    return 'medium ' + this.title; // small or medium or large
  },
};
var large = {
  getPrice: function() {
    return this.basePrice + 10;
  },
  getDimmentions: function() {
    return [64, 83]
  },
  getTitle: function() {
    return 'large ' + this.title; // small or medium or large
  },
};


// in the real world there would be way more products and mixins!
var productClasses = [ExpensiveShirt, TShirt];
var mixins = [small, medium, large];

// mix them all together
products = productClasses.reduce(function(previous, current) {
  var newProduct = mixins.map(function(mxn) {
    var mixedClass = current.plusMixin(mxn);
    var temp = new mixedClass();
    return temp;
  });
  return previous.concat(newProduct);
}, []);
products.forEach(function(o) {
  console.log(o.getPrice())
});


// the store
var Store = function() {
  productClasses = [ExpensiveShirt, TShirt];
  productMixins = [small, medium, large];
  this.products = productClasses.reduce(function(previous, current) {
    var newObjs = productMixins.map(function(mxn) {
      var mixedClass = current.plusMixin(mxn);
      var temp = new mixedClass();
      return temp;
    });
    return previous.concat(newObjs);
  }, []);
};
Store.prototype.displayProducts = function() {
  this.products.forEach(function(p) {
    $('ul#products').append('<li>' + p.getTitle() + ': $' + p.getPrice() + '</li>');
  });
};
Store.prototype.setCustomer = function(customer) {
  this.customer = customer;
};
Store.prototype.getTotal = function() {
  return this.customer.calculateTotal(this.products);
};

var newCustomer = new TaxExemptCustomer();
var newStore = new Store();
newStore.setCustomer(newCustomer);
newStore.displayProducts();
