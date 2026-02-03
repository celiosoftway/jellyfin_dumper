require("dotenv").config();
const fs = require("fs");
const path = require("path");

const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.JELLYFIN_TOKEN;

if (!TOKEN) {
  console.error("Variável JELLYFIN_TOKEN não definida.");
  process.exit(1);
}

// pasta de saída
const OUTPUT_DIR = path.join(__dirname, "output");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

// coleções
const COLLECTIONS = {
  series_dubladas: {
    id: "86913b6f21dc04b49242466080e7c96a",
    types: "Series"
  },
  series_legendadas: {
    id: "ee6073f1808cbf0c1e4b8ddb78430a81",
    types: "Series"
  },
  filmes_dublados: {
    id: "d927e7caf696c4d595be3a4bd56f865a",
    types: "Movie"
  },
  filmes_legendados: {
    id: "987d734df50c20bc21c1eb1df70ff079",
    types: "Movie"
  },
  exibicao: {
    id: "3a7ae76ab6ec93f63b19b793ebc9411b",
    types: "Series"
  }
};

// ========================================

const arg = process.argv[2];

if (!arg) {
  console.log("\nUso:");
  console.log(" node app.js all");
  console.log(" node app.js series_dubladas\n");
  console.log("Coleções:");
  Object.keys(COLLECTIONS).forEach(k => console.log(" -", k));
  process.exit(0);
}

const SELECTED =
  arg === "all"
    ? Object.entries(COLLECTIONS).map(([name, cfg]) => ({
        name,
        ...cfg
      }))
    : COLLECTIONS[arg]
    ? [{ name: arg, ...COLLECTIONS[arg] }]
    : null;

if (!SELECTED) {
  console.error("Coleção inválida:", arg);
  process.exit(1);
}

// ========================================

async function fetchCollection(collection) {
  const url =
    `${BASE_URL}/Items` +
    `?ParentId=${collection.id}` +
    `&Recursive=true` +
    `&IncludeItemTypes=${collection.types}` +
    `&Fields=ProductionYear,OriginalTitle,ProviderIds`;

  const res = await fetch(url, {
    headers: {
      "X-Emby-Token": TOKEN
    }
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Erro ${collection.name}: ${res.status}\n${txt}`);
  }

  const json = await res.json();

  return (json.Items || []).map(i => ({
    categoria: collection.name,
    id_local: i.Id,
    titulo: i.Name || "",
    titulo_original: i.OriginalTitle || "",
    ano: i.ProductionYear || "",
    tipo: i.Type || "",
    anilist: i.ProviderIds?.AniList || "",
    mal: i.ProviderIds?.MyAnimeList || ""
  }));
}

function toCSV(rows) {
  if (!rows.length) return "";

  const headers = Object.keys(rows[0]);

  return [
    headers.join(","),
    ...rows.map(r =>
      headers
        .map(h => `"${String(r[h] ?? "").replace(/"/g, '""')}"`)
        .join(",")
    )
  ].join("\n");
}

async function main() {
  let all = [];

  for (const col of SELECTED) {
    console.log("Coletando:", col.name);
    const items = await fetchCollection(col);
    console.log(`  -> ${items.length}`);
    all.push(...items);
  }

  if (!all.length) {
    console.log("Nada encontrado.");
    return;
  }

  const suffix = arg === "all" ? "all" : arg;

  const jsonPath = path.join(OUTPUT_DIR, `anime_${suffix}.json`);
  const csvPath = path.join(OUTPUT_DIR, `anime_${suffix}.csv`);

  fs.writeFileSync(jsonPath, JSON.stringify(all, null, 2));
  fs.writeFileSync(csvPath, toCSV(all));

  console.log("\nGerado:");
  console.log(jsonPath);
  console.log(csvPath);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
