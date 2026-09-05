import { z } from "zod";
import { registry } from "../../server/tool-registry.js";
import { api } from "../../infrastructure/http/erp-client.js";

const clienteBaseSchema = z.object({
  nome: z.string(),
  tipo: z.enum(["pf", "pj"]).default("pj").optional(),
  cnpj: z.string().optional(),
  cpf: z.string().optional(),
  email: z.string().email(),
  telefone: z.string(),
  logradouro: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string(),
  estado: z.string(),
  cep: z.string().optional(),
  ativo: z.boolean().default(true).optional(),
});

registry.register(
  "listar_clientes",
  "Lista clientes cadastrados no ERP GoObras",
  z.object({
    q: z.string().optional().describe("Termo de busca"),
    page: z.number().optional().describe("Número da página"),
    limit: z.number().optional().describe("Quantidade por página"),
  }),
  async (args) => {
    const res = await api.get("/clientes", { params: args });
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);

registry.register(
  "obter_cliente",
  "Obtém detalhes de um cliente específico pelo ID",
  z.object({
    id: z.string().uuid("ID deve ser um UUID"),
  }),
  async ({ id }) => {
    const res = await api.get(`/clientes/${id}`);
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);

registry.register(
  "criar_cliente",
  "Cria um novo cliente no ERP",
  clienteBaseSchema,
  async (args) => {
    const res = await api.post("/clientes", args);
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);

registry.register(
  "atualizar_cliente",
  "Atualiza os dados de um cliente existente",
  clienteBaseSchema.extend({
    id: z.string().uuid("ID deve ser um UUID"),
  }).partial().required({ id: true }),
  async (args) => {
    const { id, ...payload } = args;
    const res = await api.put(`/clientes/${id}`, payload);
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);

registry.register(
  "alternar_status_cliente",
  "Ativa ou desativa um cliente",
  z.object({
    id: z.string().uuid("ID deve ser um UUID"),
  }),
  async ({ id }) => {
    const res = await api.patch(`/clientes/${id}/toggle-ativo`);
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);
