'use strict';

var expect = require('chai').expect;

describe('mock-console tests', function () {

    var mockConsole, goodLines;

    beforeEach(function () {
        mockConsole = require('../')(/^\*/, { width: 200, height: 200 });
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

        process.stdout.moveCursor(-5, -2);
        process.stdout.clearLine();

        var expected = [goodLines[0], goodLines[2]].join('');
        expect(mockConsole.getConsoleOutput()).to.equal(expected)
    });

    it('handles simulating window resizing', function () {
        expect(process.stdout.windowSize()).to.deep.equal([200, 200]);
    });

    describe('moving the cursor pos', function () {

        var cases = [
            {
                msg: 'to the beggining of a line if currX + dx < 0',
                dx: -15,
                dy: 0,
                expected: { x: 0, y: 3 }
            },
            {
                msg: 'to the proper position if currX + dx > curr line length',
                dx: 75,
                dy: -1,
                expected: { x: 75, y: 2 }
            },
            {
                msg: 'to the first line if currY + dy < 0',
                dx: 0,
                dy: -5,
                expected: { x: 0, y: 0 }
            },
            {
                msg: 'to the proper line if currY + dy > numLines',
                dx: 0,
                dy: 5,
                expected: { x: 0, y: 8 }
            },
            {
                msg: 'successfully to dx dy',
                dx: -5,
                dy: -1,
                expected: { x: 0, y: 2 }
            }
        ];

        cases.forEach(function (testCase) {
            it('should move the cursor ' + testCase.msg, function () {
                goodLines.forEach(process.stdout.write);

                process.stdout.moveCursor(testCase.dx, testCase.dy);
                expect(mockConsole._cursor()).to.deep.equal(testCase.expected);
            });
        });
    });

    it('should clear the screen downwards', function () {
        goodLines.forEach(process.stdout.write);

        process.stdout.moveCursor(10, -3);
        process.stdout.clearScreenDown();

        var actual = mockConsole.getConsoleOutput();
        expect(actual).to.equal(goodLines[0]);
    });

    it('should reset stdout to its original function', function () {
        mockConsole.resetStdout();

        expect(mockConsole.getConsoleOutput()).to.equal('');
        process.stdout.write('* abcdefg');
        expect(mockConsole.getConsoleOutput()).to.equal('');
    });

});
