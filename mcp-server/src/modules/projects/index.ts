import { z } from "zod";
import { registry } from "../../server/tool-registry.js";
import { api } from "../../infrastructure/http/erp-client.js";

const projetoBaseSchema = z.object({
  nome: z.string(),
  descricao: z.string().default("").optional(),
  cliente_id: z.string().uuid(),
  cliente: z.string(),
  logradouro: z.string().default("").optional(),
  cidade: z.string().default("").optional(),
  estado: z.string().default("").optional(),
  engenheiro: z.string().default("").optional(),
  gerente_projeto: z.string().default("").optional(),
  valor_contrato: z.number().default(0).optional(),
  valor_orcado: z.number().default(0).optional(),
  valor_executado: z.number().default(0).optional(),
  data_inicio: z.string().describe("Data YYYY-MM-DD"),
  data_fim: z.string().describe("Data YYYY-MM-DD"),
  data_fim_prevista: z.string().describe("Data YYYY-MM-DD"),
  status: z.string().default("planejamento").optional(),
  progresso_fisico: z.number().default(0).optional(),
  progresso_financeiro: z.number().default(0).optional(),
});

registry.register(
  "listar_projetos",
  "Lista os projetos disponÃ­veis no ERP",
  z.object({
    q: z.string().optional().describe("Termo de busca"),
    page: z.number().optional().describe("NÃºmero da pÃ¡gina"),
    limit: z.number().optional().describe("Quantidade por pÃ¡gina"),
  }),
  async (args) => {
    const res = await api.get("/projetos", { params: args });
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);

registry.register(
  "obter_projeto",
  "ObtÃ©m detalhes de um projeto especÃ­fico pelo ID",
  z.object({
    id: z.string().uuid(),
  }),
  async ({ id }) => {
    const res = await api.get(`/projetos/${id}`);
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);

registry.register(
  "criar_projeto",
  "Cria um novo projeto",
  projetoBaseSchema,
  async (args) => {
    const res = await api.post("/projetos", args);
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);

registry.register(
  "atualizar_projeto",
  "Atualiza os dados de um projeto existente",
  projetoBaseSchema.extend({
    id: z.string().uuid(),
  }).partial().required({ id: true }),
  async (args) => {
    const { id, ...payload } = args;
    const res = await api.put(`/projetos/${id}`, payload);
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);

registry.register(
  "deletar_projeto",
  "Deleta um projeto",
  z.object({
    id: z.string().uuid(),
  }),
  async ({ id }) => {
    await api.delete(`/projetos/${id}`);
    return { content: [{ type: "text", text: "Projeto deletado com sucesso." }] };
  }
);

registry.register(
  "listar_projeto_etapas",
  "Lista as etapas de um projeto especÃ­fico",
  z.object({
    projetoId: z.string().uuid(),
  }),
  async ({ projetoId }) => {
    const res = await api.get("/projeto-etapas", { params: { projetoId } });
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);

registry.register(
  "listar_projeto_tarefas",
  "Lista as tarefas de uma etapa ou projeto",
  z.object({
    projetoId: z.string().uuid().optional(),
    etapaId: z.string().uuid().optional(),
    q: z.string().optional(),
  }),
  async (args) => {
    const res = await api.get("/projeto-tarefas", { params: args });
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);

registry.register(
  'listar_materiais_tarefa',
  'Lista os materiais vinculados a uma tarefa específica de projeto',
  z.object({ tarefaId: z.string().uuid() }),
  async ({ tarefaId }) => {
    const res = await api.get(/projeto-tarefas//materiais);
    return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
  }
);

registry.register(
  'vincular_material_tarefa',
  'Vincula um material a uma tarefa com quantidades',
  z.object({
    tarefaId: z.string().uuid(),
    material_id: z.string().uuid(),
    quantidade_planejada: z.number(),
  }),
  async (args) => {
    const { tarefaId, ...payload } = args;
    const res = await api.post(/projeto-tarefas//materiais, payload);
    return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
  }
);


const projetoEtapaSchema = z.object({
  etapa_global_id: z.string().uuid().optional(),
  codigo: z.string().optional(),
  nome: z.string().optional(),
  descricao: z.string().optional(),
  ordem: z.number().optional(),
  status: z.string().optional(),
  progresso: z.number().optional(),
  responsavel: z.string().optional(),
  valor_orcado: z.number().optional(),
  valor_executado: z.number().optional(),
  data_inicio: z.string().optional(),
  data_fim_prevista: z.string().optional(),
  data_fim: z.string().optional(),
});

registry.register(
  "atualizar_projeto_etapa",
  "Atualiza uma etapa de projeto",
  projetoEtapaSchema.extend({
    projeto_id: z.string().uuid(),
    etapa_id: z.string().uuid(),
  }).partial().required({ projeto_id: true, etapa_id: true }),
  async (args) => {
    const { projeto_id, etapa_id, ...payload } = args;
    const res = await api.put(`/projeto-etapas/${etapa_id}`, payload);
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);

const projetoTarefaSchema = z.object({
  projeto_etapa_id: z.string().uuid().optional(),
  tarefa_global_id: z.string().uuid().optional(),
  titulo: z.string().optional(),
  descricao: z.string().optional(),
  status: z.string().optional(),
  prioridade: z.string().optional(),
  quantidade_planejada: z.number().optional(),
  especificacao_id: z.string().uuid().optional(),
  progresso: z.number().optional(),
  responsavel: z.string().optional(),
  data_inicio: z.string().optional(),
  data_fim_prevista: z.string().optional(),
  data_fim: z.string().optional(),
});

registry.register(
  "atualizar_projeto_tarefa",
  "Atualiza uma tarefa de projeto",
  projetoTarefaSchema.extend({
    tarefa_id: z.string().uuid(),
  }).partial().required({ tarefa_id: true }),
  async (args) => {
    const { tarefa_id, ...payload } = args;
    const res = await api.put(`/projeto-tarefas/${tarefa_id}`, payload);
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);

registry.register(
  "atualizar_material_tarefa",
  "Atualiza o vínculo de um material a uma tarefa",
  z.object({
    vinculo_id: z.string().uuid(),
    quantidade_planejada: z.number().optional(),
    preco_congelado: z.number().optional(),
  }),
  async (args) => {
    const { vinculo_id, ...payload } = args;
    const res = await api.put(`/projeto-tarefas/materiais/${vinculo_id}`, payload);
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);

