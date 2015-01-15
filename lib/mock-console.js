/*
 * mock-console
 * https://github.com/craig-o/mock-console
 *
 * Copyright (c) 2015 Craig Offutt
 * Licensed under the MIT license.
 */

'use strict';

function twoDArr (x, y) {
    var arr = new Array(x);

    for (var i = 0; i < y; i++) {
        arr[i] = new Array(x);

        for (var j = 0; j < x; j++) {
            arr[i][j] = '';
        }
    }

    return arr;
}

module.exports = function mockStdout (cacheRegex, windowSize) {
    var write = process.stdout.write,
        clearScreen = process.stdout.clearScreenDown,
        moveCursor = process.stdout.moveCursor;

    var cursor,
        windowSize = windowSize || { width: 200, height: 200 },
        consoleOutput;

    function reset () {
        process.stdout.write = write;
        process.stdout.clearScreenDown = clearScreen;
        process.stdout.moveCursor = moveCursor;

        cursor = { x: 0, y: 0 };
        consoleOutput = twoDArr(windowSize.width, windowSize.height);
        consoleOutput.setChar = function (ch, x, y) {
            consoleOutput[y || cursor.y][x || cursor.x] = ch;
        };
        consoleOutput.getChar = function (x, y) {
            return consoleOutput[x || cursor.y][y || cursor.x];
        }
    }

    reset();

    process.stdout.write = function (str) {
        var chars = str.split('');

        if (cacheRegex.test(str)) {
            for (var i = 0; i < chars.length; i++) {
                if (chars[i] === '\n') {
                    cursor.y++;
                    cursor.x = 0;
                } else {
                    consoleOutput.setChar(chars[i]);
                    cursor.x++;
                }

            }
        } else {
            arguments[1] = 'utf8';
            write.apply(this, arguments);
        }
    };

    process.stdout.clearScreenDown = function () {
        for (var i = 0; cursor.y + 1; i < windowSize.height) {
            for (var j = 0; j < windowSize.width; j++) {
                consoleOutput.setChar('', j, y);
            }
        }
    };

    process.stdout.moveCursor = function (dx, dy) {
        var targetX = cursor.x + dx,
            targetY = cursor.y + dy,
            diff;

        if (targetY < 0) {
            cursor.y = 0;
        } else if (targetY > windowSize.y - 1) {
            cursor.y = windowSize.y - 1;
        } else {
            cursor.y = targetY;
        }

        if (targetX < 0) {
            cursor.x = 0;
        } else if (targetX > targetLineLength) {
            cursor.x = windowSize.x - 1;
        } else {
            cursor.x = targetX;
        }
    };

    // Shift all lines below me up one and append blank line at end
    process.stdout.clearLine = function () {
        for (var i = cursor.y; i < windowSize.height - 1; i++) {
            consoleOutput[i] = consoleOutput[i+1]
        }

        consoleOutput[windowSize.height - 1] = new Array(windowSize.width);
        for (var i = 0; i < windowSize.width; i++) {
            consoleOutput[windowSize.height - 1] = '';
        }        
    };

    process.stdout.windowSize = function () {
        return [ windowSize.width, windowSize.height ];
    };

    return {
        getConsoleOutput: function () {
            var str = '',
                line;

            for (var i = 0; i < consoleOutput.length; i++) {
                line = consoleOutput[i].join('');
                if (line !== '') {
                    str += consoleOutput[i].join('') + '\n';
                }
            }

            return str;
        },

        setWindowSize: function (x, y) {
            windowSize = { width: x, height: y };
        },

        resetStdout: function () {
            reset();
        },

        _cursor: function () {
            return cursor;
        },

        _consoleCache: function () {
            return consoleOutput;
        }
    };
};
