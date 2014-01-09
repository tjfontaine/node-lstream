// Copyright 2013 Timothy J Fontaine <tjfontaine@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE

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

  this._buff = lines.pop();

  var self = this;

  lines.forEach(function (line) {
    self._line(line);
  });

  done();
};


LineStream.prototype._flush = function(done) {
  if (this._buff) this._line(this._buff);
  done();
};


LineStream.prototype._line = function(line) {
  this.push(line);
  this.emit('line', line);
};
