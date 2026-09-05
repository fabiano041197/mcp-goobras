# SDD 01: Introdução e Arquitetura do Adaptador MCP (GoObras ERP)

## 1. Visão Geral

O **MCP GoObras** atua como uma ponte (adaptador) entre modelos de linguagem (LLMs) compatíveis com o padrão Model Context Protocol e o backend central do GoObras (desenvolvido em Python/FastAPI). O objetivo deste sistema não é aplicar regras de negócio complexas, mas expor de maneira padronizada, documentada e extremamente tipada as interfaces de **Leitura e Escrita (CRUD)** do ERP.

## 2. Princípios de Design (Looping Engineering)

O desenvolvimento deste adaptador segue os seguintes preceitos:
1. **Espelhamento Rigoroso**: As ferramentas (Tools) exportadas pelo MCP devem espelhar fielmente os *schemas* Pydantic (Python) do servidor remoto FastAPI, minimizando quebras de contrato (Validation Loop).
2. **Runtime Validation**: O LLM não deve enviar payloads defeituosos para o servidor remoto; eles devem falhar rápido (*fail-fast*) localmente. Utilizamos a biblioteca `Zod` no TypeScript para gerar tanto o `inputSchema` para o LLM quanto validar a requisição antes de atingir a rede.
3. **Isolamento de Infraestrutura**: Configurações de API (`axios`, interceptors, injeção de tokens) estão completamente desacopladas dos domínios.

## 3. Arquitetura de Módulos (Domain-Driven)

Os domínios foram segmentados fisicamente conforme a arquitetura real do produto ERP:

```
mcp-server/
 ├── src/
 │    ├── config/           # Tratamento de Variáveis de Ambiente (env.ts)
 │    ├── infrastructure/   # Comunicação externa (http/erp-client.ts)
 │    ├── server/           # Inicialização Stdio MCP e Tool Registry (tool-registry.ts)
 │    └── modules/          # Divisões de Negócio Exatas do ERP
 │         ├── clients/     # Cadastro de Clientes
 │         ├── suppliers/   # Cadastro de Fornecedores
 │         ├── projects/    # Projetos, Etapas de Projeto, Tarefas e Vínculos
 │         ├── materials/   # Catálogo Global de Materiais
 │         ├── templates/   # Templates de cronogramas e orçamentos
 │         ├── globals/     # Cadastros Globais Base (Etapas, Tarefas, Especificações)
 │         └── invoices/    # Notas Fiscais e vínculos com Tarefas
 └── index.ts               # Arquivo raiz sem lógica acoplada, apenas importa dependências
```

## 4. Padrão `ToolRegistry`

Uma das principais inovações deste adaptador é o `ToolRegistry`. Anteriormente, as ferramentas e execuções ficavam presas em um `switch-case` monolítico.

- O registry armazena um mapa estático das ferramentas.
- Cada módulo invoca `registry.register("nome_da_tool", "Descrição", zodSchema, async (args) => { ... })`.
- O adaptador intercepta a rota `ListToolsRequestSchema` mapeando os esquemas Zod para JSON Schema via `zod-to-json-schema`.
- A rota `CallToolRequestSchema` executa a função, submetendo o `args` gerado pela IA ao método `parse()` do Zod antes de enviar ao ERP.

## 5. Fluxo de Autenticação
Toda a integração com o GoObras exige o *Bearer Token* do usuário (engenheiro, construtor, etc.).
O `erp-client.ts` injeta o token definido na variável de ambiente `ERP_TOKEN` no cabeçalho `Authorization` de todas as solicitações `axios`, abstraindo a autenticação das camadas de domínio e impossibilitando a manipulação indevida pelo LLM.
