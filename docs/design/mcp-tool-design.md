# Especificação de design das ferramentas MCP

## Contrato mínimo

Toda ferramenta deve definir:

- `name`: estável, minúsculo, snake_case e iniciado por verbo;
- `description`: objetivo, entidade, efeito colateral e pré-condições;
- `inputSchema`: schema JSON gerado a partir de validação runtime;
- resultado textual JSON quando houver dados, com shape documentado;
- erro MCP com mensagem acionável e sem segredo.

## Padrões

- Listagem: `listar_<entidade>` com `page`, `pageSize`, `search`, filtros e `sort` quando suportados.
- Consulta: `obter_<entidade>` requer ID.
- Escrita: `criar_`, `atualizar_`, `deletar_`; explicitar efeito e retorno.
- Relação: `listar_<entidade>_<relacao>` e `vincular_`/`desvincular_` quando houver associação.
- A ferramenta não deve retornar HTML, stack trace ou resposta Axios bruta.

## Ferramentas compostas

Uma ferramenta composta só é aceitável quando o fluxo é frequente, determinístico e reduz risco de uso incorreto. Deve listar as etapas, parar em falha, devolver o que foi concluído e não esconder operações destrutivas.

## Leitura versus escrita

- Leitura pode ser executada diretamente se os parâmetros forem válidos.
- Criação/atualização deve validar referências e campos obrigatórios.
- Exclusão deve informar o alvo e consequências; cascata deve aparecer na descrição.
- O MCP não deve “adivinhar” IDs por nome quando houver ambiguidade; listar e pedir desambiguação.

## Forma de resposta

Listas devem preferir:

```json
{
  "data": [],
  "pagination": { "page": 1, "pageSize": 20, "total": 0, "totalPages": 0 }
}
```

Se o backend usar outro shape, o adaptador deve documentar a exceção e evitar inventar totais.
