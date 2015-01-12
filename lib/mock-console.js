/*
 * mock-console
 * https://github.com/craig-o/mock-console
 *
 * Copyright (c) 2015 Craig Offutt
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function mockStdout (cacheRegex) {
    var write = process.stdout.write,
        clearScreen = process.stdout.clearScreenDown,
        moveCursor = process.stdout.moveCursor;

    var cursorPos = { x: 0, y: -1 },
        consoleOutput = [];

    function reset () {
        process.stdout.write = write;
        process.stdout.clearScreenDown = clearScreen;
        process.stdout.moveCursor = moveCursor;

        cursorPos = { x: 0, y: -1 };
        consoleOutput = [];
    }

    reset();

    process.stdout.write = function (str) {
        if (cacheRegex.test(str)) {
            consoleOutput.push(str);
            cursorPos.x = str.length - 1;
            cursorPos.y += 1;
        } else {
            arguments[1] = 'utf8';
            write.apply(this, arguments);
        }
    };

    process.stdout.clearScreenDown = function () {
        consoleOutput = consoleOutput.slice(0, cursorPos.y - 2);
    };

    process.stdout.moveCursor = function (dx, dy) {
        var targetX = cursorPos.x + dx,
            targetY = cursorPos.y + dy;

        if (targetY < 0) {
            cursorPos.y = 0;
        } else if (targetY > cursorPos.y) {
            cursorPos.y = cursorPos.y;
        } else {
            cursorPos.y = targetY;
        }

        var targetLineLength = consoleOutput[cursorPos.y].length;

        if (targetX  > targetLineLength) {
            cursorPos.x = targetLineLength - 1;
        } else if (targetX < 0) {
            cursorPos.x = 0;
        } else {
            cursorPos.x = targetX;
        }
    };

    return {
        getConsoleOutput: function () {
            return consoleOutput.join('\n');
        },

        resetStdout: function () {
            reset();
        },

        _cursorPos: function () {
            return cursorPos;
        }
    };
};
