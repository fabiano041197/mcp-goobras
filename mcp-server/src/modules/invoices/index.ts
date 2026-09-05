import { z } from "zod";
import { registry } from "../../server/tool-registry.js";
import { api } from "../../infrastructure/http/erp-client.js";

const notaFiscalItemSchema = z.object({
  material_id: z.string().uuid().optional(),
  projeto_tarefa_id: z.string().uuid().optional(),
  projeto_tarefa_material_id: z.string().uuid().optional(),
  ordem_compra_item_id: z.string().uuid().optional(),
  descricao: z.string(),
  quantidade: z.number(),
  valor_unitario: z.number(),
  valor_total: z.number(),
});

const notaFiscalBaseSchema = z.object({
  tipo_nota: z.string().default("nfe").optional(),
  numero_nota: z.string(),
  fornecedor_id: z.string().uuid().optional(),
  ordem_compra_id: z.string().uuid().optional(),
  chave_acesso: z.string().optional(),
  xml_url: z.string().optional(),
  arquivo_url: z.string().optional(),
  data_emissao: z.string().describe("Data no formato YYYY-MM-DD"),
  valor_total: z.number(),
  projeto_id: z.string().uuid(),
  itens: z.array(notaFiscalItemSchema).default([]).optional(),
});

registry.register(
  "listar_notas_fiscais",
  "Lista as notas fiscais",
  z.object({
    projeto_id: z.string().uuid().optional(),
  }),
  async (args) => {
    const res = await api.get("/notas-fiscais", { params: args });
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);

registry.register(
  "criar_nota_fiscal",
  "Cria uma nova nota fiscal, lançando materiais",
  notaFiscalBaseSchema,
  async (args) => {
    const res = await api.post("/notas-fiscais", args);
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);

registry.register(
  "atualizar_nota_fiscal",
  "Atualiza uma nota fiscal",
  notaFiscalBaseSchema.extend({
    nota_id: z.string().uuid(),
  }).partial().required({ nota_id: true }),
  async (args) => {
    const { nota_id, ...payload } = args;
    const res = await api.put(`/notas-fiscais/${nota_id}`, payload);
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);

