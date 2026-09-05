import { describe, it, expect } from "vitest";
import { registry } from "../../src/server/tool-registry.js";
import "../../src/modules/clients/index.js";
import "../../src/modules/projects/index.js";
import "../../src/modules/materials/index.js";

describe("Integração com API de Produção", () => {
  it("deve conseguir listar clientes do ERP remotamente", async () => {
    // Executa a tool listar_clientes mapeada no MCP
    const result = await registry.executeTool("listar_clientes", { limit: 10 });
    
    expect(result).toBeDefined();
    expect(result.content).toBeDefined();
    expect(result.content[0].type).toBe("text");
    
    // O texto retornado é um JSON stringificado
    const data = JSON.parse(result.content[0].text);
    // Verificamos se possui a estrutura esperada
    expect(data).toHaveProperty("data");
    expect(data).toHaveProperty("meta");
  });

  it("deve conseguir listar projetos do ERP remotamente", async () => {
    const result = await registry.executeTool("listar_projetos", { limit: 10 });
    const data = JSON.parse(result.content[0].text);
    
    expect(data).toHaveProperty("data");
    expect(data).toHaveProperty("meta");
    expect(Array.isArray(data.data)).toBe(true);
  });

  it("deve falhar a validação Zod antes de atingir a API caso envie parâmetros errados", async () => {
    await expect(
      registry.executeTool("listar_materiais", { limit: "dez" })
    ).rejects.toThrow();
  });
});
