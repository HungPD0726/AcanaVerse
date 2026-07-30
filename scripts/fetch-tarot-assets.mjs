import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const majorFiles = [
  ["the-fool", "RWS Tarot 00 Fool.jpg"],
  ["the-magician", "RWS Tarot 01 Magician.jpg"],
  ["the-high-priestess", "RWS Tarot 02 High Priestess.jpg"],
  ["the-empress", "RWS Tarot 03 Empress.jpg"],
  ["the-emperor", "RWS Tarot 04 Emperor.jpg"],
  ["the-hierophant", "RWS Tarot 05 Hierophant.jpg"],
  ["the-lovers", "RWS Tarot 06 Lovers.jpg"],
  ["the-chariot", "RWS Tarot 07 Chariot.jpg"],
  ["strength", "RWS Tarot 08 Strength.jpg"],
  ["the-hermit", "RWS Tarot 09 Hermit.jpg"],
  ["wheel-of-fortune", "RWS Tarot 10 Wheel of Fortune.jpg"],
  ["justice", "RWS Tarot 11 Justice.jpg"],
  ["the-hanged-man", "RWS Tarot 12 Hanged Man.jpg"],
  ["death", "RWS Tarot 13 Death.jpg"],
  ["temperance", "RWS Tarot 14 Temperance.jpg"],
  ["the-devil", "RWS Tarot 15 Devil.jpg"],
  ["the-tower", "RWS Tarot 16 Tower.jpg"],
  ["the-star", "RWS Tarot 17 Star.jpg"],
  ["the-moon", "RWS Tarot 18 Moon.jpg"],
  ["the-sun", "RWS Tarot 19 Sun.jpg"],
  ["judgement", "RWS Tarot 20 Judgement.jpg"],
  ["the-world", "RWS Tarot 21 World.jpg"],
];

const suitFiles = [
  ["cups", "Cups"],
  ["pentacles", "Pents"],
  ["swords", "Swords"],
  ["wands", "Wands"],
].flatMap(([suit, prefix]) =>
  Array.from({ length: 14 }, (_, index) => {
    const number = String(index + 1).padStart(2, "0");
    return [`${suit}-${number}`, `${prefix}${number}.jpg`];
  }),
);

const files = [...majorFiles, ...suitFiles];
const outputDirectory = path.join(process.cwd(), "public", "images", "cards");
const manifestPath = path.join(outputDirectory, "license-manifest.json");

await mkdir(outputDirectory, { recursive: true });

const wait = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

async function fetchWithRetry(url, options, attempt = 0) {
  const response = await fetch(url, options);

  if ((response.status === 429 || response.status >= 500) && attempt < 5) {
    const retryAfter = Number(response.headers.get("retry-after"));
    const delay = Number.isFinite(retryAfter)
      ? retryAfter * 1_000
      : 1_500 * 2 ** attempt;
    await wait(delay);
    return fetchWithRetry(url, options, attempt + 1);
  }

  return response;
}

async function getImageInfoBatch(batch) {
  const query = new URLSearchParams({
    action: "query",
    format: "json",
    origin: "*",
    prop: "imageinfo",
    iiprop: "url|extmetadata",
    iiurlwidth: "720",
    titles: batch.map(([, filename]) => `File:${filename}`).join("|"),
  });
  const response = await fetchWithRetry(
    `https://commons.wikimedia.org/w/api.php?${query.toString()}`,
    {
      headers: {
        "User-Agent": "ArcanaVerse/0.1 (local educational project)",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Wikimedia API failed: ${response.status}`);
  }

  const payload = await response.json();
  return new Map(
    Object.values(payload.query.pages).map((page) => {
      const info = page.imageinfo?.[0];
      const filename = page.title.replace(/^File:/, "");

      if (!info?.thumburl) {
        throw new Error(`Missing thumbnail URL for ${filename}`);
      }

      return [
        filename,
        {
          imageUrl: info.thumburl,
          sourcePage:
            info.descriptionurl ??
            `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(filename)}`,
        },
      ];
    }),
  );
}

async function downloadCard([slug, filename], imageInfo) {
  const { imageUrl, sourcePage } = imageInfo;
  const outputPath = path.join(outputDirectory, `${slug}.webp`);
  let downloaded = false;

  try {
    await access(outputPath);
  } catch {
    const response = await fetchWithRetry(imageUrl, {
      headers: {
        "User-Agent": "ArcanaVerse/0.1 (local educational project)",
      },
    });

    if (!response.ok) {
      throw new Error(`Image download failed for ${filename}: ${response.status}`);
    }

    const input = Buffer.from(await response.arrayBuffer());

    await sharp(input)
      .resize({ width: 480, withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 })
      .toFile(outputPath);
    downloaded = true;
  }

  return {
    slug,
    filename,
    path: `/images/cards/${slug}.webp`,
    sourcePage,
    author: "Pamela Colman Smith",
    published: 1910,
    license: "Public Domain Mark 1.0",
    licenseUrl: "https://creativecommons.org/publicdomain/mark/1.0/",
    downloaded,
  };
}

const imageInfo = new Map();
for (let index = 0; index < files.length; index += 40) {
  const batchInfo = await getImageInfoBatch(files.slice(index, index + 40));
  for (const [filename, info] of batchInfo) {
    imageInfo.set(filename, info);
  }
  await wait(1_000);
}

const manifest = [];
for (const [index, file] of files.entries()) {
  const info = imageInfo.get(file[1]);
  if (!info) {
    throw new Error(`Missing API metadata for ${file[1]}`);
  }
  const item = await downloadCard(file, info);
  const { downloaded, ...manifestItem } = item;
  manifest.push(manifestItem);
  process.stdout.write(`\rDownloaded ${index + 1}/${files.length}`);
  if (downloaded) {
    await wait(900);
  }
}

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

await sharp(path.join(process.cwd(), "public", "images", "brand", "hero-editorial.png"))
  .resize({ width: 1800, withoutEnlargement: true })
  .webp({ quality: 84, effort: 5 })
  .toFile(path.join(process.cwd(), "public", "images", "brand", "hero-editorial.webp"));

await sharp(path.join(process.cwd(), "public", "images", "brand", "card-back.png"))
  .resize({ width: 720, withoutEnlargement: true })
  .webp({ quality: 86, effort: 5 })
  .toFile(path.join(process.cwd(), "public", "images", "brand", "card-back.webp"));

process.stdout.write(
  `\nSaved ${manifest.length} optimized cards and brand assets.\n`,
);
