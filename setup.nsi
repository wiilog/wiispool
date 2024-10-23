;--------------------------------
; Includes

  !include "MUI2.nsh"
  !include "logiclib.nsh"


;--------------------------------
; Custom defines
  !define NAME "Wiispool"
  !define APPFILE "${NAME}_v${VERSION}_Setup.exe"
  !define VERSION "1.0.0"
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
  ;!define MUI_WELCOMEFINISHPAGE_BITMAP "assets\welcome.bmp"
  ;!define MUI_HEADERIMAGE_BITMAP "assets\head.bmp"
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
    SectionIn RO
    SetOutPath "$INSTDIR"
    File /r "out\wiispool-win32-x64\*"
    WriteRegStr HKCU "Software\${NAME}" "" $INSTDIR
    WriteUninstaller "$INSTDIR\Uninstall.exe"
  SectionEnd


;--------------------------------
; Section - Shortcut

  Section "Desktop Shortcut" DeskShort
    ; Create shortcuts in the start menu
    CreateShortCut "$SMPROGRAMS\${NAME}.lnk" "$INSTDIR\wiispool.exe"
    ; Create shortcuts in desktop folder
    CreateShortCut "$DESKTOP\${NAME}.lnk" "$INSTDIR\wiispool.exe"

  SectionEnd


;--------------------------------
; Uninstaller

  UninstPage uninstConfirm
  UninstPage instfiles

  Section "Uninstall"
    Delete "$INSTDIR\*"
    Delete "$INSTDIR\Uninstall.exe"
    RMDir "$INSTDIR"
    Delete "$SMPROGRAMS\${NAME}.lnk"
    Delete "$DESKTOP\${NAME}.lnk"
    DeleteRegKey HKCU "Software\${NAME}"
  SectionEnd
