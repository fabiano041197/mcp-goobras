# Arquitetura alvo

## Decisão

O MCP seguirá uma arquitetura modular em camadas, mantendo o processo pequeno e stateless:

```text
Cliente MCP
    ↓ stdio
Runtime MCP / registro de ferramentas
    ↓ schemas e casos de uso
Módulos de domínio (clientes, projetos, templates, materiais, fiscal)
    ↓ portas
Cliente HTTP ERP
    ↓ HTTPS + Bearer
API ERP
```

## Camadas

1. **Transport**: conexão stdio, ciclo de vida do servidor e protocolo MCP.
2. **Tool registry**: metadados, schemas e dispatch das ferramentas.
3. **Application**: casos de uso e composição de fluxos; sem Axios direto.
4. **Domain contracts**: tipos, IDs, filtros, invariantes e erros conhecidos.
5. **Infrastructure**: configuração, cliente HTTP, autenticação, timeout, retry seguro e serialização.

## Estrutura de diretórios alvo

```text
mcp-server/src/
├── main.ts
├── server/
│   ├── create-server.ts
│   ├── tool-registry.ts
│   └── protocol-errors.ts
├── config/
│   └── env.ts
├── infrastructure/http/
│   ├── erp-client.ts
│   ├── http-errors.ts
│   └── pagination.ts
├── modules/
│   ├── clients/
│   ├── suppliers/
│   ├── projects/
│   ├── templates/
│   ├── materials/
│   └── invoices/
└── shared/
    ├── ids.ts
    ├── result.ts
    └── validation.ts
```

Cada módulo pode conter `schemas.ts`, `types.ts`, `service.ts`, `tools.ts` e `routes.ts`/`api.ts`. O módulo não deve importar outro módulo diretamente para executar operações; composição ocorre na camada application.

## Dependências permitidas

- Transport conhece registry.
- Registry conhece casos de uso e schemas.
- Application conhece portas de domínio.
- Infrastructure implementa portas.
- Domínio não conhece MCP, Axios, `process.env` ou detalhes de HTTP.

## Configuração e segurança

- `ERP_TOKEN` é obrigatório e somente via variável de ambiente.
- `ERP_API_URL` tem default local documentado.
- Timeout explícito; não usar chamadas sem limite.
- Retry somente para falhas transitórias e operações idempotentes.
- Logs em stderr; nunca incluir `Authorization`, payloads sensíveis ou token.

## Evolução incremental

1. Extrair configuração e cliente HTTP.
2. Extrair tipos/schemas compartilhados.
3. Migrar um domínio por vez para módulos.
4. Substituir o switch central por registry modular.
5. Adicionar testes de contrato e integração com API mockada.
6. Remover o caminho legado somente após paridade comprovada.

## Decisões explícitas

- Monólito modular antes de microserviços: o MCP é um adaptador local e não precisa de distribuição interna.
- Sem cache por padrão: dados de obra e estoque precisam de atualidade; cache só com requisito explícito e política de invalidação.
- Sem transação distribuída no MCP: consistência transacional pertence ao backend; fluxos compostos devem ser recuperáveis e reportar falha parcial.
