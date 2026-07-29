# Limites dos módulos

| Módulo | Responsabilidade | Não deve fazer |
|---|---|---|
| Cadastros | Clientes e fornecedores | Calcular custo de obra |
| Projetos | Projetos, etapas, tarefas e materiais da tarefa | Alterar catálogo global sem operação própria |
| Templates | Modelos, variáveis e composição reutilizável | Criar projeto real implicitamente |
| Catálogo | Materiais e especificações globais | Lançar nota fiscal |
| Fiscal/suprimentos | Notas fiscais e itens de entrada | Inventar validação fiscal fora do contrato |
| Infraestrutura | HTTP, auth, timeout, erros e paginação | Regras de negócio |

## Regra de dependência

Templates podem referenciar registros globais do Catálogo. Fiscal/suprimentos pode referenciar Projetos, Cadastros e Catálogo. Nenhum módulo deve acessar o banco ou endpoint de outro módulo diretamente; use um caso de uso/porta documentado.
