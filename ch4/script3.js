// --- LAZY.JS -------------------------------------------------

function Receptor(name) {
  this.name = name;
  this.available = true; // mutable state

  this.render = function() {
    var output = '<li>';
    output += this.available ?
    this.name + ' is available' :
    this.name + ' is not available';
    output += '</li>';
    return output;
  }
}

var r1 = new Receptor('Danny');
var r2 = new Receptor('Nate');
var r3 = new Receptor('Alex');
var receptors = [r1, r2, r3];
var container = document.getElementById('list');
var me = r1;

//r1.logOut();
//receptors.forEach(function(r){r.render(containter)});

var lazyReceptors = Lazy(receptors).map(function(r) {
  return r.render()
});
//r1.available = false;
container.innerHTML = lazyReceptors.toArray().join('');


window.addEventListener('focus', function(event) {
  r1.available = true;
  console.log('focused');
  container.innerHTML = lazyReceptors.toArray().join('');
});
window.addEventListener('blur', function(event) {
  r1.available = false;
  console.log('blurred');
  container.innerHTML = lazyReceptors.toArray().join('');
});


var focusedReceptors = Lazy.events(window, "focus").each(function(e) {
  me.available = true;
  container.innerHTML = lazyReceptors.toArray().join('');
});
var blurredReceptors = Lazy.events(window, "blur").each(function(e) {
  me.available = false;
  container.innerHTML = lazyReceptors.toArray().join('');
});


timeout = null;
var inputs = Lazy.events(window, "mousemove").each(function(e) {
  me.available = true;
  clearTimeout(timeout);
  timeout = setTimeout(function() {
    me.available = false;
    container.innerHTML = lazyReceptors.toArray().join('');
  }, 3000);
  container.innerHTML = lazyReceptors.toArray().join('');
});


// --- BACON.JS ------------------------------------------------


function Region(name, percent, parties) {
  // mutable properties:
  this.name = name;
  this.percent = percent; // % of precincts reported
  this.parties = parties; // political parties

  // return an HTML representation
  this.render = function() {
    var lis = this.parties.map(function(p) {
      return '<li>' + p.name + ': ' + p.votes + '</li>';
    });
    var output = '<h2>' + this.name + '</h2>';
    output += '<ul>' + lis.join('') + '</ul>';
    output += 'Percent reported: ' + this.percent;
    return output;
  }
}
function getRegions(data) {
  return JSON.parse(data).map(function(obj) {
    return new Region(obj.name, obj.percent, obj.parties);
  });
}
var url = 'http://api.server.com/election-data?format=json';
var data = jQuery.ajax(url);
var regions = getRegions(data);
app.container.innerHTML = regions.map(function(r) {
  return r.render();
}).join('');

var eventStream = Bacon.fromPoll(10000, function() {
  return Bacon.Next;
});
var subscriber = eventStream.subscribe(function() {
  var url = 'http://api.server.com/election-data?format=json';
  var data = jQuery.ajax(url);
  var newRegions = getRegions(data);
  container.innerHTML = newRegions.map(function(r) {
    return r.render();
  }).join('');
});

var url = 'http://api.server.com/election-data?format=json';
var eventStream = Bacon.fromonPromise(jQuery.ajax(url));
var subscriber = eventStream.onValue(function(data) {
  newRegions = getRegions(data);
  container.innerHTML = newRegions.map(function(r) {
    return r.render();
  }).join('');
});

// create the eventStream out side of the functions
var eventStream = Bacon.onPromise(jQuery.ajax(url));
var subscribe = null;
var url = 'http://api.server.com/election-data?format=json';

// our un-modified subscriber
$('button#showAll').click(function() {
  var subscriber = eventStream.onValue(function(data) {
    var newRegions = getRegions(data).map(function(r) {
      return new Region(r.name, r.percent, r.parties);
    });
    container.innerHTML = newRegions.map(function(r) {
      return r.render();
    }).join('');
  });
});

// a button for showing the total votes
$('button#showTotal').click(function() {
  var subscriber = eventStream.onValue(function(data) {
    var emptyRegion = new Region('empty', 0, [{
      name: 'Republican', votes: 0
    }, {
      name: 'Democrat', votes: 0
    }]);
    var totalRegions = getRegions(data).reduce(function(r1, r2) {
      newParties = r1.parties.map(function(x, i) {
        return {
          name: r1.parties[i].name,
          votes: r1.parties[i].votes + r2.parties[i].votes
        };
      });
      newRegion = new Region('Total', (r1.percent + r2.percent) / 2, newParties);
      return newRegion;
    }, emptyRegion);
    container.innerHTML = totalRegions.render();
  });
});

// a button for only displaying regions that are reporting > 50%
$('button#showMostlyReported').click(function() {
  var subscriber = eventStream.onValue(function(data) {
    var newRegions = getRegions(data).map(function(r) {
      if (r.percent > 50) return r;
      else return null;
    }).filter(function(r) {
      return r != null;
    });
    container.innerHTML = newRegions.map(function(r) {
      return r.render();
    }).join('');
  });
});