#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { api } from "./infrastructure/http/erp-client.js";
import { registry } from "./server/tool-registry.js";
import "./modules/clients/index.js";
import "./modules/suppliers/index.js";
import "./modules/projects/index.js";
import "./modules/materials/index.js";
import "./modules/templates/index.js";
import "./modules/globals/index.js";
import "./modules/invoices/index.js";

// Setup do Servidor MCP
const server = new Server(
  {
    name: "erp-cadastro-pessoas",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      ...registry.getToolList(),
      {
        name: "listar_materiais_tarefa",
        description: "Lista os materiais vinculados a uma tarefa específica",
        inputSchema: {
          type: "object",
          properties: {
            tarefaId: { type: "string" },
          },
          required: ["tarefaId"],
        },
      },
      {
        name: "vincular_material_tarefa",
        description: "Vincula um material a uma tarefa com quantidades e custos planejados",
        inputSchema: {
          type: "object",
          properties: {
            tarefaId: { type: "string" },
            material_id: { type: "string" },
            quantidade_planejada: { type: "number" },
          },
          required: ["tarefaId", "material_id", "quantidade_planejada"],
        },
      },
      {
        name: "listar_notas_fiscais",
        description: "Lista as notas fiscais do ERP, opcionalmente filtrando por projeto",
        inputSchema: {
          type: "object",
          properties: {
            projeto_id: { type: "string" },
          },
        },
      },
      {
        name: "criar_nota_fiscal",
        description: "Cria uma nova nota fiscal, lançando os materiais nas tarefas e etapas do projeto",
        inputSchema: {
          type: "object",
          properties: {
            projeto_id: { type: "string" },
            numero_nota: { type: "string" },
            fornecedor_id: { type: "string" },
            data_emissao: { type: "string", description: "Formato YYYY-MM-DD" },
            valor_total: { type: "number" },
            itens: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  material_id: { type: "string" },
                  projeto_tarefa_id: { type: "string" },
                  projeto_tarefa_material_id: { type: "string" },
                  descricao: { type: "string" },
                  quantidade: { type: "number" },
                  valor_unitario: { type: "number" },
                  valor_total: { type: "number" },
                },
                required: ["descricao", "quantidade", "valor_unitario", "valor_total"],
              },
            },
          },
          required: ["projeto_id", "numero_nota", "data_emissao", "valor_total", "itens"],
        },
      },
      {
        name: "listar_templates",
        description: "Lista os templates de projetos cadastrados",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "obter_template",
        description: "Obtém detalhes de um template, incluindo etapas e tarefas",
        inputSchema: {
          type: "object",
          properties: { id: { type: "string" } },
          required: ["id"],
        },
      },
      {
        name: "criar_template",
        description: `Cria o nó raiz de um template de projeto.
REGRA DE NEGÓCIO PARA TEMPLATES COMPLETOS:
1. Um Template é apenas uma casca. Você DEVE adicionar Etapas e Tarefas a ele.
2. O sistema exige que Etapas e Tarefas venham de um Dicionário Global.
3. FLUXO OBRIGATÓRIO:
   a) Verifique se a etapa existe no dicionário (listar_etapas_globais). Se não, crie (criar_etapa_global).
   b) Adicione a etapa ao template (criar_etapa_template).
   c) Verifique se as tarefas existem no dicionário (listar_tarefas_globais). Se não, crie as tarefas vinculadas à etapa global (criar_tarefa_global).
   d) Adicione a tarefa à etapa do template (criar_tarefa_template).
   e) Se o template tiver cálculos ou valores base, crie as variáveis paramétricas dele (criar_template_variavel).
Você tem permissão e o DEVER de realizar todos esses passos em sequência para entregar o template pronto.`,
        inputSchema: {
          type: "object",
          properties: {
            nome: { type: "string" },
            descricao: { type: "string" },
            ativo: { type: "boolean" },
          },
          required: ["nome", "ativo"],
        },
      },
      {
        name: "atualizar_template",
        description: "Atualiza um template existente",
        inputSchema: {
          type: "object",
          properties: {
            id: { type: "string" },
            nome: { type: "string" },
            descricao: { type: "string" },
            ativo: { type: "boolean" },
          },
          required: ["id"],
        },
      },
      {
        name: "deletar_template",
        description: "Deleta o template raiz (Isso excluirá em cascata todas as etapas, tarefas e variáveis associadas)",
        inputSchema: {
          type: "object",
          properties: { id: { type: "string" } },
          required: ["id"],
        },
      },
      {
        name: "listar_template_variaveis",
        description: "Lista as variáveis paramétricas de um template",
        inputSchema: {
          type: "object",
          properties: { template_id: { type: "string" } },
          required: ["template_id"],
        },
      },
      {
        name: "criar_template_variavel",
        description: "Cria uma variável paramétrica para o template (ex: codigo 'AREA_PISCINA')",
        inputSchema: {
          type: "object",
          properties: {
            template_id: { type: "string" },
            codigo: { type: "string" },
            nome: { type: "string" },
            valor_padrao: { type: "number" },
          },
          required: ["template_id", "codigo", "nome"],
        },
      },
      {
        name: "atualizar_template_variavel",
        description: "Atualiza uma variável paramétrica de um template",
        inputSchema: {
          type: "object",
          properties: {
            id: { type: "string" },
            codigo: { type: "string" },
            nome: { type: "string" },
            valor_padrao: { type: "number" },
          },
          required: ["id"],
        },
      },
      {
        name: "deletar_template_variavel",
        description: "Deleta uma variável paramétrica de um template",
        inputSchema: {
          type: "object",
          properties: { id: { type: "string" } },
          required: ["id"],
        },
      },
      {
        name: "listar_etapas_globais",
        description: "Lista o dicionário global de etapas (fases da obra)",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "criar_etapa_global",
        description: "Adiciona uma nova etapa ao dicionário global do ERP",
        inputSchema: {
          type: "object",
          properties: {
            nome: { type: "string" },
            descricao: { type: "string" },
            ordem_padrao: { type: "number" },
            status: { type: "boolean" },
          },
          required: ["nome"],
        },
      },
      {
        name: "listar_tarefas_globais",
        description: "Lista o dicionário global de tarefas (serviços)",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "criar_tarefa_global",
        description: "Adiciona uma nova tarefa ao dicionário global vinculada a uma etapa global",
        inputSchema: {
          type: "object",
          properties: {
            etapa_global_id: { type: "string" },
            nome: { type: "string" },
            descricao: { type: "string" },
            unidade: { type: "string" },
            ordem: { type: "number" },
            ativo: { type: "boolean" },
          },
          required: ["etapa_global_id", "nome", "unidade"],
        },
      },
      {
        name: "criar_etapa_template",
        description: `Adiciona uma etapa dentro de um template.
REGRA: A etapa não é criada com uma string solta. Você OBRIGATORIAMENTE precisa do 'etapa_global_id'.
Se a etapa que você precisa (ex: 'Fundação') não existir no dicionário (use listar_etapas_globais para checar), você DEVE criar ela primeiro usando a ferramenta 'criar_etapa_global' e usar o ID gerado aqui.`,
        inputSchema: {
          type: "object",
          properties: {
            id: { type: "string", description: "ID do Template" },
            etapa_global_id: { type: "string", description: "ID da Etapa Global" },
          },
          required: ["id", "etapa_global_id"],
        },
      },
      {
        name: "deletar_etapa_template",
        description: "Remove uma etapa do template",
        inputSchema: {
          type: "object",
          properties: {
            id: { type: "string" },
            etapa_id: { type: "string" },
          },
          required: ["id", "etapa_id"],
        },
      },
      {
        name: "criar_tarefa_template",
        description: `Adiciona uma tarefa dentro de uma etapa de um template.
REGRA: Assim como a etapa, a tarefa OBRIGATORIAMENTE exige o 'tarefa_global_id'.
Além disso, a Tarefa Global DEVE pertencer à mesma Etapa Global da etapa do template onde está sendo inserida.
Se não existir, crie-a com 'criar_tarefa_global' garantindo que o 'etapa_global_id' seja o mesmo.`,
        inputSchema: {
          type: "object",
          properties: {
            id: { type: "string" },
            etapa_id: { type: "string" },
            tarefa_global_id: { type: "string" },
          },
          required: ["id", "etapa_id", "tarefa_global_id"],
        },
      },
      {
        name: "deletar_tarefa_template",
        description: "Remove uma tarefa de uma etapa do template",
        inputSchema: {
          type: "object",
          properties: {
            id: { type: "string" },
            etapa_id: { type: "string" },
            tarefa_id: { type: "string" },
          },
          required: ["id", "etapa_id", "tarefa_id"],
        },
      },
      {
        name: "vincular_especificacao_tarefa_template",
        description: "Vincula uma especificação global a uma tarefa do template e define os cálculos. Você PODE usar o código das variáveis criadas na propriedade 'formula'.",
        inputSchema: {
          type: "object",
          properties: {
            id: { type: "string" },
            etapa_id: { type: "string" },
            tarefa_id: { type: "string" },
            especificacao_global_id: { type: "string" },
            quantidade_base: { type: "number" },
            fator_perda: { type: "number" },
            ordem: { type: "number" },
            obrigatoria: { type: "boolean" },
            formula: { type: "string", description: "Fórmula de cálculo. Ex: AREA_PISCINA * 1.5" },
          },
          required: ["id", "etapa_id", "tarefa_id", "especificacao_global_id"],
        },
      },
      {
        name: "desvincular_especificacao_tarefa_template",
        description: "Remove uma especificação de uma tarefa do template",
        inputSchema: {
          type: "object",
          properties: {
            id: { type: "string" },
            etapa_id: { type: "string" },
            tarefa_id: { type: "string" },
            vinculo_id: { type: "string" },
          },
          required: ["id", "etapa_id", "tarefa_id", "vinculo_id"],
        },
      },
      {
        name: "criar_material",
        description: "Cria um novo material no catálogo",
        inputSchema: {
          type: "object",
          properties: {
            nome: { type: "string" },
            unidade_medida: { type: "string" },
            preco_unitario: { type: "number" },
            categoria: { type: "string" },
            ativo: { type: "boolean" },
          },
          required: ["nome", "unidade_medida", "preco_unitario"],
        },
      },
      {
        name: "obter_material",
        description: "Obtém os detalhes de um material do catálogo",
        inputSchema: {
          type: "object",
          properties: { material_id: { type: "string" } },
          required: ["material_id"],
        },
      },
      {
        name: "atualizar_material",
        description: "Atualiza um material no catálogo",
        inputSchema: {
          type: "object",
          properties: {
            material_id: { type: "string" },
            nome: { type: "string" },
            unidade_medida: { type: "string" },
            preco_unitario: { type: "number" },
            categoria: { type: "string" },
            ativo: { type: "boolean" },
          },
          required: ["material_id"],
        },
      },
      {
        name: "deletar_material",
        description: "Deleta um material do catálogo",
        inputSchema: {
          type: "object",
          properties: { material_id: { type: "string" } },
          required: ["material_id"],
        },
      },
      {
        name: "listar_especificacoes_globais",
        description: "Lista especificações globais cadastradas",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "obter_especificacao_global",
        description: "Obtém detalhes de uma especificação global",
        inputSchema: {
          type: "object",
          properties: { id: { type: "string" } },
          required: ["id"],
        },
      },
      {
        name: "criar_especificacao_global",
        description: "Cria uma nova especificação global",
        inputSchema: {
          type: "object",
          properties: {
            nome: { type: "string" },
            descricao: { type: "string" },
            ativo: { type: "boolean" },
          },
          required: ["nome", "ativo"],
        },
      },
      {
        name: "atualizar_especificacao_global",
        description: "Atualiza uma especificação global",
        inputSchema: {
          type: "object",
          properties: {
            id: { type: "string" },
            nome: { type: "string" },
            descricao: { type: "string" },
            ativo: { type: "boolean" },
          },
          required: ["id"],
        },
      },
      {
        name: "deletar_especificacao_global",
        description: "Deleta uma especificação global",
        inputSchema: {
          type: "object",
          properties: { id: { type: "string" } },
          required: ["id"],
        },
      },
      {
        name: "listar_materiais_especificacao_global",
        description: "Lista os materiais de uma especificação global",
        inputSchema: {
          type: "object",
          properties: { id: { type: "string" } },
          required: ["id"],
        },
      },
      {
        name: "vincular_material_especificacao_global",
        description: "Vincula um material a uma especificação global com quantidade padrão",
        inputSchema: {
          type: "object",
          properties: {
            id: { type: "string" },
            material_id: { type: "string" },
            quantidade_padrao: { type: "number" },
          },
          required: ["id", "material_id", "quantidade_padrao"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "listar_materiais_tarefa": {
        const { tarefaId, ...rest } = args as any;
        const res = await api.get(`/projeto-tarefas/${tarefaId}/materiais`, { params: rest });
        return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
      }
      case "vincular_material_tarefa": {
        const { tarefaId, ...payload } = args as any;
        const res = await api.post(`/projeto-tarefas/${tarefaId}/materiais`, payload);
        return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
      }
      case "listar_notas_fiscais": {
        const res = await api.get("/notas-fiscais", { params: args });
        return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
      }
      case "criar_nota_fiscal": {
        const res = await api.post("/notas-fiscais", args);
        return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
      }
      case "listar_templates": {
        const res = await api.get("/templates");
        return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
      }
      case "obter_template": {
        const res = await api.get(`/templates/${args?.id}`);
        return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
      }
      case "criar_template": {
        const res = await api.post("/templates", args);
        return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
      }
      case "atualizar_template": {
        const { id, ...payload } = args as any;
        const res = await api.put(`/templates/${id}`, payload);
        return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
      }
      case "deletar_template": {
        await api.delete(`/templates/${args?.id}`);
        return { content: [{ type: "text", text: "Template deletado com sucesso. Todos os registros vinculados foram apagados em cascata." }] };
      }
      case "listar_template_variaveis": {
        const res = await api.get(`/template-variaveis/template/${args?.template_id}`);
        return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
      }
      case "criar_template_variavel": {
        const { template_id, ...payload } = args as any;
        const res = await api.post(`/template-variaveis/template/${template_id}`, payload);
        return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
      }
      case "atualizar_template_variavel": {
        const { id, ...payload } = args as any;
        const res = await api.put(`/template-variaveis/${id}`, payload);
        return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
      }
      case "deletar_template_variavel": {
        await api.delete(`/template-variaveis/${args?.id}`);
        return { content: [{ type: "text", text: "Variável deletada com sucesso" }] };
      }
      case "listar_etapas_globais": {
        const res = await api.get("/etapas-globais", { params: args });
        return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
      }
      case "criar_etapa_global": {
        const res = await api.post("/etapas-globais", args);
        return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
      }
      case "listar_tarefas_globais": {
        const res = await api.get("/tarefas-globais", { params: args });
        return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
      }
      case "criar_tarefa_global": {
        const res = await api.post("/tarefas-globais", args);
        return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
      }
      case "criar_etapa_template": {
        const { id, etapa_global_id } = args as any;
        const res = await api.post(`/templates/${id}/etapas`, null, { params: { etapa_global_id } });
        return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
      }
      case "deletar_etapa_template": {
        const { id, etapa_id } = args as any;
        await api.delete(`/templates/${id}/etapas/${etapa_id}`);
        return { content: [{ type: "text", text: "Etapa deletada do template com sucesso" }] };
      }
      case "criar_tarefa_template": {
        const { id, etapa_id, tarefa_global_id } = args as any;
        const res = await api.post(`/templates/${id}/etapas/${etapa_id}/tarefas`, null, { params: { tarefa_global_id } });
        return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
      }
      case "deletar_tarefa_template": {
        const { id, etapa_id, tarefa_id } = args as any;
        await api.delete(`/templates/${id}/etapas/${etapa_id}/tarefas/${tarefa_id}`);
        return { content: [{ type: "text", text: "Tarefa deletada do template com sucesso" }] };
      }
      case "vincular_especificacao_tarefa_template": {
        const { id, etapa_id, tarefa_id, ...payload } = args as any;
        const res = await api.post(`/templates/${id}/etapas/${etapa_id}/tarefas/${tarefa_id}/especificacoes`, payload);
        return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
      }
      case "desvincular_especificacao_tarefa_template": {
        const { id, etapa_id, tarefa_id, vinculo_id } = args as any;
        await api.delete(`/templates/${id}/etapas/${etapa_id}/tarefas/${tarefa_id}/especificacoes/${vinculo_id}`);
        return { content: [{ type: "text", text: "Especificação desvinculada com sucesso" }] };
      }
      case "criar_material": {
        const res = await api.post("/materiais", args);
        return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
      }
      case "obter_material": {
        const res = await api.get(`/materiais/${args?.material_id}`);
        return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
      }
      case "atualizar_material": {
        const { material_id, ...payload } = args as any;
        const res = await api.put(`/materiais/${material_id}`, payload);
        return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
      }
      case "deletar_material": {
        await api.delete(`/materiais/${args?.material_id}`);
        return { content: [{ type: "text", text: "Material deletado com sucesso" }] };
      }
      case "listar_especificacoes_globais": {
        const res = await api.get("/especificacoes-globais");
        return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
      }
      case "obter_especificacao_global": {
        const res = await api.get(`/especificacoes-globais/${args?.id}`);
        return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
      }
      case "criar_especificacao_global": {
        const res = await api.post("/especificacoes-globais", args);
        return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
      }
      case "atualizar_especificacao_global": {
        const { id, ...payload } = args as any;
        const res = await api.put(`/especificacoes-globais/${id}`, payload);
        return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
      }
      case "deletar_especificacao_global": {
        await api.delete(`/especificacoes-globais/${args?.id}`);
        return { content: [{ type: "text", text: "Especificação global deletada com sucesso" }] };
      }
      case "listar_materiais_especificacao_global": {
        const res = await api.get(`/especificacoes-globais/${args?.id}/materiais`);
        return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
      }
      case "vincular_material_especificacao_global": {
        const { id, ...payload } = args as any;
        const res = await api.post(`/especificacoes-globais/${id}/materiais`, payload);
        return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
      }
      default:
        try {
          return await registry.executeTool(name, args);
        } catch (err: any) {
          if (err.message.startsWith("Tool unknown")) {
             throw new Error(`Tool unknown: ${name}`);
          }
          throw err;
        }
    }
  } catch (error: any) {
    const errorMsg = error.response?.data ? JSON.stringify(error.response.data) : error.message;
    return {
      content: [{ type: "text", text: `Erro ao executar ${name}: ${errorMsg}` }],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Cadastro Pessoas MCP Server running on stdio");
}

main().catch(console.error);
