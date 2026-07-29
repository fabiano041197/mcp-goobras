# GoObras MCP — instruções para Antigravity/Gemini

Use este arquivo como instrução de entrada para tarefas realizadas no Antigravity. A política completa está em [AGENTS.md](AGENTS.md); os documentos normativos estão em `docs/`.

Antes de implementar:

- leia `AGENTS.md`, `docs/context/product-context.md`, `docs/architecture/architecture.md` e `docs/business-rules/business-rules.md`;
- confirme se a mudança afeta o contrato de uma ferramenta MCP ou da API ERP;
- mantenha TypeScript estrito, validação Zod em runtime, isolamento de infraestrutura e tratamento uniforme de erros;
- não crie credenciais, não altere `dist/` manualmente e não misture mudanças do backend ERP neste repositório.

Ao concluir, execute `npm run build` em `mcp-server`, atualize a documentação/contratos necessários e entregue um resumo curto com testes, riscos e decisões.
