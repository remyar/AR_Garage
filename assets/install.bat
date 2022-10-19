WHERE /q "C:\Program Files\Tesseract-OCR\:*"
if %errorlevel% == 1 (
    setx /M PATH "%PATH%;C:\Program Files\Tesseract-OCR"
) else (
    echo "already set path"
)
pause