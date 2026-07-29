# Modelo de operação dos agentes

## Papéis

| Papel | Responsabilidade | Saída esperada |
|---|---|---|
| Analista de contexto | Entender intenção, escopo e entidades | Contexto, dúvidas e critérios |
| Arquiteto | Avaliar limites, dependências e impacto | Decisão/ADR ou desenho modular |
| Especificador | Transformar requisito em contrato | Especificação implementável |
| Implementador | Alterar código conforme contrato | Código, testes e documentação |
| Revisor | Procurar regressões, vazamentos e quebra de contrato | Achados priorizados |

## Sequência recomendada

```text
Contexto → Especificação → Arquitetura → Implementação → Testes → Revisão → Documentação
```

## Handoff obrigatório

Todo handoff deve conter: objetivo, arquivos relevantes, contrato afetado, invariantes, riscos, testes executados e decisões pendentes.

## Critérios de pronto

- Requisito e regra de negócio documentados.
- Schema de entrada e resposta definidos.
- Erros e casos-limite cobertos.
- Nenhum segredo ou dado real incluído.
- Build e testes executados.
- README/documentação atualizados quando o uso público mudar.
