#!/bin/bash

echo "==================================================="
echo "  GoObras MCP - Instalador Automático (Mac/Linux)"
echo "==================================================="

# Check for Node.js
if ! command -v node &> /dev/null
then
    echo "[Aviso] Node.js não encontrado no sistema."
    if command -v brew &> /dev/null
    then
        echo "Iniciando instalação do Node.js via Homebrew..."
        brew install node
    else
        echo "[Erro] Homebrew não encontrado. Não foi possível instalar o Node.js automaticamente."
        echo "Por favor, instale o Node.js manualmente em https://nodejs.org/ e tente novamente."
        exit 1
    fi
else
    echo "Node.js detectado."
fi

echo ""
echo "Instalando dependências do projeto..."
cd mcp-server
npm install

echo ""
echo "Compilando servidor..."
npm run build

echo ""
echo "Iniciando assistente de configuração..."
node dist/cli.js
