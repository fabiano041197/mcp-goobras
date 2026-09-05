import "process";

export const config = {
  API_URL: process.env.ERP_API_URL || "https://goobras-api.fglabs.com.br/v1",
  TOKEN: process.env.ERP_TOKEN,
};

if (!config.TOKEN) {
  console.error("Erro: Token não fornecido. Defina a variável de ambiente ERP_TOKEN.");
  process.exit(1);
}
