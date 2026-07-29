# Regras de negócio

Estas regras consolidam o comportamento explícito nas ferramentas atuais e devem ser confirmadas contra o backend ERP quando uma nova operação for criada.

## Gerais

1. Entidades persistentes possuem `id`, `createdAt`, `updatedAt` e `status` quando suportado pelo backend.
2. Referências usam IDs e chaves estrangeiras; não duplicar dados de entidades relacionadas.
3. Nome não é identificador suficiente quando houver mais de um resultado.
4. Toda operação respeita o tenant/escopo implícito do token.

## Templates

1. Template é uma casca reutilizável; criar a raiz não significa que o template esteja completo.
2. Uma etapa de template deve referenciar uma `etapa_global` existente.
3. Uma tarefa de template deve referenciar uma `tarefa_global` existente.
4. A tarefa global deve pertencer à mesma etapa global da etapa de template.
5. Variáveis de template têm código único dentro do template e podem ser usadas em fórmulas quando o backend permitir.
6. Exclusão de template pode remover etapas, tarefas e variáveis em cascata; exigir confirmação e descrever a consequência.

## Projetos e materiais

1. Projeto é o contexto para etapas, tarefas e lançamentos associados.
2. Material de tarefa é uma associação contextual; não altera automaticamente o catálogo global.
3. Quantidades devem ser positivas quando representarem planejamento ou consumo.
4. Unidade de medida e preço devem seguir o catálogo/contrato do backend; o MCP não deve recalcular silenciosamente.

## Notas fiscais

1. Nota fiscal deve estar associada a projeto e, quando informado, fornecedor.
2. Itens devem possuir descrição, quantidade, valor unitário e valor total conforme contrato do ERP.
3. O total da nota e a soma dos itens devem ser validados pelo backend; o MCP pode detectar divergência, mas não corrigir silenciosamente.
4. O lançamento de itens em tarefas deve referenciar IDs existentes e reportar falhas parciais de forma explícita.

## Segurança e destruição

1. Nunca registrar token ou payload sensível.
2. Operações destrutivas são opt-in e devem declarar escopo.
3. Em erro remoto, preservar a causa útil sem expor detalhes internos do servidor.
