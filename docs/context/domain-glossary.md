# Glossário do domínio

| Termo | Definição canônica |
|---|---|
| Cliente | Pessoa física ou jurídica contratante ou relacionada à obra. |
| Fornecedor | Pessoa ou empresa que fornece materiais ou serviços. |
| Projeto | Obra ou empreendimento gerenciado no ERP. |
| Etapa | Fase ordenável de um projeto, como fundação ou acabamento. |
| Tarefa | Serviço executável dentro de uma etapa. |
| Material | Item do catálogo global, com unidade de medida e preço de referência. |
| Material da tarefa | Associação entre uma tarefa de projeto e um material, com quantidade/custo planejado. |
| Template | Modelo reutilizável de projeto; contém etapas, tarefas, vínculos e variáveis. |
| Etapa global | Registro reutilizável do dicionário de etapas. |
| Tarefa global | Registro reutilizável do dicionário de tarefas, pertencente a uma etapa global. |
| Especificação global | Composição ou requisito reutilizável que pode ser associado a uma tarefa de template. |
| Variável de template | Parâmetro nomeado usado em cálculos ou valores-base do template. |
| Nota fiscal | Documento de entrada associado a fornecedor, projeto e itens adquiridos. |
| MCP | Model Context Protocol; protocolo pelo qual o cliente descobre e invoca ferramentas. |
| Ferramenta | Operação MCP exposta ao agente, com nome, descrição, schema e resultado. |

## Convenções de nomes

- IDs são opacos para o MCP; não assumir UUID, inteiro ou formato sem contrato da API.
- Nomes de ferramentas são estáveis e orientados a verbo: `listar_*`, `obter_*`, `criar_*`, `atualizar_*`, `deletar_*`.
- O payload enviado à API deve respeitar o contrato dela; o MCP pode oferecer aliases de entrada apenas quando documentados.
