// testing the rest of the "working with functions" section

console.log('testing the "functional programmers toolkit" section');

myArray = [1, 2, 3, 4];
newArray = myArray.map(function(x) {
  return x * 2
});
console.log('Output: [1,2,3,4]');
console.log(myArray);  // Output: [1,2,3,4]
console.log('Output: [2,4,6,8]');
console.log(newArray); // Output: [2,4,6,8]


// --- MAP ---------------------------------------------------------
console.log('testing MAP:');
// will need these vars that are not in the book:
var
  integers = [1, -0, 9, -8, 3],
  numbers = [1, 2, 3, 4],
  str = 'hello world how ya doing?';

// map integers to their absolute values
console.log(integers.map(Math.abs));

// multiply an array of numbers by their position in the array
console.log(numbers.map(function(x, i) {
  return x * i
}));

// Capitalize every other word in a string.
console.log(str.split(' ').map(function(s, i) {
  if (i % 2 == 0) {
    return s.toUpperCase();
  }
  else {
    return s;
  }
}));

// --- FILTER ----------------------------------------------------------------
console.log('testing FILTER:');
var myarray = [1, 2, 3, 4]
words = 'hello 123 world how 345 ya doing'.split(' ');
re = '[a-zA-Z]';


// remove all negative numbers
console.log(
  [-2, -1, 0, 1, 2].filter(function(x) {
    return x > 0
  })
);

// remove null values after a map operation
console.log(
  words.filter(function(s) {
    return s.match(re);
  })
);

// remove random objects from an array
console.log(
  myarray.filter(function() {
    return Math.floor(Math.random() * 2)
  })
);

// --- REDUCE ----------------------------------------------------------------
console.log('testing RECUDE:');
var numbers = [1, 2, 3, 4];

// sum up all the values of an array
console.log(
  [1, 2, 3, 4, 5].reduce(function(x, y) {
    return x + y
  }, 0)
);
// find the largest number
console.log(
  numbers.reduce(function(a, b) {
    return Math.max(a, b)
  }) // max takes two arguments
);


// --- HONERABLE MENTIONS ------------------------------------------------------
console.log('testing all the rest of the stuff in this chapter:');
var arr = [1, 2, 3];
var nodes = arr.map(function(x) {
  var elem = document.createElement("div");
  elem.textContent = x;
  return elem;
});

// log the value of each item
arr.forEach(function(x) {
  console.log(x)
});
//arr.forEach(console.log);

// append nodes to the DOM
nodes.forEach(function(x) {
  document.body.appendChild(x)
});

console.log(
  [1, 2, 3].concat(['a', 'b', 'c']) // concatenate two arrays
);
// Output: [1, 2, 3, 'a','b','c']

var arr1 = [1, 2, 3];
var arr2 = [4, 5, 6];
var arr3 = [7, 8, 9];
var x = arr1.concat(arr2, arr3);
var y = arr1.concat(arr2).concat(arr3);
var z = arr1.concat(arr2.concat(arr3));
console.log(x);
console.log(y);
console.log(z);

var invert = function(arr) {
  return arr.map(function(x, i, a) {
    return a[a.length - (i + 1)];
  });
};
var q = invert([1, 2, 3, 4]);
console.log(q);

arr = [200, 12, 56, 7, 344];
console.log(
  arr.sort(function(a, b) {
    return a - b
  })
);
// arr is now: [7, 12, 56, 200, 344];

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
console.log([1, 2, 3, 4].every(isNumber)); // Return: true
console.log([1, 2, 'a'].every(isNumber)); // Return: false
console.log([1, 2, 'a'].some(isNumber));  // Return: true


// --- CALLBACKS ----------------------------------------------------------------
// moving this to the end because it throws errors (it's supposed to though)
console.log('testing CALLBACKS:');

// not in book but needed for testing:
var myArray = [1, 2, 3];
var myURI = 'index.html';

// now the following is in the book

function myCallback(x) {
  return x + 1
};
console.log(
  myArray.map(myCallback)
);
console.log(
  myArray.map(function(x) {
    return x + 1
  })
);

function myCallback(xhr) {
  console.log(xhr.status);
  return true;
}
$.ajax(myURI).done(myCallback);

try {
  // this is wrong:
  $.ajax(myURI).fail(myCallback(xhr));
} catch (e) {
  console.log('this SHOULD throw an error:', e);
}

// and so is this:
$.ajax(myURI).fail(myCallback());

// this is correct:
$.ajax(myURI).fail(function(xhr) {
  myCallback(xhr)
});
// and so is this:
$.ajax(myURI).fail(myCallback); // only works because


function myCallback(status) {
  console.log(status);
  return true;
}
$.ajax(myURI).done(function(xhr) {
  myCallback(xhr.status)
});
