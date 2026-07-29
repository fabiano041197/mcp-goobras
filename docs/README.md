# Documentação de engenharia

Esta pasta é a fonte de verdade do MCP público de gestão de obras.

| Área | Documento | Finalidade |
|---|---|---|
| Contexto | [product-context.md](context/product-context.md) | Produto, usuários, limites e objetivos |
| Contexto | [domain-glossary.md](context/domain-glossary.md) | Vocabulário canônico |
| Arquitetura | [architecture.md](architecture/architecture.md) | Camadas, dependências e evolução |
| Design | [mcp-tool-design.md](design/mcp-tool-design.md) | Padrão de ferramentas MCP |
| Design | [api-contract.md](design/api-contract.md) | Convenções de integração HTTP |
| Negócio | [business-rules.md](business-rules/business-rules.md) | Invariantes e fluxos obrigatórios |
| Agentes | [agent-operating-model.md](agents/agent-operating-model.md) | Papéis, handoff e critérios de qualidade |

## Como evoluir

Decisões que afetem mais de um módulo devem ser registradas em `docs/decisions/` no formato ADR. Especificações de novas capacidades devem seguir o modelo em `docs/specifications/_template.md`.
