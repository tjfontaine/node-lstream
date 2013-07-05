var stream = require('stream');
var util = require('util');

if (!stream.Transform)
  stream = require('readable-stream');

var LineStream = module.exports = function LineStream(opts) {
  if (!(this instanceof LineStream)) return new LineStream(opts);
  opts = opts || {};
  opts.objectMode = true;
  stream.Transform.call(this, opts);
  this._buff = '';
};
util.inherits(LineStream, stream.Transform);


LineStream.prototype._transform = function(chunk, encoding, done) {
  var data = this._buff + chunk.toString('utf8');
  var lines = data.split(/\r?\n|\r(?!\n)/);

  if (!data.match(/(\r?\n|\r(?!\n))$/))
    this._buff = lines.pop();
  else
    this._buff = '';

  var self = this;

  lines.forEach(function (line) {
    self.push(line);
  });

  done();
};


LineStream.prototype._flush = function(done) {
  if (this._buff) this.push(this._buff);
  done();
};
