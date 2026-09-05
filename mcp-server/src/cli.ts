#!/usr/bin/env node
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

async function main() {
  console.log("=========================================");
  console.log("  MCP GoObras - Assistente de Instalação  ");
  console.log("=========================================\n");
  
  let token = process.argv[2];
  if (!token) {
    token = await question("Digite o seu ERP_TOKEN: ");
  }

  let apiUrl = process.argv[3];
  if (!apiUrl) {
    const defaultApiUrl = "https://goobras-api.fglabs.com.br/v1";
    const answer = await question(`Digite a URL da API (padrão: ${defaultApiUrl}): `);
    apiUrl = answer.trim() || defaultApiUrl;
  }

  if (!token) {
    console.error("\nErro: ERP_TOKEN é obrigatório.");
    rl.close();
    process.exit(1);
  }

  console.log("\nPara qual Assistente/IDE você quer configurar o MCP?");
  console.log("1) Claude Desktop");
  console.log("2) Antigravity IDE (Gemini)");
  console.log("3) Cursor / Outros (Instruções Manuais)");
  const ideChoice = await question("\nEscolha uma opção [1-3]: ");

  const isWindows = os.platform() === 'win32';
  const isMac = os.platform() === 'darwin';

  if (ideChoice === '3') {
    console.log("\n=========================================");
    console.log("INSTRUÇÕES PARA O CURSOR / OUTROS CLIENTES");
    console.log("=========================================");
    console.log("A maioria das extensões do VS Code ou configurações no Cursor (como Settings > Features > MCP) precisam ser cadastradas manualmente pela interface.\n");
    console.log("\nCopie e cole as informações abaixo no painel de Adicionar Servidor MCP:");
    console.log(`\nNome: mcp-goobras`);
    console.log(`Tipo: command`);
    console.log(`Comando: node`);
    console.log(`Argumentos: ${path.join(process.cwd(), "dist", "index.js")}`);
    console.log(`\nVariáveis de Ambiente (Env):`);
    console.log(`ERP_TOKEN = ${token}`);
    console.log(`ERP_API_URL = ${apiUrl}`);
    console.log("=========================================\n");
    rl.close();
    return;
  }

  function getWindowsClaudeConfigPaths(): string[] {
    const paths = [];
    paths.push(path.join(process.env.APPDATA || "", "Claude", "claude_desktop_config.json"));
    
    // Verifica a versão instalada pela Windows Store (MSIX/AppX isolado)
    const localAppData = process.env.LOCALAPPDATA || "";
    const packagesDir = path.join(localAppData, "Packages");
    
    if (fs.existsSync(packagesDir)) {
      const dirs = fs.readdirSync(packagesDir);
      const claudeDir = dirs.find(d => d.startsWith("Claude_"));
      if (claudeDir) {
        paths.push(path.join(packagesDir, claudeDir, "LocalCache", "Roaming", "Claude", "claude_desktop_config.json"));
      }
    }
    return paths;
  }

  let configPaths: string[] = [];
  if (ideChoice === '1') {
    // Claude Desktop
    if (isWindows) {
      configPaths = getWindowsClaudeConfigPaths();
    } else if (isMac) {
      configPaths.push(path.join(os.homedir(), "Library", "Application Support", "Claude", "claude_desktop_config.json"));
    }
  } else if (ideChoice === '2') {
    // Antigravity IDE
    if (isWindows) {
      configPaths.push(path.join(os.homedir(), ".gemini", "config", "mcp_config.json"));
    } else if (isMac) {
      configPaths.push(path.join(os.homedir(), ".gemini", "config", "mcp_config.json"));
    }
  }

  if (configPaths.length === 0) {
    console.log("\nSistema operacional não suportado nativamente para configuração automática desta IDE.");
    rl.close();
    return;
  }

  for (const configPath of configPaths) {
    try {
      let config: any = { mcpServers: {} };
      if (fs.existsSync(configPath)) {
        const content = fs.readFileSync(configPath, "utf-8");
        if (content.trim()) {
          try {
            config = JSON.parse(content);
          } catch (e) {
            console.warn(`\nAviso: O arquivo de configuração em ${configPath} estava mal formatado. Um novo será gerado.`);
          }
        }
        if (!config.mcpServers) config.mcpServers = {};
      } else {
        const dir = path.dirname(configPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
      }

      // Obtém o caminho absoluto da pasta atual (mcp-server) e aponta para o dist/index.js
      const scriptPath = path.join(process.cwd(), "dist", "index.js");

      config.mcpServers["mcp-goobras"] = {
        command: "node",
        args: [scriptPath],
        env: {
          ERP_TOKEN: token,
          ERP_API_URL: apiUrl
        }
      };

      fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");
      console.log(`\n✅ Sucesso! Configuração salva em:`);
      console.log(`   ${configPath}`);

    } catch (error: any) {
      console.error(`\n❌ Erro ao salvar configuração no arquivo ${configPath}:`, error.message);
    }
  }
  
  console.log("\n⚠️ IMPORTANTE: Por favor, reinicie sua IDE/Assistente para aplicar as alterações.");

  rl.close();
}

main().catch(err => {
  console.error(err);
  rl.close();
});
