import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as url from "node:url";

import { createCanvas } from "canvas";

import type { FeatureCollection, Polygon } from "geojson";
import type { ProcessedParcelProperties, LandUse } from "./types";

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

  // Fill background with primaryColor.
  ctx.fillStyle = primaryColor;
  ctx.fillRect(0, 0, size, size);

  // Draw four equally-spaced, equally-sized lines with secondaryColor.
  ctx.lineWidth = size / 8;
  ctx.strokeStyle = secondaryColor;

  ctx.moveTo(-1, size * (3 / 4) - 1);
  ctx.lineTo(size * (1 / 4) + 1, size + 1);
  ctx.stroke();

  ctx.moveTo(-1, size * (1 / 4) - 1);
  ctx.lineTo(size * (3 / 4) + 1, size + 1);
  ctx.stroke();

  ctx.moveTo(size * (1 / 4) - 1, -1);
  ctx.lineTo(size + 1, size * (3 / 4) + 1);
  ctx.stroke();

  ctx.moveTo(size * (3 / 4) - 1, -1);
  ctx.lineTo(size + 1, size * (1 / 4) + 1);
  ctx.stroke();

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

  ctx.fillStyle = primaryColor;
  ctx.fillRect(0, 0, size, size / 6);

  ctx.fillStyle = secondaryColor;
  ctx.fillRect(0, size / 6, size, size / 3);

  ctx.fillStyle = tertiaryColor;
  ctx.fillRect(0, size / 6 + size / 3, size, size / 3);

  ctx.fillStyle = primaryColor;
  ctx.fillRect(0, size / 6 + 2 * (size / 3), size, size / 6);

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

  const dualPatterns = combinations
    .filter(
      (combo) =>
        combo.split(", ").length === 2 && !combo.includes("Uncategorized")
    )
    .map((combo) => {
      const colors = combo
        .split(", ")
        .map((landUse) => LAND_USE_TO_COLORS[landUse as LandUse]);

      return {
        combo,
        pattern: createDualColorHatchPattern(colors[0], colors[1]),
      };
    });

  const triPatterns = combinations
    .filter(
      (combo) =>
        combo.split(", ").length === 3 && !combo.includes("Uncategorized")
    )
    .map((combo) => {
      const colors = combo
        .split(", ")
        .map((landUse) => LAND_USE_TO_COLORS[landUse as LandUse]);

      return {
        combo,
        pattern: createTriColorLinePattern(colors[0], colors[1], colors[2]),
      };
    });

  const patterns = [...dualPatterns, ...triPatterns];

  await fs.writeFile(
    path.resolve(__dirname, "../data/processed/land-use-patterns.json"),
    JSON.stringify(patterns, null, 2)
  );

  const rightsTypePattern = createDualColorHatchPattern("#3877f3", "#3c3830");

  await fs.writeFile(
    path.resolve(__dirname, "../data/processed/rights-type-pattern.json"),
    JSON.stringify(rightsTypePattern, null, 2)
  );
}

main();
