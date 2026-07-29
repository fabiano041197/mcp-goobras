# Contrato de integração com a API ERP

## Configuração

- Base URL: `ERP_API_URL`, default `http://localhost:8000/v1`.
- Autorização: `Authorization: Bearer <ERP_TOKEN>`.
- Segredo nunca via argumento CLI, código fonte ou log.

## Convenções HTTP

- `GET` para leitura; `POST` para criação; `PUT/PATCH` para alteração; `DELETE` para remoção.
- IDs devem ser codificados na URL.
- Query parameters devem ser validados e normalizados antes do envio.
- Timeout e cancelamento devem estar configurados no cliente.

## Paginação

Toda coleção deve suportar `page=1`, `pageSize=20` e máximo `pageSize=100`, além de busca, filtros e ordenação quando a API oferecer suporte. Nunca remover o limite para “facilitar” a consulta do agente.

## Erros

Mapear pelo menos: validação (`400/422`), não autenticado (`401`), sem permissão (`403`), não encontrado (`404`), conflito (`409`), limite/indisponibilidade (`429/5xx`). A mensagem deve indicar a ação possível ao usuário.

## Compatibilidade

O contrato observado deve ser confirmado contra a API ERP antes de publicar uma ferramenta. Quando houver divergência entre endpoints com e sem barra final, padronizar no cliente e cobrir com teste de contrato; não espalhar a divergência pelos módulos.
