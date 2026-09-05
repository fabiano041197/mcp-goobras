import { z } from "zod";
import { registry } from "../../server/tool-registry.js";
import { api } from "../../infrastructure/http/erp-client.js";

const fornecedorBaseSchema = z.object({
  tipo: z.enum(["pf", "pj"]).default("pj").optional(),
  razao_social: z.string(),
  nome_fantasia: z.string().optional(),
  cnpj: z.string().optional(),
  cpf: z.string().optional(),
  email: z.string().email().optional(),
  telefone: z.string().optional(),
  logradouro: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  cep: z.string().optional(),
  ativo: z.boolean().default(true).optional(),
});

registry.register(
  "listar_fornecedores",
  "Lista fornecedores cadastrados no ERP",
  z.object({
    search: z.string().optional().describe("Termo de busca"),
    skip: z.number().optional().describe("Offset da busca"),
    limit: z.number().optional().describe("Quantidade por página"),
  }),
  async (args) => {
    const res = await api.get("/fornecedores", { params: args });
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);

registry.register(
  "obter_fornecedor",
  "Obtém detalhes de um fornecedor pelo ID",
  z.object({
    id: z.string().uuid("ID deve ser um UUID"),
  }),
  async ({ id }) => {
    const res = await api.get(`/fornecedores/${id}`);
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);

registry.register(
  "criar_fornecedor",
  "Cria um novo fornecedor no ERP",
  fornecedorBaseSchema,
  async (args) => {
    const res = await api.post("/fornecedores", args);
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);

registry.register(
  "atualizar_fornecedor",
  "Atualiza um fornecedor existente",
  fornecedorBaseSchema.extend({
    id: z.string().uuid("ID deve ser um UUID"),
  }).partial().required({ id: true }),
  async (args) => {
    const { id, ...payload } = args;
    const res = await api.put(`/fornecedores/${id}`, payload);
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);
