@echo off
setlocal

echo ===================================================
echo   GoObras MCP - Instalador Automatico (Windows)
echo ===================================================

:: Checar se o node esta instalado
node -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo [Aviso] Node.js nao encontrado no sistema.
    echo Iniciando instalacao do Node.js via winget...
    winget install OpenJS.NodeJS -e --silent
    IF %ERRORLEVEL% NEQ 0 (
        echo [Erro] Falha ao instalar Node.js automaticamente.
        echo Por favor, instale o Node.js manualmente em https://nodejs.org/ e tente novamente.
        pause
        exit /b 1
    )
    echo Node.js instalado com sucesso!
    :: Tenta atualizar o path para a sessao atual
    set PATH=%PATH%;C:\Program Files\nodejs\
) ELSE (
    echo Node.js detectado.
)

echo.
echo Instalando dependencias do projeto...
cd mcp-server
call npm install

echo.
echo Compilando servidor...
call npm run build

echo.
echo Iniciando assistente de configuracao...
call node dist/cli.js

pause
