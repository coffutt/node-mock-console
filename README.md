# mock-console

Node module for mocking the process.stdout variable to test program console output.

## Getting Started
Install the module with: `npm install mock-console`

```javascript
var mockConsole = require('mock-console')();

process.stdout.write('This is some text');
process.stdout.write('and some more');
process.stdout.write('and another line');

assert.equals(mockConsole.getConsoleOuput(), 'This is some text\nand some more\nand another line');

process.stdout.moveCursor(0, -1);
process.stdout.clearScreenDown();

assert.equals(mockConsole.getConsoleOutput(), 'This is some text\nand some more');

mockConsole.resetStdout();

// Back to regular logging!!!

```

Currently supported:

* console.log
* process.stdout.write
* process.stdout.moveCursor
* process.stdout.clearScreenDown


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## License
Copyright (c) 2015 Craig Offutt. Licensed under the MIT license.
