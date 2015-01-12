'use strict';

var expect = require('chai').expect;

describe('mock-console tests', function () {

    var mockConsole, goodLines;

    beforeEach(function () {
        mockConsole = require('../')(/^\*/);
        goodLines = [
            '* Write Line 1',
            '* Write Line 2',
            '* Write Line 3'
        ];
    });

    it('should provide hooks for the current console out put and to reset process.stdout', function () {
        expect(mockConsole.getConsoleOutput).to.be.a.Function;
        expect(mockConsole.resetStdout).to.be.a.Function;
    });

    it('should add lines matching the provided regex to the cached console output', function () {
        goodLines.forEach(process.stdout.write);
        process.stdout.write('$ Bad line');

        var actual = mockConsole.getConsoleOutput();

        expect(actual).to.equal(goodLines.join('\n'));
    });

    describe('moving the cursor pos', function () {

        var cases = [
            {
                msg: 'to the beggining of a line if currX + dx < 0',
                dx: -15,
                dy: 0,
                expected: { x: 0, y: 2 }
            },
            {
                msg: 'to the last character of a line if currX + dx > curr line length',
                dx: 10,
                dy: 0,
                expected: { x: 13, y: 2 }
            },
            {
                msg: 'to the first line if currY + dy < 0',
                dx: 10,
                dy: 0,
                expected: { x: 13, y: 2 }
            },
            {
                msg: 'to the last line if currY + dy > numLines',
                dx: 0,
                dy: 5,
                expected: { x: 13, y: 2 }
            },
            {
                msg: 'successfully to dx dy',
                dx: -5,
                dy: -1,
                expected: { x: 8, y: 1 }
            }
        ];

        cases.forEach(function (testCase) {
            it('should move the cursor ' + testCase.msg, function () {
                goodLines.forEach(process.stdout.write);

                process.stdout.moveCursor(testCase.dx, testCase.dy);
                expect(mockConsole._cursorPos()).to.deep.equal(testCase.expected);
            });
        });
    });

    it('should clear the screen downwards', function () {
        goodLines.forEach(process.stdout.write);

        process.stdout.moveCursor(10, -2);
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
