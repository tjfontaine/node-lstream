# lstream

This is a very thin Transform for streams2.

LICENSE: **MIT**

## Usage

### Reading a file

```javascript
fs.createReadStream("linestream.js").pipe(new LineStream()).resume().on("line", function(line) {
    console.log("line:", line);
});
```

### Echoing stdin

```javascript
process.stdin.pipe(new LineStream()).on("line", function(line) {
    console.log("->", line);
});
```

###

## Events

### `line`
Emitted when a line is buffered. Callback is passed a string.

```javascript
lineStream.on("line", function(line) {
    console.log("got line", line);
});
```

### `data`
Equivalent to `.on("line", function(line) {...})`.
