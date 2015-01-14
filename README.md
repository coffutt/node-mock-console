# mock-console

Node module for mocking the process.stdout variable to test program console output.

## Getting Started
Install the module with: `npm install mock-console`

```javascript
// Takes a regex as an argument. This is used to deliniate between lines that are test framework based.
// Future builds will have mocha keywords built in, but for now you'll have to handle this yourself.
var mockConsole = require('mock-console')(/^\*/);

// Width, Height
mockConsole.setWindowSize(100, 200);

process.stdout.write('* This is some text');
process.stdout.write('* and some more');
process.stdout.write('* and another line');
process.stdout.write('$THIS LINE DOESNT MATCH'); // Won't be cached

assert.equals(mockConsole.getConsoleOuput(), '* This is some text\n* and some more\n* and another line');
process.stdout.clearLine();
process.stdout.moveCursor(0, -1);
process.stdout.clearScreenDown();

assert.equals(mockConsole.getConsoleOutput(), '* This is some text\n* and some more');

mockConsole.resetStdout();

// Back to regular logging!!!

```

Currently supported:

* console.log
* process.stdout.write
* process.stdout.moveCursor
* process.stdout.clearScreenDown


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using make or make lint and make test

## License
Copyright (c) 2015 Craig Offutt. Licensed under the MIT license.

## TODO

Further evaluate the accuracy of cursor positions in the moveCursor calls and after clear lines. This is still a prototype and any integration should be carefully tested.
