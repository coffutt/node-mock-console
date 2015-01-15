'use strict';

var expect = require('chai').expect;

describe('mock-console tests', function () {

    var mockConsole, goodLines;

    beforeEach(function () {
        mockConsole = require('../')(/^\*/);
        goodLines = [
            '* Write Line 1\n',
            '* Write Line 2\n',
            '* Write Line 3\n'
        ];
    });

    it('should add lines matching the provided regex to the cached console output', function () {
        goodLines.forEach(process.stdout.write);
        process.stdout.write('$ Bad line');

        var actual = mockConsole.getConsoleOutput();
        expect(actual).to.equal(goodLines.join(''));
    });

    it('should clear the current line', function () {
        goodLines.forEach(process.stdout.write);

        process.stdout.moveCursor(-5, -1);
        process.stdout.clearLine();

        var expected = [goodLines[0], goodLines[2]].join('\n');
        expect(mockConsole.getConsoleOutput()).to.equal(expected)
    });
    //
    // it('handles simulating window resizing', function () {
    //     expect(process.stdout.windowSize()).to.deep.equal([100, 100]);
    //     mockConsole.setWindowSize(200, 200);
    //     expect(process.stdout.windowSize()).to.deep.equal([200, 200]);
    // });
    //
    // describe('moving the cursor pos', function () {
    //
    //     var cases = [
    //         {
    //             msg: 'to the beggining of a line if currX + dx < 0',
    //             dx: -15,
    //             dy: 0,
    //             expected: { x: 0, y: 3 }
    //         },
    //         {
    //             msg: 'to the proper position if currX + dx > curr line length',
    //             dx: 10,
    //             dy: 0,
    //             expected: { x: 23, y: 3 }
    //         },
    //         {
    //             msg: 'to the first line if currY + dy < 0',
    //             dx: 10,
    //             dy: 0,
    //             expected: { x: 13, y: 2 }
    //         },
    //         {
    //             msg: 'to the last line if currY + dy > numLines',
    //             dx: 0,
    //             dy: 5,
    //             expected: { x: 13, y: 2 }
    //         },
    //         {
    //             msg: 'successfully to dx dy',
    //             dx: -5,
    //             dy: -1,
    //             expected: { x: 8, y: 1 }
    //         }
    //     ];
    //
    //     cases.forEach(function (testCase) {
    //         it('should move the cursor ' + testCase.msg, function () {
    //             goodLines.forEach(process.stdout.write);
    //
    //             process.stdout.moveCursor(testCase.dx, testCase.dy);
    //             expect(mockConsole._cursorPos()).to.deep.equal(testCase.expected);
    //         });
    //     });
    // });
    //
    // it('should clear the screen downwards', function () {
    //     goodLines.forEach(process.stdout.write);
    //
    //     process.stdout.moveCursor(10, -2);
    //     process.stdout.clearScreenDown();
    //
    //     var actual = mockConsole.getConsoleOutput();
    //     expect(actual).to.equal(goodLines[0]);
    // });
    //
    // it('should reset stdout to its original function', function () {
    //     mockConsole.resetStdout();
    //
    //     expect(mockConsole.getConsoleOutput()).to.equal('');
    //     process.stdout.write('* abcdefg');
    //     expect(mockConsole.getConsoleOutput()).to.equal('');
    // });

});
