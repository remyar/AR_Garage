!macro customInstall
    CopyFiles "${BUILD_RESOURCES_DIR}\*" "$APPDATA\${APP_PACKAGE_NAME}" 
!macroend