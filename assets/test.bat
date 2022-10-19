echo off
set arg1=%1
REM start /d "%arg1%" tesseract-ocr-w64-setup-v5.2.0.20220712.exe
tesseract-ocr-w64-setup-v5.2.0.20220712.exe /S /D=C:\ter

REM start "ee" "./tesseract-ocr-w64-setup-v5.2.0.20220712.exe /s /v/qn INSTALLDIR=D:\Destination"

pause