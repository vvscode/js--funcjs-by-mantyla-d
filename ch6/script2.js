// --- VARIABLE SCOPE -------------------------------

var x = 'hi';
function a() {
  console.log(x);
}
a(); // 'hi'

var x = 'hi';
function a() {
  console.log(x);
}
function b() {
  var x = 'hello';
  console.log(x);
}
b(); // hello
a(); // hi

function c() {
  var y = 'greetings';
  if (true) {
    var y = 'guten tag';
  }
  console.log(y);
}

function d() {
  var y = 'greetings';

  function e() {
    var y = 'guten tag';
  }

  console.log(y)
}
c(); // 'guten tag'
d(); // 'greetings'

var isTrue = function() {
  return true
};

function e() {
  var z = 'namaste';
  [1, 2, 3].forEach(function(n) {
    var z = 'aloha';
  });
  isTrue(function() {
    var z = 'good morning';
  });
  console.log(z);
}
e(); // 'namaste'

var x = 'hi';
var obj = function() {
  this.x = 'hola';
};
var foo = new obj();
console.log(foo.x); // 'hola'
foo.x = 'bonjour';
console.log(foo.x); // 'bonjour'

obj.prototype.x = 'greetings';
obj.prototype.y = 'konnichi ha';
var bar = new obj();
console.log(bar.x); // still prints 'hola'
console.log(bar.y); // 'konnichi ha'


var name = 'Ford Focus';
var year = '2006';
var millage = 123456;
function getMillage() {
  return millage;
}
function updateMillage(n) {
  millage = n;
}

var car = function() {
  var name = 'Ford Focus';
  var year = '2006';
  var millage = 123456;

  function getMillage() {
    return Millage;
  }

  function updateMillage(n) {
    millage = n;
  }
}();

(function() {
  var name = 'Ford Focus';
  var year = '2006';
  var millage = 123456;

  function getMillage() {
    return millage;
  }

  function updateMillage(n) {
    millage = n;
  }
})();

var car = function() {
  var name = 'Ford Focus';
  var year = '2006';
  var millage = 123456;
  return {
    getMillage: function() {
      return millage;
    },
    updateMillage: function(n) {
      millage = n;
    }
  }
}();
car.getMillage(); // works
car.updateMillage(123); // also works
car.millage; // undefined

for (var n = 4; false;) {
}
console.log(n);

var x = 1;
function foo2() {
  if (false) {
    var x = 2;
  }
  return x;
}
foo2(); // Return value: 'undefined', expected return value: 2

window.a = 19;
console.log(a); // Output: 19
