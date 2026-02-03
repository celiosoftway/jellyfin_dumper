
---

# Jellyfin Catalog Dumper

Script em Node.js para extrair metadados de bibliotecas em servidores Jellyfin, sem baixar mídia.

Gera arquivos JSON e CSV contendo:

* título
* título original
* ano de lançamento
* tipo (Series/Movie)
* categoria (dublado/legendado/etc)
* IDs AniList / MyAnimeList (quando disponíveis)

Ideal para criar um catálogo pessoal de acervos grandes (especialmente anime retrô).

---

## ✨ Features

* Compatível com contas não-admin (usa token de sessão)
* Suporte a múltiplas coleções (`topParentId`)
* Execução seletiva por coleção ou completa
* Exportação em JSON e CSV
* Token via variável de ambiente
* Pasta dedicada de output (ignorável no Git)
* CommonJS (Node clássico)

---

## 📁 Estrutura

```
.
├─ dump-jellyfin.cjs
├─ .env              (opcional)
├─ .gitignore
└─ output/
```

Arquivos gerados:

```
output/anime_<colecao>.json
output/anime_<colecao>.csv
```

---

## ⚙️ Requisitos

* Node.js 18+

(Se estiver no Node 16, instale `node-fetch@2` e faça o require manual.)

---

## 🚀 Setup

### 1. Clone o repositório

```
git clone <repo>
cd <repo>
```

---

### 2. Dependência opcional

Apenas se for usar `.env`:

```
npm install dotenv
```

---

### 3. Configure o token Jellyfin

Você precisa do token da sua sessão Jellyfin.

No navegador:

1. Abra o Jellyfin
2. Pressione F12
3. Vá em Network
4. Recarregue a página
5. Abra qualquer request
6. Copie o header:

   X-Emby-Token

---

### Opção A — variável de ambiente

Linux / Mac:

```
export JELLYFIN_TOKEN=SEU_TOKEN
```

Windows PowerShell:

```
setx JELLYFIN_TOKEN "SEU_TOKEN"
```

(Reabra o terminal depois.)

---

### Opção B — arquivo `.env`

Crie um arquivo `.env`:

```
JELLYFIN_TOKEN=SEU_TOKEN
```

---

## ▶️ Uso

### Listar coleções disponíveis

```
node dump-jellyfin.cjs
```

---

### Exportar tudo

```
node dump-jellyfin.cjs all
```

---

### Exportar coleção específica

Exemplos:

```
node app.js series_dubladas

node app.js filmes_legendados
```

Coleções padrão:

* series_dubladas
* series_legendadas
* filmes_dublados
* filmes_legendados
* exibicao

---

## 📤 Output

Arquivos são gerados em:

```
/output
```

Formato:

* anime_<colecao>.json
* anime_<colecao>.csv

Campos:

* categoria
* id_local
* titulo
* titulo_original
* ano
* tipo
* anilist
* mal

---

## 🔐 Segurança

* Nunca versione seu token
* `.env` e `/output` devem estar no `.gitignore`
* Após uso, é recomendado fazer logout/login no Jellyfin para invalidar o token

---

## 💡 Próximos upgrades (idéias)

* Export direto para SQLite
* Deduplicação entre dublado/legendado
* Lookup automático via AniList
* Execução incremental
* Snapshots por data

---

## 📜 Licença

Uso pessoal / educacional.

Adapte livremente.
