# Contexto do produto

## Objetivo

O GoObras MCP é um adaptador que permite a clientes compatíveis com Model Context Protocol consultar e operar um ERP de gestão de obras por linguagem natural, com ferramentas tipadas e autenticação por token.

## Problema

Usuários precisam transformar intenções como “listar materiais de uma tarefa”, “criar um template de obra” ou “registrar uma nota fiscal” em chamadas consistentes à API do ERP. O MCP reduz esse acoplamento, orienta o agente sobre os fluxos válidos e devolve resultados estruturados.

## Usuários e consumidores

- Gestores de obras, engenharia, compras e financeiro.
- Agentes de IA conectados por clientes MCP.
- Desenvolvedores que hospedam o ERP e desejam reutilizar o adaptador.

## Escopo atual observado

- Clientes e fornecedores.
- Projetos, etapas e tarefas.
- Catálogo de materiais e materiais vinculados a tarefas.
- Notas fiscais.
- Templates, variáveis, etapas/tarefas globais e especificações.

## Fora do escopo

- Implementar o backend do ERP ou seu banco de dados.
- Armazenar tokens ou dados do usuário.
- Autenticar diretamente usuários finais.
- Inventar regras contábeis, fiscais ou de engenharia não fornecidas pelo backend.

## Princípios do produto

1. Segurança por padrão: segredo apenas em ambiente e nunca em argumentos de processo.
2. Transparência: o agente deve saber o que será lido, criado, alterado ou excluído.
3. Composição: ferramentas simples podem formar fluxos maiores, desde que as pré-condições sejam explícitas.
4. Compatibilidade: mudanças no contrato MCP devem ser evolutivas e documentadas.
5. Reuso: nomes e schemas devem ser consistentes entre domínios.

## Critérios de sucesso

- Uma instalação nova consegue configurar o servidor sem editar código.
- Cada ferramenta possui contrato compreensível, validação e erro acionável.
- O servidor não vaza segredos e não retorna coleções ilimitadas.
- Novos módulos podem ser adicionados sem ampliar indefinidamente um arquivo central.
