ECHO OFF
echo.
echo.
echo Tool that sets up a few initial tests.
echo.
echo I know this script is specific to Windows. But I have a good reason!
echo If you are on linux, you are either familiar with testing.
echo Or you are knowledgable enough to build your own "sh" test environment setup script.
echo.
echo Plus, I am lazy. In a good way. I don't yet need this feature on linux. :)
echo.
echo.

cat readme.md

echo.
echo.

SET EDITOR=%PROGRAMFILES%\Notepad++\notepad++.exe

if exist "%cd%\test\" goto TESTSEXIST

mkdir "%cd%\test"
if ERRORLEVEL 0 goto MAKETESTS

:TESTSEXIST

echo.
echo .\test\ directory already exists! Feel free to edit test\test.js!
echo Note:  If test directory is removed or renamed, running this will re-add it.
echo.

goto FINISHED

:MAKETESTS

mkdir test
echo const assert = require("assert");>> test\tests.js
echo const chai = require("chai");>> test\tests.js
echo const expect = chai.expect;>> test\tests.js
echo.>> test\tests.js
echo describe("smoke test - assert", function() {>> test\tests.js
echo   it("checks equality assert", function() {>> test\tests.js
echo     assert.equal(true, true);>> test\tests.js
echo   });>> test\tests.js
echo.>> test\tests.js
echo   it("checks equality - expect", function() {>> test\tests.js
echo     expect(true).to.be.true;>> test\tests.js
echo   });>> test\tests.js
echo });>> test\tests.js
echo.>> test\tests.js

cmd /C "start /max https://scotch.io/tutorials/how-to-test-nodejs-apps-using-mocha-chai-and-sinonjs"
cmd /C ""%EDITOR%" "%cd%\test\tests.js""
if ERRORLEVEL 1 goto FINISHED

:FINISHED

cmd /C npm -v
cmd /C npm install --save-dev mocha
cmd /C npm install --save-dev chai

cmd /C npm install sanitize-html
cmd /C npm install wavy

cmd /C npm update

echo.
echo Package installs and updates are complete!
echo.

PAUSE
