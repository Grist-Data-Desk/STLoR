import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as url from "node:url";

import { createCanvas } from "canvas";

import type { FeatureCollection, Polygon } from "geojson";
import type { ProcessedParcelProperties, LandUse } from "./types";
import groupBy from "lodash.groupby";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const COLORS = {
  EARTH: "#3c3830",
  SMOG: "#f0f0f0",
  ORANGE: "#ec6c37",
  GOLD: "#d9ac4a",
  GRAY: "#9ca3af",
  GREEN: "#476039",
  PALE_GREEN: "#9ca18c",
};

const schemePaired = [
  "#a6cee3",
  "#1f78b4",
  "#b2df8a",
  "#33a02c",
  "#fb9a99",
  "#e31a1c",
  "#fdbf6f",
  "#ff7f00",
  "#cab2d6",
  "#6a3d9a",
  "#ffff99",
  "#b15928",
];

const LAND_USE_TO_COLORS: Record<LandUse, string> = {
  Grazing: COLORS.PALE_GREEN,
  Agriculture: schemePaired[3],
  Infrastructure: "#64748b",
  Renewables: COLORS.ORANGE,
  Conservation: schemePaired[2],
  "Fossil Fuels": COLORS.EARTH,
  Mining: COLORS.GOLD,
  Timber: COLORS.GREEN,
  Commercial: schemePaired[9],
  Uncategorized: COLORS.GRAY,
  Recreation: schemePaired[4],
  Water: schemePaired[0],
};

/**
 * Create a dual color hatch pattern in canvas.
 *
 * @param primaryColor — The primary color of the hatch pattern, used
 * to fill the background.
 * @param secondaryColor — The secondary color of the hatch pattern,
 * used to draw stripes.
 * @param size — The size of the canvas, drawn as a square.
 * @param lineWidth — The width of lines in the hatch pattern.
 * @returns — The data URL of the hatch pattern.
 */
function createDualColorHatchPattern(
  primaryColor: string,
  secondaryColor: string,
  size = 32
) {
  const canvas = createCanvas(size, size);
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return "";
  }

  ctx.fillStyle = primaryColor;
  ctx.beginPath();
  ctx.moveTo(0, size * (3 / 4));
  ctx.lineTo(size * (1 / 4), size);
  ctx.lineTo(0, size);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = secondaryColor;
  ctx.beginPath();
  ctx.moveTo(0, size * (1 / 2));
  ctx.lineTo(size * (1 / 2), size);
  ctx.lineTo(size * (1 / 4), size);
  ctx.lineTo(0, size * (3 / 4));
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = primaryColor;
  ctx.beginPath();
  ctx.moveTo(0, size * (1 / 4));
  ctx.lineTo(size * (3 / 4), size);
  ctx.lineTo(size * (1 / 2), size);
  ctx.lineTo(0, size * (1 / 2));
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = secondaryColor;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(size, size);
  ctx.lineTo(size * (3 / 4), size);
  ctx.lineTo(0, size * (1 / 4));
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = primaryColor;
  ctx.beginPath();
  ctx.moveTo(size * (1 / 4), 0);
  ctx.lineTo(size, size * (3 / 4));
  ctx.lineTo(size, size);
  ctx.lineTo(0, 0);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = secondaryColor;
  ctx.beginPath();
  ctx.moveTo(size * (1 / 2), 0);
  ctx.lineTo(size, size * (1 / 2));
  ctx.lineTo(size, size * (3 / 4));
  ctx.lineTo(size * (1 / 4), 0);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = primaryColor;
  ctx.beginPath();
  ctx.moveTo(size * (3 / 4), 0);
  ctx.lineTo(size, size * (1 / 4));
  ctx.lineTo(size, size * (1 / 2));
  ctx.lineTo(size * (1 / 2), 0);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = secondaryColor;
  ctx.beginPath();
  ctx.moveTo(size * (3 / 4), 0);
  ctx.lineTo(size, 0);
  ctx.lineTo(size, size * (1 / 4));
  ctx.closePath();
  ctx.fill();

  return canvas.toDataURL("image/png");
}

/**
 * Create a tri-color line pattern in canvas.
 *
 * @param primaryColor – The primary color of the line pattern.
 * @param secondaryColor – The secondary color of the line pattern.
 * @param tertiaryColor – The tertiary color of the line pattern.
 * @param size – The size of the canvas, drawn as a square.
 * @returns – The data URL of the line pattern.
 */
function createTriColorLinePattern(
  primaryColor: string,
  secondaryColor: string,
  tertiaryColor: string,
  size = 32
): string {
  const canvas = createCanvas(size, size);
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return "";
  }

  const colors = [primaryColor, secondaryColor, tertiaryColor];

  for (let i = 0; i < colors.length * 2; i++) {
    ctx.fillStyle = colors[i % 3];
    ctx.fillRect(0, (i * size) / 6, size, size / 6);
  }

  return canvas.toDataURL("image/png");
}

/**
 * Create a quad-color line pattern in canvas.
 *
 * @param primaryColor – The primary color of the line pattern.
 * @param secondaryColor – The secondary color of the line pattern.
 * @param tertiaryColor – The tertiary color of the line pattern.
 * @param quaternaryColor – The quaternary color of the line pattern.
 * @param size – The size of the canvas, drawn as a square.
 * @returns – The data URL of the line pattern.
 */
function createQuadColorLinePattern(
  primaryColor: string,
  secondaryColor: string,
  tertiaryColor: string,
  quaternaryColor: string,
  size = 32
): string {
  const canvas = createCanvas(size, size);
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return "";
  }

  const colors = [primaryColor, secondaryColor, tertiaryColor, quaternaryColor];

  for (let i = 0; i < colors.length * 2; i++) {
    ctx.fillStyle = colors[i % 4];
    ctx.fillRect((size / 8) * i, 0, size / 8, size);
  }

  return canvas.toDataURL("image/png");
}

/**
 * Identify the unique combinations of land uses present in the dataset.
 *
 * @param stlors – STLoRs.
 * @returns – An array of all unique combinations of land uses present in the
 * dataset.
 */
function identifyLandUseCombinations(
  stlors: FeatureCollection<Polygon, ProcessedParcelProperties>
): string[] {
  const combinations = new Set<string>();

  for (const feature of stlors.features) {
    // land_use is a sorted array, so we don't need to worry about differences
    // in ordering. For example, we'll only ever see ["Fossil Fuels", "Mining"]
    // in the dataset, not ["Mining", "Fossil Fuels"].
    const landUses = feature.properties.land_use.join(", ");

    if (!combinations.has(landUses)) {
      combinations.add(landUses);
    }
  }

  return Array.from(combinations);
}

async function main() {
  const stlors = JSON.parse(
    await fs.readFile(
      path.resolve(__dirname, "../data/processed/stlors.geojson"),
      "utf-8"
    )
  ) as FeatureCollection<Polygon, ProcessedParcelProperties>;

  const combinations = identifyLandUseCombinations(stlors);
  const patternsByLength = groupBy(
    combinations,
    (combo) => combo.split(", ").length
  );

  const patterns = Object.entries(patternsByLength).flatMap(
    ([length, combos]) => {
      switch (+length) {
        case 2:
          return combos.map((combo) => {
            const colors = combo
              .split(", ")
              .map((landUse) => LAND_USE_TO_COLORS[landUse as LandUse]);

            return {
              combo,
              pattern: createDualColorHatchPattern(colors[0], colors[1]),
            };
          });
        case 3:
          return combos.map((combo) => {
            const colors = combo
              .split(", ")
              .map((landUse) => LAND_USE_TO_COLORS[landUse as LandUse]);

            return {
              combo,
              pattern: createTriColorLinePattern(
                colors[0],
                colors[1],
                colors[2]
              ),
            };
          });
        case 4:
          return combos.map((combo) => {
            const colors = combo
              .split(", ")
              .map((landUse) => LAND_USE_TO_COLORS[landUse as LandUse]);

            return {
              combo,
              pattern: createQuadColorLinePattern(
                colors[0],
                colors[1],
                colors[2],
                colors[3]
              ),
            };
          });
        default:
          return [];
      }
    }
  );

  await fs.writeFile(
    path.resolve(__dirname, "../data/processed/land-use-patterns.json"),
    JSON.stringify(patterns, null, 2)
  );

  const rightsTypePattern = createDualColorHatchPattern("#40798A", "#D8A772");

  await fs.writeFile(
    path.resolve(__dirname, "../data/processed/rights-type-pattern.json"),
    JSON.stringify(rightsTypePattern, null, 2)
  );
}

main();
