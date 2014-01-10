// thanks to Dave Pacheco
var mod_assert = require('assert');
var mod_lstream = require('./linestream');
 
var lines = [
    'I have no idea to this day what those two Italian ',
    'ladies were singing about. Truth is, I don\'t want ',
    'to know. Some things are best left unsaid.',
    '',
    'I\'d like to think they were singing about something ',
    'so beautiful, it can\'t be expressed in words, and makes ',
    'your heart ache because of it. I tell you, those voices ',
    'soared higher and farther than anybody in a gray place',
    'dares to dream. It was like some beautiful bird flapped ',
    'into our drab little cage and made those walls dissolve ',
    'away, and for the briefest of moments, every last man ',
    'in Shawshank felt free.'
];
var text = lines.map(function (line) { return (line + '\n'); }).join('');
var i;
 
for (i = 0; i < text.length; i++) {
  (function (idx) {
    var lstream = new mod_lstream();
    var events = [];
    lstream.on('line', function (line) { events.push(line); });
    lstream.on('end', function () {
      console.log('checking split point', idx);
      if (lines.length != events.length) {
        console.error('MISMATCH');
        console.error(lines);
        console.error('---------');
        console.error(events);
        process.exit(1);
      }
      mod_assert.deepEqual(lines, events);
    });
 
    lstream.write(text.slice(0, i));
    lstream.write(text.slice(i));
    lstream.end();
    lstream.resume();
  })(i);
}
