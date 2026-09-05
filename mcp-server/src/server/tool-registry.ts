import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

export type ToolHandler<T = any> = (args: T) => Promise<any>;

export interface RegisteredTool<T extends z.ZodTypeAny> {
  name: string;
  description: string;
  schema: T;
  handler: ToolHandler<z.infer<T>>;
}

export class ToolRegistry {
  private tools: Map<string, RegisteredTool<any>> = new Map();

  register<T extends z.ZodTypeAny>(
    name: string,
    description: string,
    schema: T,
    handler: ToolHandler<z.infer<T>>
  ) {
    this.tools.set(name, { name, description, schema, handler });
  }

  getToolList() {
    return Array.from(this.tools.values()).map((tool) => ({
      name: tool.name,
      description: tool.description,
      inputSchema: zodToJsonSchema(tool.schema),
    }));
  }

  async executeTool(name: string, args: any) {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new Error(`Tool unknown: ${name}`);
    }

    // Validação estrita em runtime
    const parsedArgs = tool.schema.parse(args);
    return tool.handler(parsedArgs);
  }
}

// Registry global instanciado
export const registry = new ToolRegistry();
