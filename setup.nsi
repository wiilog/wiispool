;--------------------------------
; Includes

  !include "MUI2.nsh"
  !include "logiclib.nsh"


;--------------------------------
; Custom defines
  !define NAME "Wiispool"
  !define APPFILE "${NAME}_v${VERSION}_Setup.exe"
  !define VERSION "3.1.0"
  !define SLUG "${NAME} v${VERSION}"


;--------------------------------
; General

  Name "${NAME}"
  OutFile "${APPFILE}"
  InstallDir "$PROGRAMFILES\${NAME}"
  InstallDirRegKey HKCU "Software\${NAME}" ""
  RequestExecutionLevel admin


;--------------------------------
; UI

  !define MUI_ICON "wiilog.ico"
  !define MUI_HEADERIMAGE
  !define MUI_WELCOMEFINISHPAGE_BITMAP ".\welcome.bmp"
  !define MUI_HEADERIMAGE_BITMAP ".\head.bmp"
  !define MUI_ABORTWARNING
  !define MUI_WELCOMEPAGE_TITLE "${SLUG} Setup"

;--------------------------------
; Pages

  ; Installer pages
  !insertmacro MUI_PAGE_WELCOME
  !insertmacro MUI_PAGE_DIRECTORY
  !insertmacro MUI_PAGE_INSTFILES
  !insertmacro MUI_PAGE_FINISH

  ; Set UI language
  !insertmacro MUI_LANGUAGE "French"


;--------------------------------
; Section - Install App

  Section "-hidden app"

    ; kill the app if it's running
    SetErrorLevel 0
    nsExec::ExecToLog 'taskkill /F /IM wiispool.exe'
    Pop $0
    StrCmp $0 0 +3

    SectionIn RO
    SetOutPath "$INSTDIR"
    File "dist\wiispool.exe"
    WriteRegStr HKCU "Software\${NAME}" "" $INSTDIR
    WriteUninstaller "$INSTDIR\Uninstall.exe"

  SectionEnd

;--------------------------------
; Section - Shortcut

  Section "Desktop Shortcut" DeskShort

    ; set the the use to all
    SetShellVarContext all

    ;create shortcuts
    CreateShortCut "$INSTDIR\${NAME}.lnk" "$INSTDIR\wiispool.exe"
    CreateShortCut "$INSTDIR\${NAME}_background.lnk" "$INSTDIR\wiispool.exe" "--background"

    ;add to start menu
    CreateShortCut "$STARTMENU\${NAME}_background.lnk" "$INSTDIR\${NAME}_background.lnk"
    CreateShortCut "$SMPROGRAMS\${NAME}_background.lnk" "$INSTDIR\${NAME}_background.lnk"
    CreateShortCut "$DESKTOP\${NAME}_background.lnk" "$INSTDIR\${NAME}_background.lnk"

    CreateShortCut "$STARTMENU\${NAME}.lnk" "$INSTDIR\${NAME}.lnk"
    CreateShortCut "$SMPROGRAMS\${NAME}.lnk" "$INSTDIR\${NAME}.lnk"
    CreateShortCut "$DESKTOP\${NAME}.lnk" "$INSTDIR\${NAME}.lnk"

    ;add uninstaller to start menu
    CreateShortCut "$SMPROGRAMS\Uninstall_${NAME}.lnk" "$INSTDIR\Uninstall.exe"
    CreateShortCut "$STARTMENU\Uninstall_${NAME}.lnk" "$INSTDIR\Uninstall.exe"

  SectionEnd

;--------------------------------
; Uninstaller

  UninstPage uninstConfirm
  UninstPage instfiles

  Section "Uninstall"

    ; kill the app if it's running
    SetErrorLevel 0
    nsExec::ExecToLog 'taskkill /F /IM wiispool.exe'
    Pop $0
    StrCmp $0 0 +3

    SetShellVarContext all
    Delete "$INSTDIR\*"
    Delete "$INSTDIR\Uninstall.exe"
    RMDir "$INSTDIR"
    ; Delete shortcuts
    Delete "$STARTMENU\${NAME}_background.lnk"
    Delete "$SMSTARTUP\${NAME}_background.lnk"
    Delete "$SMPROGRAMS\${NAME}_background.lnk"
    Delete "$DESKTOP\${NAME}_background.lnk"
    Delete "$STARTMENU\${NAME}.lnk"
    Delete "$SMSTARTUP\${NAME}.lnk"
    Delete "$SMPROGRAMS\${NAME}.lnk"
    Delete "$DESKTOP\${NAME}.lnk"
    Delete "$SMPROGRAMS\Uninstall_${NAME}.lnk"
    Delete "$SMSTARTUP\Uninstall_${NAME}.lnk"
    Delete "$STARTMENU\Uninstall_${NAME}.lnk"

    DeleteRegKey HKCU "Software\${NAME}"
  SectionEnd



