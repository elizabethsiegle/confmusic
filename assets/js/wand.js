let WAND = {};
const tilt = {
    left: -40,
    right: 40,
    up: 40,
    down: -40
};
let down = false,
    up = false,
    right = false,
    left = false;

class Note {

    constructor({name, el, url}) {
        // defaults
        this.name = name;
        this.url = '/soundparticipant';
        this.active = false;
        this.playing = false;
        console.log(`There is a new Note in the world. ${name}`)
    }

    playNote() {
        if (this.active && !this.playing) {
            let _this = this;
            this.active = false;
            this.playing = true;
            console.log(`Ready to proceed ${this.active}`)
            return $.post(this.url, {"note": this.name}, function(data) {
                console.log(data)
                _this.playing = false;
            })
        } else {
            return console.log('Already playing note')
        }
        
    }
}

const notes = {
    e4: new Note({name: 'e4'}),
    c4: new Note({name: 'c4'}),
    b4: new Note({name: 'b4'}),
    d4: new Note({name: 'd4'})
} 

// Utility debouncer
function debounce(func, wait, immediate) {
  var timeout;

  return function executedFunction() {
    var context = this;
    var args = arguments;
        
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    var callNow = immediate && !timeout;
    
    clearTimeout(timeout);

    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(context, args);
  };
};

function cleanOrientation(event) {
    var x = event.beta ? event.beta : event.y * 90;
    var y = event.gamma ? event.gamma : event.x * 90;
    return [x,y];
}

function handleOrientationEvent(event) {
    let coordinates = cleanOrientation(event);
    let x = Math.round(coordinates[0]);
    let y = Math.round(coordinates[1]);
    // window.console && console.info('Raw position: x, y: ', x, y);

    if (x < tilt.down) {
        debounce(selectElement($('.bottom')), 600, true)
    } else if (x > tilt.up) {
        debounce(selectElement($('.top')), 600, true)
    } else if (y > tilt.right) {
        debounce(selectElement($('.right')), 600, true)
    } else if (y < tilt.left) {
        debounce(selectElement($('.left')), 600, true)
    }

}

function logDirection(direction) {
    direction = true;

}

function selectElement(domEl) {
    let noteSlug = domEl.data('note');
    let note = notes[noteSlug];
    note.active = true;
    note.playNote();
    console.log(note)
    domEl.addClass('big')
    setTimeout(function() {
        // body
        domEl.removeClass('big')
    }, 500)
}
