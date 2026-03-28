// Load modules

var Lab = require('lab');
var Stream = require('stream');
var Util = require('util');
var LineStream = require('../linestream');


// Declare internals

var internals = {};


// Test shortcuts

var expect = Lab.expect;
var before = Lab.before;
var after = Lab.after;
var describe = Lab.experiment;
var it = Lab.test;


describe('LineStream', function () {

    it('splits newlines into separate chunks', function (done) {

        var Readable = function () {
            Stream.Readable.call(this);
        };
        Util.inherits(Readable, Stream.Readable);

        Readable.prototype._read = function () {
            this.push('hello\nworld');
            this.push(null);
        };

        var lineStream = new LineStream();
        lineStream.once('readable', function () {
            expect(lineStream.read().toString()).to.equal('hello');
            done();
        });

        new Readable().pipe(lineStream);
    });

    it('splits newlines across multiple chunks into logically separate chunks', function (done) {

        var Readable = function () {
            Stream.Readable.call(this);
        };
        Util.inherits(Readable, Stream.Readable);

        Readable.prototype._read = function () {
            this.push('hello');
            this.push('\n');
            this.push('world');
            this.push(null);
        };

        var lineStream = new LineStream();
        lineStream.once('readable', function () {
            expect(lineStream.read().toString()).to.equal('hello');
            done();
        });

        new Readable().pipe(lineStream);
    });

    it('empty chunks are not written', function (done) {

        var Readable = function () {
            Stream.Readable.call(this);
        };
        Util.inherits(Readable, Stream.Readable);

        Readable.prototype._read = function () {
            this.push('');
            this.push(null);
        };

        var lineStream = new LineStream();
        lineStream.once('readable', function () {
            expect(lineStream.read().toString()).to.not.equal('');
        });

        lineStream.once('end', function () {
            done();
        });

        new Readable().pipe(lineStream);
    });


    it('splits a single newline into empty string', function (done) {

        var Readable = function () {
            Stream.Readable.call(this);
        };
        Util.inherits(Readable, Stream.Readable);

        Readable.prototype._read = function () {
            this.push('\n');
            this.push(null);
        };

        var lineStream = new LineStream();
        lineStream.on('readable', function () {
            expect(lineStream.read().toString()).to.equal('');
        });

        lineStream.once('end', function () {
            done();
        });

        new Readable().pipe(lineStream);
    });
});