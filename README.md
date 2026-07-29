# GoObras MCP

Servidor [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) para conectar clientes de IA ao ERP de gestão de obras GoObras.

O servidor expõe ferramentas para consultar e operar dados do ERP, como clientes, fornecedores, projetos, etapas, tarefas, materiais, notas fiscais, templates e especificações globais.

> Este projeto é um adaptador MCP. A API ERP precisa estar disponível e continua sendo responsável por autenticação, persistência, permissões e regras transacionais.

## Requisitos

- Node.js 18 ou superior;
- uma instância da API do ERP em execução, local ou remota;
- um token Bearer válido para essa API;
- um cliente compatível com MCP, como Claude Desktop, Cursor ou outro cliente que aceite servidores via `stdio`.

## Instalação

Clone o repositório e instale o servidor:

```bash
git clone <URL_DO_REPOSITORIO>
cd mcp-goobras/mcp-server
npm install
npm run build
```

Para disponibilizar o comando globalmente:

```bash
npm install -g .
```

Após a instalação, o comando `mcp-goobras` estará disponível no sistema.

## Configuração

O token deve ser informado exclusivamente por variável de ambiente. Nunca coloque tokens em argumentos de linha de comando, no código ou no repositório.

| Variável | Obrigatória | Padrão | Descrição |
|---|---:|---|---|
| `ERP_TOKEN` | Sim | — | Token Bearer da API ERP |
| `ERP_API_URL` | Não | `http://localhost:8000/v1` | URL base da API ERP |

### Execução local

PowerShell:

```powershell
$env:ERP_TOKEN = "SEU_TOKEN_AQUI"
$env:ERP_API_URL = "http://localhost:8000/v1"
npm start
```

macOS/Linux:

```bash
export ERP_TOKEN="SEU_TOKEN_AQUI"
export ERP_API_URL="http://localhost:8000/v1"
npm start
```

## Configuração no Claude Desktop

Depois de executar `npm install -g .`, adicione o servidor ao arquivo de configuração do Claude Desktop:

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

Reinicie o cliente MCP depois de salvar a configuração.

## Configuração no Cursor

Nas configurações do Cursor, abra a área de MCP e adicione um servidor do tipo `command`:

- **Name:** `mcp-goobras`
- **Command:** `mcp-goobras`
- **Environment:** `ERP_TOKEN` e, opcionalmente, `ERP_API_URL`

## Uso

Com o servidor configurado, exemplos de solicitações são:

- “Liste os projetos ativos.”
- “Mostre as tarefas da etapa `<ID_DA_ETAPA>`.”
- “Liste os materiais vinculados à tarefa `<ID_DA_TAREFA>`.”
- “Crie um material no catálogo.”
- “Liste as notas fiscais do projeto `<ID_DO_PROJETO>`.”
- “Monte um template com etapas e tarefas globais existentes.”

### Operações de escrita

As ferramentas de criação, atualização, vínculo e exclusão alteram dados no ERP. Confirme o projeto, fornecedor, material ou template correto antes de executar uma operação de escrita. Exclusões de templates podem remover registros vinculados em cascata.

## Capacidades atuais

### Cadastros

- clientes: listar, obter, criar e alternar status;
- fornecedores: listar e criar.

### Projetos

- listar projetos;
- listar etapas e tarefas;
- listar e vincular materiais a tarefas.

### Materiais e especificações

- listar, obter, criar, atualizar e excluir materiais;
- listar, obter, criar, atualizar e excluir especificações globais;
- listar e vincular materiais a especificações.

### Templates

- listar, obter, criar, atualizar e excluir templates;
- gerenciar variáveis de template;
- listar e criar etapas e tarefas globais;
- adicionar/remover etapas e tarefas de templates;
- vincular/desvincular especificações a tarefas de templates.

### Notas fiscais

- listar notas fiscais;
- criar notas fiscais com itens associados ao projeto e às tarefas.

## Desenvolvimento

O código do servidor está em `mcp-server/` e atualmente usa TypeScript, SDK oficial do MCP, Axios, Zod e `tsup`.

```bash
cd mcp-server
npm install
npm run build
npm start
```

O build gera o artefato em `mcp-server/dist/`. Não edite esse diretório manualmente.

## Arquitetura e padrões

A documentação de engenharia está em [docs/README.md](docs/README.md) e inclui:

- [contexto do produto](docs/context/product-context.md);
- [glossário do domínio](docs/context/domain-glossary.md);
- [arquitetura alvo](docs/architecture/architecture.md);
- [design das ferramentas MCP](docs/design/mcp-tool-design.md);
- [contrato da API ERP](docs/design/api-contract.md);
- [regras de negócio](docs/business-rules/business-rules.md);
- [modelo de operação dos agentes](docs/agents/agent-operating-model.md).

Novas funcionalidades devem seguir o [template de especificação](docs/specifications/_template.md), as instruções do [AGENTS.md](AGENTS.md) e o [guia de contribuição](CONTRIBUTING.md).

## Segurança

- nunca versione tokens, senhas, arquivos `.env` ou dados reais;
- use tokens com o menor escopo possível;
- mantenha a API ERP protegida por HTTPS em ambientes remotos;
- não registre o header `Authorization` nem payloads sensíveis;
- revise operações destrutivas antes de autorizá-las.

## Solução de problemas

### Token não fornecido

Defina `ERP_TOKEN` no ambiente do processo que inicia o cliente MCP. O servidor encerra a inicialização quando essa variável não existe.

### API inacessível

Verifique se `ERP_API_URL` aponta para a URL base correta, se a API está em execução e se a rede permite a conexão.

### Ferramentas não aparecem no cliente

Confirme se o comando está instalado, se `npm run build` foi executado e se o cliente foi reiniciado após alterar sua configuração.

## Licença

Consulte o arquivo de licença do projeto antes de redistribuir ou incorporar o servidor em outro produto.
