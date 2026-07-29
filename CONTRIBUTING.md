# Contribuindo

## Escopo

Este repositório contém um servidor MCP que traduz intenções de agentes em chamadas autenticadas à API do ERP de gestão de obras. O backend, banco de dados e regras transacionais do ERP pertencem a outro sistema.

## Antes de abrir uma mudança

- Identifique o domínio: cadastros, projetos, templates, materiais, suprimentos/notas fiscais ou infraestrutura.
- Verifique se a ferramenta já existe com outro nome ou se a operação pode ser composta por ferramentas existentes.
- Defina o contrato de entrada, saída, erros e permissões.
- Para escrita destrutiva, documente confirmação, idempotência e comportamento de falha parcial.

## Padrões de implementação

- TypeScript com `strict: true`.
- Zod para validar entradas antes de chamar a API.
- Axios isolado em um cliente HTTP; ferramentas não devem conhecer detalhes de autenticação.
- Uma ferramenta deve fazer uma operação de domínio clara. Fluxos compostos devem declarar pré-condições e etapas.
- Mensagens para o modelo devem ser objetivas, incluir IDs e indicar quando uma operação foi concluída ou falhou.
- Erros remotos devem preservar status, código e mensagem útil sem expor token, headers ou stack trace sensível.

## Validação local

```bash
cd mcp-server
npm install
npm run build
```

Quando houver testes, execute-os antes do build final. Não versionar `node_modules`, tokens, arquivos `.env` ou artefatos temporários.
