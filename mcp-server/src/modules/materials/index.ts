import { z } from "zod";
import { registry } from "../../server/tool-registry.js";
import { api } from "../../infrastructure/http/erp-client.js";

const materialBaseSchema = z.object({
  nome: z.string(),
  tipo_recurso: z.string().default("produto").optional(),
  unidade_medida: z.string(),
  preco_unitario: z.number(),
  categoria: z.string().optional(),
  ativo: z.boolean().optional(),
});

registry.register(
  "listar_materiais",
  "Lista o catálogo global de materiais",
  z.object({
    q: z.string().optional().describe("Termo de busca"),
    page: z.number().optional().describe("Número da página"),
    limit: z.number().optional().describe("Quantidade por página"),
  }),
  async (args) => {
    const res = await api.get("/materiais", { params: args });
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);

registry.register(
  "obter_material",
  "Obtém os detalhes de um material do catálogo",
  z.object({
    material_id: z.string().uuid(),
  }),
  async ({ material_id }) => {
    const res = await api.get(`/materiais/${material_id}`);
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);

registry.register(
  "criar_material",
  "Cria um novo material no catálogo",
  materialBaseSchema,
  async (args) => {
    const res = await api.post("/materiais", args);
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);

registry.register(
  "atualizar_material",
  "Atualiza um material no catálogo",
  materialBaseSchema.extend({
    material_id: z.string().uuid(),
  }).partial().required({ material_id: true }),
  async (args) => {
    const { material_id, ...payload } = args;
    const res = await api.put(`/materiais/${material_id}`, payload);
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);

registry.register(
  "deletar_material",
  "Deleta um material do catálogo",
  z.object({
    material_id: z.string().uuid(),
  }),
  async ({ material_id }) => {
    await api.delete(`/materiais/${material_id}`);
    return { content: [{ type: "text", text: "Material deletado com sucesso" }] };
  }
);
