
# NINOFFZ

Painel web responsivo com tema azul. Para usuários, a navegação contém somente **Auxílio** e **Sobre**; o acesso administrativo mantém a área de gestão de keys.

## MockAPI

O backend está apontado para a collection informada: `https://69b9908ce69653ffe6a81689.mockapi.io/api/v1/Scy`. A collection respondeu com HTTP 200 e lista vazia na verificação inicial; por isso, não foi possível conferir o schema existente e nenhum registro foi criado ou alterado.

Para gerar e administrar keys, configure o resource `Scy` com os campos abaixo (o `id` deve continuar sendo o Object ID automático do MockAPI):

| Campo | Tipo | Uso |
| --- | --- | --- |
| `key` | String | Key de acesso gerada |
| `username` | String | Nome exibido na lista administrativa |
| `used` | Boolean | Marca ativação |
| `device` | String | HWID vinculado |
| `expire` | Number | Duração configurada |
| `type` | String | Plano (`hourly`, `weekly`, `daily`, `perm` etc.) |
| `createdAt` | Number | Criação em Unix seconds |
| `activatedAt` | Number | Primeira ativação em Unix seconds |
| `expiresAt` | Number | Expiração em Unix seconds |
| `status` | String | Estado (`active`, `revoked` ou `blocked`) |
| `onlineAt` | Number | Último acesso em Unix seconds |

`username` e `status` são importantes para a apresentação e o gerenciamento no Admin. Se o resource tiver apenas os campos básicos de keys, acrescente os que faltam antes de testar geração, bloqueio ou revogação. O histórico de sensibilidade não é necessário nas duas páginas disponibilizadas aos usuários.

## Chave administrativa e deploy

Configure `RBXIS_ADMIN_KEY` e `RBXIS_SESSION_SECRET` como variáveis privadas na Vercel; o código não contém chaves ou segredos de fallback e desativa o login se estiverem ausentes. Use uma string aleatória longa para o segredo de sessão. Opcionalmente, `DISCORD_ADMIN_LOGIN_WEBHOOK` envia um aviso privado quando a tentativa de login Admin é inválida. Não coloque valores reais de segredos no repositório.

A aplicação usa a função serverless `api/trpc.ts` na Vercel. Em desenvolvimento, copie `.env.example` para `.env`, instale dependências com `pnpm install` e execute `pnpm dev`. Para verificar, use `pnpm check`, `pnpm test` e `pnpm build`.

O convite do Discord na página Sobre é `https://discord.gg/bgSrEknD4d`. O logo fornecido pelo proprietário está em `client/public/ninoffz-brand.png`; o PWA usa ícones de `192×192` e `512×512` em `client/public/ninoffz-mark-192.png` e `client/public/ninoffz-mark.png`.
