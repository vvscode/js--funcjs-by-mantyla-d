// --- type safeties -----------------------------------------------------------

//var str = function(s) {
//  if (typeof s === "string") {
//    return s;
//  } else {
//    throw new TypeError("Error: String expected, " + typeof s + " given.");
//  }
//}
//var num = function(n) {
//  if (typeof n === "number") {
//    return n;
//  } else {
//    throw new TypeError("Error: Number expected, " + typeof n + " given.");
//  }
//}
//var bool = function(b) {
//  if (typeof b === "boolean") {
//    return b;
//  } else {
//    throw new TypeError("Error: Boolean expected, " + typeof b + " given.");
//  }
//}
//var func = function(f) {
//  if (typeof f === "function") {
//    return f;
//  } else {
//    throw new TypeError("Error: Function expected, " + typeof f + " given.");
//  }
//}

//var obj = function(o) {
//  if (Object.prototype.toString.call(o) === "[object Object]") {
//    return o;
//  } else {
//    throw new TypeError("Error: Object expected, something else given.");
//  }
//}

//console.log(num(1));
//console.log(str('asf'));
//console.log(bool(true));
//console.log(func(alert));

var typeOf = function(type) {
  return function(x) {
    if (typeof x === type) {
      return x;
    } else {
      throw new TypeError("Error: " + type + " expected, " + typeof x + " given.");
    }
  }
};

var str = typeOf('string'),
  num = typeOf('number'),
  func = typeOf('function'),
  bool = typeOf('boolean');


console.log(num(1));
console.log(str('asf'));
console.log(bool(true));
console.log(func(alert));

// unprotected method:
var x = '24';
x + 1; // will return '241', not 25

// protected method
// plusplus :: Int -> Int
function plusplus(n) {
  return num(n) + 1;
}
x = 24;
console.log(plusplus(x));

// timestampLength :: String -> Int
function timestampLength(t) {
  console.log(num(str(t).length));
}
//timestampLength(Date.parse('12/31/1999')); // throws error
timestampLength(Date.parse('12/31/1999')
  .toString()); // returns 12



var objectTypeOf = function(name) {
  return function(o) {
    if (Object.prototype.toString.call(o) === "[object " + name + "]") {
      return o;
    } else {
      throw new TypeError("Error: " + name + " expected, something else given.");
    }
  }
};
var obj = objectTypeOf('Object');
var arr = objectTypeOf('Array');
var date = objectTypeOf('Date');
var div = objectTypeOf('HTMLDivElement');


// --- functors ---------------------------------------------------------------------

[1, 4, 9].map(Math.sqrt); // Returns: [1, 2, 3]

// map :: (a -> b) -> [a] -> [b]
var map = function(f, a) {
  return arr(a).map(func(f));
};

// strmap :: (str -> str) -> str -> str
var strmap = function(f, s) {
  return str(s).split('').map(func(f)).join('');
};

var MyObject = function(x) {
  var myValue = x
};

// MyObject#map :: (myValue -> a) -> a
MyObject.prototype.map = function(f) {
  return f(th.myValue);
};

// arrayOf :: (a -> b) -> ([a] -> [b])
var arrayOf = function(f) {
  return function(a) {
    return map(func(f), arr(a));
  };
};

var plusplusall = arrayOf(plusplus); // plusplus is our morphism
plusplusall([1, 2, 3]); // returns [2,3,4]
//plusplusall([1,'2',3]); // error is thrown

var strs = arrayOf(str);
strs(['a', 'b', 'c']); // returns ['a','b','c']
//strs(['a',2,'c']); // throws error

//var fcompose = function(f, g) {
//  return function() {
//    return f.call(this, g.apply(this, arguments));
//  };
//};

var fcompose = function() {
  // first make sure all arguments are functions
  var argsOfCompose = Array.prototype.slice.call(arguments);
  var funcs = arrayOf(func)(argsOfCompose);

  // return a function that applies all the functions
  return function() {
    var argsOfFuncs = arguments;
    for (var i = funcs.length; i > 0; i -= 1) {
      argsOfFuncs = [funcs[i - 1].apply(this, argsOfFuncs)];
    }
    return argsOfFuncs[0];
  };
};


// example:
var fasdf = fcompose(Math.sqrt, function(n) {
  return n * 4
});
console.log(fasdf(2));
