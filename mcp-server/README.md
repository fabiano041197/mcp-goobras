# MCP Server - Integração GoObras (ERP)

Este é um servidor MCP (Model Context Protocol) para integração total com o ERP de Construção Civil (GoObras). Ele expõe ferramentas (tools) para leitura e escrita em módulos como Clientes, Fornecedores, Materiais, Templates, Projetos e Notas Fiscais, integrando-se diretamente à API FastAPI do sistema.

## Requisitos

- Node.js versão 18 ou superior.
- API Backend (FastAPI) em execução (localmente ou em produção).

## Instalação (Windows e macOS)

A maneira mais recomendada de instalar e utilizar este servidor MCP de forma global e multiplataforma é utilizando o NPM.

1. Clone ou baixe este repositório.
2. Na pasta `mcp-server`, instale as dependências e gere a build:

```bash
npm install
npm run build
```

3. Instale o pacote globalmente na sua máquina:

```bash
npm install -g .
```

Isso criará o comando global `mcp-goobras` no seu sistema, o qual pode ser chamado de qualquer lugar.

## Configuração em Clientes MCP (Claude Desktop, Cursor, etc)

Por questões de segurança, este servidor MCP **não aceita senhas ou tokens via argumentos de linha de comando** (para evitar exposição em processos do sistema). Toda a configuração é feita através de **variáveis de ambiente**.

### Variáveis Obrigatórias
- `ERP_TOKEN`: O token Bearer de longa duração gerado no painel do ERP.

### Variáveis Opcionais
- `ERP_API_URL`: A URL base da sua API. (Padrão: `http://localhost:8000/v1`)

### Exemplo de Configuração no Claude Desktop (`claude_desktop_config.json`)

```json
{
  "mcpServers": {
    "mcp-goobras": {
      "command": "mcp-goobras",
      "env": {
        "ERP_TOKEN": "SEU_TOKEN_AQUI",
        "ERP_API_URL": "http://localhost:8000/v1"
      }
    }
  }
}
```

### Exemplo de Configuração no Cursor IDE

Nas configurações do Cursor (Settings > Features > MCP), adicione um novo servidor do tipo `command`:
- **Name**: `mcp-goobras`
- **Command**: `mcp-goobras`
- Em seguida, adicione as variáveis de ambiente necessárias (ex: `ERP_TOKEN`) na configuração do MCP dentro da própria interface do Cursor.

---
Após configurar, você poderá pedir às IAs para ler relatórios, criar cronogramas em projetos, importar notas fiscais de fornecedores, entre outras automações disponíveis no sistema.
