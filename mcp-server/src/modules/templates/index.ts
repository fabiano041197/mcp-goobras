import { z } from "zod";
import { registry } from "../../server/tool-registry.js";
import { api } from "../../infrastructure/http/erp-client.js";

const templateBaseSchema = z.object({
  nome: z.string(),
  descricao: z.string().optional(),
  ativo: z.boolean().default(true).optional(),
});

registry.register(
  "listar_templates",
  "Lista os templates do sistema",
  z.object({}),
  async () => {
    const res = await api.get("/templates");
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);

registry.register(
  "obter_template",
  "Obtém detalhes de um template pelo ID",
  z.object({
    id: z.string().uuid(),
  }),
  async ({ id }) => {
    const res = await api.get(`/templates/${id}`);
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);

registry.register(
  "criar_template",
  "Cria um novo template",
  templateBaseSchema,
  async (args) => {
    const res = await api.post("/templates", args);
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);

registry.register(
  "atualizar_template",
  "Atualiza um template existente",
  templateBaseSchema.extend({
    id: z.string().uuid(),
  }).partial().required({ id: true }),
  async (args) => {
    const { id, ...payload } = args;
    const res = await api.put(`/templates/${id}`, payload);
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);

registry.register(
  "deletar_template",
  "Deleta um template e seus dependentes em cascata",
  z.object({
    id: z.string().uuid(),
  }),
  async ({ id }) => {
    await api.delete(`/templates/${id}`);
    return { content: [{ type: "text", text: "Template deletado com sucesso." }] };
  }
);

registry.register(
  "listar_template_variaveis",
  "Lista variáveis associadas a um template",
  z.object({
    template_id: z.string().uuid(),
  }),
  async ({ template_id }) => {
    const res = await api.get(`/template-variaveis/template/${template_id}`);
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);

registry.register(
  "criar_template_variavel",
  "Cria uma variável em um template",
  z.object({
    template_id: z.string().uuid(),
    nome: z.string(),
    descricao: z.string().optional(),
    valor_padrao: z.string().optional(),
    tipo: z.string().default("numero"),
  }),
  async (args) => {
    const { template_id, ...payload } = args;
    const res = await api.post(`/template-variaveis/template/${template_id}`, payload);
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);

registry.register(
  "atualizar_template_variavel",
  "Atualiza uma variável de template",
  z.object({
    id: z.string().uuid(),
    nome: z.string().optional(),
    descricao: z.string().optional(),
    valor_padrao: z.string().optional(),
    tipo: z.string().optional(),
  }),
  async (args) => {
    const { id, ...payload } = args;
    const res = await api.put(`/template-variaveis/${id}`, payload);
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);
