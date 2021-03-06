// --- apply, call, this, function factories ------------------------------------------------
console.log('testing apply, call, this, function factories...');

console.log(
  ['Hello', 'world'].join(' ') // normal way
);
console.log(
  Array.prototype.join.call(['Hello', 'world'], ' ') // using call
);

console.log(
  (function() {
    console.log(this.length)
  }).call([1, 2, 3])
);

console.log(
  Math.max(1, 2, 3) // returns 3
);
console.log('this next one should NOT output a number');
console.log(
  Math.max([1, 2, 3]) // won't work for arrays though
);
console.log(
  Math.max.apply(null, [1, 2, 3]) // but this will work
);

function Drum() {
  this.noise = 'boom';
  this.duration = 1000;
  this.goBoom = function() {
    console.log(this.noise)
  };
}
var drum = new Drum();
setInterval(drum.goBoom.bind(drum), drum.duration);

function bindFirstArg(func, a) {
  return function(b) {
    return func(a, b);
  };
}

var powersOfTwo = bindFirstArg(Math.pow, 2);
console.log(powersOfTwo(3)); // 8
console.log(powersOfTwo(5)); // 32

function bindSecondArg(func, b) {
  return function(a) {
    return func(a, b);
  };
}
var squareOf = bindSecondArg(Math.pow, 2);
var cubeOf = bindSecondArg(Math.pow, 3);
console.log(squareOf(3)); // 9
console.log(squareOf(4)); // 16
console.log(cubeOf(3));   // 27
console.log(cubeOf(4));   // 64

var makePowersOf = bindFirstArg(bindFirstArg, Math.pow);
var powersOfThree = makePowersOf(3);
console.log(powersOfThree(2)); // 9
console.log(powersOfThree(3)); // 27


// --- PARTIAL APPLICATION -----------------------------------
console.log('now testing partial application...');

Function.prototype.partialApply = function() {
  var func = this;
  args = Array.prototype.slice.call(arguments);
  return function() {
    return func.apply(this, args.concat(
      Array.prototype.slice.call(arguments)
    ));
  };
};


function nums2hex() {
  function componentToHex(component) {
    var hex = component.toString(16);
    // make sure the return value is 2 digits, i.e. 0c or 12
    if (hex.length == 1) {
      return '0' + hex;
    } else {
      return hex;
    }
  }

  return Array.prototype.map.call(arguments, componentToHex).join('');
}

// the function works on any number of inputs
console.log(
  nums2hex()); // ''
console.log(
  nums2hex(100, 200));  // '64c8'
console.log(
  nums2hex(100, 200, 255, 0, 123));  // '64c8ff007b'

// but we can use the partial function to partially apply
// arguments, such as the OUI of a mac address
var myOUI = 123;
var getMacAddress = nums2hex.partialApply(myOUI);
console.log(
  getMacAddress()); // '7b'
console.log(
  getMacAddress(100, 200, 2, 123, 66, 0, 1)) // '7b64c8027b420001'

// or we can convert rgb values of red only to hexadecimal
var shadesOfRed = nums2hex.partialApply(255);
console.log(
  shadesOfRed(123, 0));   // 'ff7b00'
console.log(
  shadesOfRed(100, 200)); // 'ff64c8'

Function.prototype.partialApplyRight = function() {
  var func = this;
  args = Array.prototype.slice.call(arguments);
  return function() {
    return func.apply(
      this,
      [].slice.call(arguments, 0)
        .concat(args));
  };
};

var shadesOfBlue = nums2hex.partialApplyRight(255);
console.log(
  shadesOfBlue(123, 0));   // '7b00ff'
console.log(
  shadesOfBlue(100, 200)); // '64c8ff'

var shadesOfGreen = nums2hex.partialApplyRight(255, 0);
console.log(
  shadesOfGreen(123));   // '7bff00'
console.log(
  shadesOfGreen(100));   // '64ff00'


// --- CURRYING ---------------------------------------------------------
console.log("now testing CURRYING....");

Function.prototype.curry = function(numArgs) {
  var func = this;
  numArgs = numArgs || func.length;

  // recursively acquire the arguments
  function subCurry(prev) {
    return function(arg) {
      var args = prev.concat(arg);
      if (args.length < numArgs) {
        // recursive case: we still need more args
        return subCurry(args);
      } else {
        // base case: apply the function
        return func.apply(this, args);
      }
    };
  }

  return subCurry([]);
};

function rgb2hex(r, g, b) {
  // nums2hex is previously defined in this chapter
  return '#' + nums2hex(r) + nums2hex(g) + nums2hex(b);
}
var hexColors = rgb2hex.curry();
console.log("expected output is a function, 'returns a curried function'");
console.log(
  hexColors(11) // returns a curried function
);
console.log("expected output is a function, 'returns a curried function'");
console.log(
  hexColors(11, 12, 123) // returns a curried function
);
console.log(
  hexColors(11)(12)(123) // returns #0b0c7b
);
console.log(
  hexColors(210)(12)(0)  // returns #d20c00
);

var reds = function(g, b) {
  return hexColors(255)(g)(b)
};
var greens = function(r, b) {
  return hexColors(r)(255)(b)
};
var blues = function(r, g) {
  return hexColors(r)(g)(255)
};

console.log(
  reds(11, 12)   // returns #ff0b0c
);
console.log(
  greens(11, 12) // returns #0bff0c
);
console.log(
  blues(11, 12)  // returns #0b0cff
);

var hexs = nums2hex.curry(2);
console.log(
  hexs(11)(12)     // returns 0b0c
);
console.log(
  hexs(11)         // returns function
);
console.log('expected output: incorrect');
console.log(
  hexs(110)(12)(0) // incorrect
);


