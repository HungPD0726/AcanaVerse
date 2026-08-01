import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const mirrorRoot =
  "https://raw.githubusercontent.com/mixvlad/TarotCards/main/tarot";
const metadataUrls = {
  "tarot-de-marseille": `${mirrorRoot}/marseille/metadata.json`,
  "sola-busca": `${mirrorRoot}/sola-busca/metadata.json`,
};
const publicDomainUrl =
  "https://creativecommons.org/publicdomain/mark/1.0/";

const majorSlugs = [
  "the-fool",
  "the-magician",
  "the-high-priestess",
  "the-empress",
  "the-emperor",
  "the-hierophant",
  "the-lovers",
  "the-chariot",
  "strength",
  "the-hermit",
  "wheel-of-fortune",
  "justice",
  "the-hanged-man",
  "death",
  "temperance",
  "the-devil",
  "the-tower",
  "the-star",
  "the-moon",
  "the-sun",
  "judgement",
  "the-world",
];

const rankSlugs = [
  "ace",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "page",
  "knight",
  "queen",
  "king",
];

const suitKeys = ["wands", "cups", "swords", "pentacles"];
const marseilleSuitLetters = {
  wands: "B",
  cups: "C",
  swords: "S",
  pentacles: "P",
};
const marseilleCourtLetters = {
  page: "H",
  knight: "J",
  queen: "Q",
  king: "K",
};
const solaBuscaSuitStarts = {
  cups: 22,
  pentacles: 36,
  swords: 50,
  wands: 64,
};

const wait = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

async function fetchWithRetry(url, attempt = 0) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "ArcanaVerse/0.1 (local educational project)",
    },
  });

  if ((response.status === 429 || response.status >= 500) && attempt < 5) {
    await wait(1_000 * 2 ** attempt);
    return fetchWithRetry(url, attempt + 1);
  }

  if (!response.ok) {
    throw new Error(`Download failed (${response.status}): ${url}`);
  }

  return response;
}

async function readMetadata(deckSlug) {
  const response = await fetchWithRetry(metadataUrls[deckSlug]);
  const metadata = await response.json();

  if (metadata.cards?.length !== 78) {
    throw new Error(`${deckSlug} metadata does not contain 78 cards.`);
  }

  for (const card of metadata.cards) {
    const license = String(card.license).toLowerCase();
    if (!license.includes("public domain") && !license.includes("cc0")) {
      throw new Error(
        `${deckSlug}/${card.card} has an unsupported license: ${card.license}`,
      );
    }
  }

  return metadata;
}

function marseilleMappings(metadata) {
  const bySourceFile = new Map(
    metadata.cards.map((card) => [card.source_file, card]),
  );
  const historicalTrumpNumber = (rwsNumber) => {
    if (rwsNumber === 8) return 11;
    if (rwsNumber === 11) return 8;
    return rwsNumber;
  };
  const major = majorSlugs.map((slug, index) => {
    const number = historicalTrumpNumber(index);
    const sourceFile = number === 0 ? "TT Tarot.png" : `T${number} Tarot.png`;
    return { slug, source: bySourceFile.get(sourceFile) };
  });
  const minor = suitKeys.flatMap((suit) =>
    rankSlugs.map((rank, index) => {
      const rankNumber = index + 1;
      const rankPrefix =
        rankNumber <= 10 ? String(rankNumber) : marseilleCourtLetters[rank];
      const sourceFile = `${rankPrefix}${marseilleSuitLetters[suit]} Tarot.png`;
      return {
        slug: `${rank}-of-${suit}`,
        source: bySourceFile.get(sourceFile),
      };
    }),
  );

  return [...major, ...minor];
}

function solaBuscaMappings(metadata) {
  const byNumber = new Map(
    metadata.cards.map((card) => [
      Number(path.basename(card.card, path.extname(card.card))),
      card,
    ]),
  );
  const major = majorSlugs.map((slug, index) => ({
    slug,
    source: byNumber.get(index),
  }));
  const minor = suitKeys.flatMap((suit) =>
    rankSlugs.map((rank, index) => ({
      slug: `${rank}-of-${suit}`,
      source: byNumber.get(solaBuscaSuitStarts[suit] + index),
    })),
  );

  return [...major, ...minor];
}

async function downloadAndOptimize(deckSlug, sourceFolder, item) {
  if (!item.source) {
    throw new Error(`${deckSlug}/${item.slug} has no mapped source file.`);
  }

  const outputDirectory = path.join(
    process.cwd(),
    "public",
    "images",
    "decks",
    deckSlug,
  );
  const outputPath = path.join(outputDirectory, `${item.slug}.webp`);

  try {
    await access(outputPath);
  } catch {
    const encodedFilename = item.source.card
      .split("/")
      .map(encodeURIComponent)
      .join("/");
    const imageUrl = `${mirrorRoot}/${sourceFolder}/full/${encodedFilename}`;
    const response = await fetchWithRetry(imageUrl);
    const input = Buffer.from(await response.arrayBuffer());

    await sharp(input)
      .resize({ width: 480, withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 })
      .toFile(outputPath);
  }

  return {
    slug: item.slug,
    sourceFile: item.source.source_file,
    path: `/images/decks/${deckSlug}/${item.slug}.webp`,
    sourcePage: item.source.source_url,
    sourceWidth: item.source.width,
    sourceHeight: item.source.height,
    license: "Public Domain Mark 1.0",
    licenseUrl: publicDomainUrl,
  };
}

const deckConfigs = [
  {
    slug: "tarot-de-marseille",
    sourceFolder: "marseille",
    map: marseilleMappings,
    artist: "Traditional Tarot de Marseille artwork",
    period: "17th–18th century tradition",
    sourceCategory:
      "https://commons.wikimedia.org/wiki/Category:Tarot_de_Marseille_(Single_Cards)",
  },
  {
    slug: "sola-busca",
    sourceFolder: "sola-busca",
    map: solaBuscaMappings,
    artist: "Sola Busca, attributed to Nicola di Maestro Antonio d'Ancona",
    period: "c. 1491",
    sourceCategory:
      "https://commons.wikimedia.org/wiki/Category:Sola-Busca_tarot_deck",
  },
];

for (const deck of deckConfigs) {
  const metadata = await readMetadata(deck.slug);
  const mappings = deck.map(metadata);
  const outputDirectory = path.join(
    process.cwd(),
    "public",
    "images",
    "decks",
    deck.slug,
  );
  await mkdir(outputDirectory, { recursive: true });

  const results = [];
  for (let index = 0; index < mappings.length; index += 6) {
    const batch = mappings.slice(index, index + 6);
    results.push(
      ...(await Promise.all(
        batch.map((item) =>
          downloadAndOptimize(deck.slug, deck.sourceFolder, item),
        ),
      )),
    );
    process.stdout.write(
      `\r${deck.slug}: ${Math.min(index + batch.length, 78)}/78`,
    );
  }

  const manifest = {
    deck: deck.slug,
    cardCount: results.length,
    artist: deck.artist,
    period: deck.period,
    sourceCategory: deck.sourceCategory,
    metadataReference: metadataUrls[deck.slug],
    assetMirror:
      "https://github.com/mixvlad/TarotCards (files retain their per-file public-domain status)",
    mapping:
      deck.slug === "sola-busca"
        ? "Historical 78-card positional correspondence. Sola Busca trump imagery and names differ from Rider-Waite-Smith."
        : "Marseille VIII Justice and XI Strength are mapped to their matching identities.",
    cards: results,
  };

  await writeFile(
    path.join(outputDirectory, "license-manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8",
  );
  process.stdout.write(`\nSaved ${results.length} ${deck.slug} cards.\n`);
}
