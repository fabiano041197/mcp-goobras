import { describe, it, expect } from "vitest";
import { z } from "zod";
import { ToolRegistry } from "../../src/server/tool-registry.js";

describe("ToolRegistry (Looping Engineering)", () => {
  it("deve registrar e retornar a lista de ferramentas com schemas JSON válidos", () => {
    const registry = new ToolRegistry();

    registry.register(
      "test_tool",
      "Ferramenta de teste",
      z.object({ mock_field: z.string() }),
      async (args) => args
    );

    const tools = registry.getToolList();
    expect(tools).toHaveLength(1);
    expect(tools[0].name).toBe("test_tool");
    expect(tools[0].inputSchema).toBeDefined();
  });

  it("deve executar a função handler se o payload for válido pelo Zod", async () => {
    const registry = new ToolRegistry();

    registry.register(
      "soma",
      "Soma dois números",
      z.object({ a: z.number(), b: z.number() }),
      async ({ a, b }) => a + b
    );

    const result = await registry.executeTool("soma", { a: 5, b: 3 });
    expect(result).toBe(8);
  });

  it("deve falhar rapidamente (fail-fast) ao receber um payload inválido", async () => {
    const registry = new ToolRegistry();

    registry.register(
      "soma",
      "Soma dois números",
      z.object({ a: z.number(), b: z.number() }),
      async ({ a, b }) => a + b
    );

    // Mandamos uma string onde esperava um number
    await expect(registry.executeTool("soma", { a: 5, b: "3" })).rejects.toThrow();
  });
});
