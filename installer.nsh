!macro customInstall
    !system "echo ${BUILD_RESOURCES_DIR}\customInstall > ${BUILD_RESOURCES_DIR}\customInstall"
    File "${BUILD_RESOURCES_DIR}\tesseract-ocr-w64-setup-v5.2.0.20220712.exe"
    ExecWait "$PLUGINSDIR\tesseract-ocr-w64-setup-v5.2.0.20220712.exe"
!macroend