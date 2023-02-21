!macro customInstall

    MessageBox MessageBox MB_OK "${BUILD_RESOURCES_DIR}" 
    
    ${ifNot} ${isUpdated}
        CopyFiles "${BUILD_RESOURCES_DIR}\*" "$APPDATA\${APP_PACKAGE_NAME}" 

        IfFileExists "$APPDATA\tesseract" next1
            CopyFiles /SILENT "${BUILD_RESOURCES_DIR}\tesseract\*" "$APPDATA\${APP_PACKAGE_NAME}\tesseract" 
        next1:

        IfFileExists "$APPDATA\database" next
                MessageBox MB_YESNO "is it true?" IDYES true IDNO false
                true:
                    DetailPrint "it's true!"
                    CopyFiles /SILENT "${BUILD_RESOURCES_DIR}\database\*" "$APPDATA\${APP_PACKAGE_NAME}\database" 
                    Goto next
                false:
                    DetailPrint "it's false"
        next:
    ${endIf}
!macroend