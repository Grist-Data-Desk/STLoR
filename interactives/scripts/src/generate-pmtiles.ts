import { exec } from "node:child_process";
import path from "node:path";
import url from "node:url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const files = [
  "../data/processed/stlors.geojson",
  "../data/processed/reservations.geojson",
];

/**
 * Generate PMTiles archives for a subset of GeoJSON datasets.
 */
const main = async () => {
  for await (const file of files) {
    const name = path.parse(file).name;
    const filePath = path.resolve(__dirname, file);

    const outFile = file.replace(".geojson", ".pmtiles");
    const outFilePath = path.resolve(__dirname, outFile);

    const cmd = `tippecanoe -zg -o ${outFilePath} -l ${name} --extend-zooms-if-still-dropping --force ${filePath}`;
    console.log(`Generating PMTiles for ${file}.`);

    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        console.error(`Failed to convert input file ${file} to PMTiles.`, err);
        return;
      }

      console.log(stdout);
      console.error(stderr);
    });
  }
};

main();
