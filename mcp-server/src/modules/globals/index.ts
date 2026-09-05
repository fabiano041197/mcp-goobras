import { z } from "zod";
import { registry } from "../../server/tool-registry.js";
import { api } from "../../infrastructure/http/erp-client.js";

// EtapaGlobal
const etapaGlobalSchema = z.object({
  nome: z.string(),
  descricao: z.string().default("").optional(),
  ordem_padrao: z.number().default(0).optional(),
  status: z.string().default("ativo").optional(),
});

registry.register(
  "listar_etapas_globais",
  "Lista as etapas globais",
  z.object({}),
  async () => {
    const res = await api.get("/etapas-globais");
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);

registry.register(
  "criar_etapa_global",
  "Cria uma etapa global",
  etapaGlobalSchema,
  async (args) => {
    const res = await api.post("/etapas-globais", args);
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);

registry.register(
  "atualizar_etapa_global",
  "Atualiza uma etapa global",
  etapaGlobalSchema.extend({
    id: z.string().uuid(),
  }).partial().required({ id: true }),
  async (args) => {
    const { id, ...payload } = args;
    const res = await api.put(`/etapas-globais/${id}`, payload);
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);

registry.register(
  "deletar_etapa_global",
  "Deleta uma etapa global",
  z.object({ id: z.string().uuid() }),
  async ({ id }) => {
    await api.delete(`/etapas-globais/${id}`);
    return { content: [{ type: "text", text: "Etapa global deletada." }] };
  }
);

// TarefaGlobal
const tarefaGlobalSchema = z.object({
  etapa_global_id: z.string().uuid(),
  nome: z.string(),
  descricao: z.string().default("").optional(),
  unidade: z.string().optional(),
  ordem: z.number().default(0).optional(),
  ativo: z.boolean().default(true).optional(),
  especificacao_id: z.string().uuid().optional(),
});

registry.register(
  "listar_tarefas_globais",
  "Lista tarefas globais de uma etapa global",
  z.object({
    etapa_global_id: z.string().uuid().optional(),
  }),
  async (args) => {
    const res = await api.get("/tarefas-globais", { params: args });
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);

registry.register(
  "criar_tarefa_global",
  "Cria uma tarefa global",
  tarefaGlobalSchema,
  async (args) => {
    const res = await api.post("/tarefas-globais", args);
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);

registry.register(
  "atualizar_tarefa_global",
  "Atualiza uma tarefa global",
  tarefaGlobalSchema.extend({
    id: z.string().uuid(),
  }).partial().required({ id: true }),
  async (args) => {
    const { id, ...payload } = args;
    const res = await api.put(`/tarefas-globais/${id}`, payload);
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);

registry.register(
  "deletar_tarefa_global",
  "Deleta uma tarefa global",
  z.object({ id: z.string().uuid() }),
  async ({ id }) => {
    await api.delete(`/tarefas-globais/${id}`);
    return { content: [{ type: "text", text: "Tarefa global deletada." }] };
  }
);

// EspecificacaoGlobal
const especificacaoGlobalSchema = z.object({
  nome: z.string(),
  unidade: z.string(),
  ativo: z.boolean().default(true).optional(),
});

registry.register(
  "listar_especificacoes_globais",
  "Lista especificações globais",
  z.object({}),
  async () => {
    const res = await api.get("/especificacoes-globais");
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);

registry.register(
  "criar_especificacao_global",
  "Cria uma especificação global",
  especificacaoGlobalSchema,
  async (args) => {
    const res = await api.post("/especificacoes-globais", args);
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);

registry.register(
  "atualizar_especificacao_global",
  "Atualiza uma especificação global",
  especificacaoGlobalSchema.extend({
    id: z.string().uuid(),
  }).partial().required({ id: true }),
  async (args) => {
    const { id, ...payload } = args;
    const res = await api.put(`/especificacoes-globais/${id}`, payload);
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);

registry.register(
  "deletar_especificacao_global",
  "Deleta uma especificação global",
  z.object({ id: z.string().uuid() }),
  async ({ id }) => {
    await api.delete(`/especificacoes-globais/${id}`);
    return { content: [{ type: "text", text: "Especificação global deletada." }] };
  }
);

registry.register(
  "listar_materiais_especificacao_global",
  "Lista materiais vinculados a uma especificação global",
  z.object({ id: z.string().uuid() }),
  async ({ id }) => {
    const res = await api.get(`/especificacoes-globais/${id}/materiais`);
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);

registry.register(
  "vincular_material_especificacao_global",
  "Vincula material a uma especificação global",
  z.object({
    id: z.string().uuid(),
    material_id: z.string().uuid(),
    quantidade_padrao: z.number(),
  }),
  async (args) => {
    const { id, ...payload } = args;
    const res = await api.post(`/especificacoes-globais/${id}/materiais`, payload);
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);
