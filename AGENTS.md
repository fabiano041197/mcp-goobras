# GoObras MCP — instruções para agentes

Este arquivo é a entrada principal para agentes de desenvolvimento. Leia-o antes de alterar código.

## Fonte de verdade

1. [Contexto do produto](docs/context/product-context.md)
2. [Glossário do domínio](docs/context/domain-glossary.md)
3. [Arquitetura](docs/architecture/architecture.md)
4. [Design do MCP](docs/design/mcp-tool-design.md)
5. [Contrato da API](docs/design/api-contract.md)
6. [Regras de negócio](docs/business-rules/business-rules.md)
7. [Guia de contribuição](CONTRIBUTING.md)

## Regras obrigatórias

- Preserve o limite deste repositório: ele é um adaptador MCP para uma API ERP; não replique regras do backend sem necessidade.
- Não adicione credenciais, tokens ou dados reais ao código, logs, testes ou documentação.
- Toda ferramenta nova deve ter schema de entrada validado em runtime, descrição orientada à ação, endpoint explícito e teste de contrato.
- Nunca exponha tabelas inteiras sem paginação; respeite `page`, `pageSize`, busca, filtros e ordenação definidos no contrato.
- Operações de escrita devem ser deliberadas, idempotentes quando possível e protegidas por confirmação quando houver risco de perda de dados.
- Prefira módulos pequenos e coesos. Não aumente o `src/index.ts` com novas regras de negócio.
- Antes de criar uma entidade, cliente HTTP, serializador, tratamento de erro ou utilitário, procure uma implementação existente.
- Atualize a documentação e os testes na mesma mudança do código.

## Fluxo de trabalho do agente

1. Entender o pedido e identificar o módulo afetado.
2. Consultar os documentos acima e o código existente.
3. Propor ou registrar a decisão arquitetural quando houver impacto transversal.
4. Implementar a menor mudança compatível.
5. Executar `npm run build` dentro de `mcp-server` e os testes disponíveis.
6. Relatar arquivos alterados, validações executadas, riscos e pendências.

## Estado atual conhecido

O servidor atual concentra registro de ferramentas, roteamento, cliente HTTP e tratamento de erros em `mcp-server/src/index.ts`. Essa é uma dívida técnica documentada; novas funcionalidades devem seguir a arquitetura alvo e a migração deve ser incremental.
