import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as url from "node:url";

import { createCanvas } from "canvas";
import { schemePaired } from "d3-scale-chromatic";
import type { FeatureCollection, Polygon } from "geojson";
import { groupBy } from "lodash-es";

import type { ProcessedParcelProperties, LandUse } from "./types";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

// Grist brand colors.
const COLORS = {
  EARTH: "#3c3830",
  ORANGE: "#ec6c37",
  GOLD: "#d9ac4a",
  GRAY: "#9ca3af",
  GREEN: "#476039",
  PALE_GREEN: "#9ca18c",
  BLUE: "#40798A",
  TAN: "#D8A772",
};

// The mapping of land uses to colors.
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

// The mapping of rights type to colors.
const RIGHTS_TYPE_TO_COLORS = {
  surface: "#D8A772",
  subsurface: "#40798A",
};

// Canvas size.
const CANVAS_SIZE = 32;

/**
 * Create a dual color hatch pattern in canvas.
 *
 * @param primaryColor — The primary color of the hatch pattern, used to fill
 * the background.
 * @param secondaryColor — The secondary color of the hatch pattern, used to
 * draw stripes.
 * @returns — The data URL of the hatch pattern.
 */
function createDualColorHatchPattern(
  primaryColor: string,
  secondaryColor: string
) {
  const canvas = createCanvas(CANVAS_SIZE, CANVAS_SIZE);
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return "";
  }

  ctx.fillStyle = primaryColor;
  ctx.beginPath();
  ctx.moveTo(0, CANVAS_SIZE * (3 / 4));
  ctx.lineTo(CANVAS_SIZE * (1 / 4), CANVAS_SIZE);
  ctx.lineTo(0, CANVAS_SIZE);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = secondaryColor;
  ctx.beginPath();
  ctx.moveTo(0, CANVAS_SIZE * (1 / 2));
  ctx.lineTo(CANVAS_SIZE * (1 / 2), CANVAS_SIZE);
  ctx.lineTo(CANVAS_SIZE * (1 / 4), CANVAS_SIZE);
  ctx.lineTo(0, CANVAS_SIZE * (3 / 4));
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = primaryColor;
  ctx.beginPath();
  ctx.moveTo(0, CANVAS_SIZE * (1 / 4));
  ctx.lineTo(CANVAS_SIZE * (3 / 4), CANVAS_SIZE);
  ctx.lineTo(CANVAS_SIZE * (1 / 2), CANVAS_SIZE);
  ctx.lineTo(0, CANVAS_SIZE * (1 / 2));
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = secondaryColor;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(CANVAS_SIZE, CANVAS_SIZE);
  ctx.lineTo(CANVAS_SIZE * (3 / 4), CANVAS_SIZE);
  ctx.lineTo(0, CANVAS_SIZE * (1 / 4));
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = primaryColor;
  ctx.beginPath();
  ctx.moveTo(CANVAS_SIZE * (1 / 4), 0);
  ctx.lineTo(CANVAS_SIZE, CANVAS_SIZE * (3 / 4));
  ctx.lineTo(CANVAS_SIZE, CANVAS_SIZE);
  ctx.lineTo(0, 0);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = secondaryColor;
  ctx.beginPath();
  ctx.moveTo(CANVAS_SIZE * (1 / 2), 0);
  ctx.lineTo(CANVAS_SIZE, CANVAS_SIZE * (1 / 2));
  ctx.lineTo(CANVAS_SIZE, CANVAS_SIZE * (3 / 4));
  ctx.lineTo(CANVAS_SIZE * (1 / 4), 0);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = primaryColor;
  ctx.beginPath();
  ctx.moveTo(CANVAS_SIZE * (3 / 4), 0);
  ctx.lineTo(CANVAS_SIZE, CANVAS_SIZE * (1 / 4));
  ctx.lineTo(CANVAS_SIZE, CANVAS_SIZE * (1 / 2));
  ctx.lineTo(CANVAS_SIZE * (1 / 2), 0);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = secondaryColor;
  ctx.beginPath();
  ctx.moveTo(CANVAS_SIZE * (3 / 4), 0);
  ctx.lineTo(CANVAS_SIZE, 0);
  ctx.lineTo(CANVAS_SIZE, CANVAS_SIZE * (1 / 4));
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
 * @returns – The data URL of the line pattern.
 */
function createTriColorLinePattern(
  primaryColor: string,
  secondaryColor: string,
  tertiaryColor: string
): string {
  const canvas = createCanvas(CANVAS_SIZE, CANVAS_SIZE);
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return "";
  }

  const colors = [primaryColor, secondaryColor, tertiaryColor];

  for (let i = 0; i < colors.length * 2; i++) {
    ctx.fillStyle = colors[i % 3];
    ctx.fillRect(0, (i * CANVAS_SIZE) / 6, CANVAS_SIZE, CANVAS_SIZE / 6);
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
 * @returns – The data URL of the line pattern.
 */
function createQuadColorLinePattern(
  primaryColor: string,
  secondaryColor: string,
  tertiaryColor: string,
  quaternaryColor: string
): string {
  const canvas = createCanvas(CANVAS_SIZE, CANVAS_SIZE);
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return "";
  }

  const colors = [primaryColor, secondaryColor, tertiaryColor, quaternaryColor];

  for (let i = 0; i < colors.length * 2; i++) {
    ctx.fillStyle = colors[i % 4];
    ctx.fillRect((CANVAS_SIZE / 8) * i, 0, CANVAS_SIZE / 8, CANVAS_SIZE);
  }

  return canvas.toDataURL("image/png");
}

/**
 * Identify the unique combinations of land uses present in the dataset.
 *
 * @param stlors – STLoR parcels.
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

/**
 * Generate data URLs for land use and rights type canvas patterns and write
 * them to disk.
 */
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

  const rightsTypePattern = createDualColorHatchPattern(
    RIGHTS_TYPE_TO_COLORS.subsurface,
    RIGHTS_TYPE_TO_COLORS.surface
  );

  await fs.writeFile(
    path.resolve(__dirname, "../data/processed/rights-type-pattern.json"),
    JSON.stringify(rightsTypePattern, null, 2)
  );
}

main();
