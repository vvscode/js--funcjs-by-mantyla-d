// --- RECURSION -------------------------------

var factorial = function(n) {
  if (n == 0) {
    // base case
    return 1;
  } else {
    // recursive case
    return n * factorial(n - 1);
  }
}
console.log(factorial(5));
//console.log('the following is SUPPOST to excede the stack size (unless you have a pc with tons of memory)');
//console.log(factorial(234567));

var trampoline = function(f) {
  while (f && f instanceof Function) {
    f = f.apply(f.context, f.args);
  }
  return f;
}

var factorial = function(n) {
  var _fact = function(x, n) {
    if (n == 0) {
      // base case
      return x;
    } else {
      // recursive case
      return _fact.bind(null, n * x, n - 1);
    }
  }
  return trampoline(_fact.bind(null, 1, n));
}

console.log(factorial(5));
console.log(factorial(123456));

var thunk = function(fn) {
  return function() {
    var args = Array.prototype.slice.apply(arguments);
    return function() {
      return fn.apply(this, args);
    };
  };
};

var factorial = function(n) {
  var fact = function(x, n) {
    if (n == 0) {
      return x;
    } else {
      return thunk(fact)(n * x, n - 1);
    }
  }
  return trampoline(thunk(fact)(1, n));
}


console.log(factorial(5));
console.log(factorial(123456));

var factorial = function(n) {
  var _fact = thunk(function(x, n) {
    if (n == 0) {
      // base case
      return x;
    } else {
      // recursive case
      return _fact(n * x, n - 1);
    }
  });
  return trampoline(_fact(1, n));
}

console.log(factorial(5));
console.log(factorial(123456));

var Y = function(F) {
  return (function(f) {
    return f(f);
  }(function(f) {
    return F(function(x) {
      return f(f)(x);
    });
  }));
}

var FactorialGen = function(factorial) {
  return (function(n) {
    if (n == 0) {
      // base case
      return 1;
    } else {
      // recursive case
      return n * factorial(n - 1);
    }
  });
};
Factorial = Y(FactorialGen);
console.log(Factorial(10)); // 3628800
//Factorial(23456);

var FactorialGen2 = function(factorial) {
  return function(n) {
    var factorial = thunk(function(x, n) {
      if (n == 0) {
        return x;
      } else {
        return factorial(n * x, n - 1);
      }
    });
    return trampoline(factorial(1, n));
  }
};

var Factorial2 = Y(FactorialGen2)
console.log(Factorial2(10)); // 3628800
console.log(Factorial2(23456)); // Infinity

var Ymem = function(F, cache) {
  if (!cache) {
    cache = {}; // Create a new cache.
  }
  return function(arg) {
    if (cache[arg]) {
      // Answer in cache
      return cache[arg];
    }
    // else compute the answer
    var answer = (F(function(n) {
      return (Ymem(F, cache))(n);
    }))(arg); // Compute the answer.

    cache[arg] = answer; // Cache the answer.
    return answer;
  };
}

var factorial3 = Ymem(FactorialGen2);
console.log(Factorial2(10)); // 3628800
console.log(Factorial2(23456)); // Infinity
