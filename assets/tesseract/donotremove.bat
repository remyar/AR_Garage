echo off
cd tesseract
wget -O tesseract-ocr-w64-setup-v5.2.0.20220712.exe https://digi.bib.uni-mannheim.de/tesseract/tesseract-ocr-w64-setup-v5.2.0.20220712.exe
7z x tesseract-ocr-w64-setup-v5.2.0.20220712.exe
del tesseract-uninstall.exe
del tesseract-ocr-w64-setup-v5.2.0.20220712.exe
cd..
cd database
wget -O tecdoc_database.zip https://www.goodrace.fr/download/tecdoc_database.zip
7z x tecdoc_database.zip
del tecdoc_database.zip
pause