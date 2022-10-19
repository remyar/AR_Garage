!macro customInstall
    File /oname=$PLUGINSDIR\tesseract.exe "${BUILD_RESOURCES_DIR}\tesseract-ocr-w64-setup-v5.2.0.20220712.exe"
    File /oname=$PLUGINSDIR\install.bat "${BUILD_RESOURCES_DIR}\install.bat"
    ExecWait '"$PLUGINSDIR\tesseract.exe" /S /D=$INSTDIR\..\ExtApp'
!macroend