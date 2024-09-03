import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as url from "node:url";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const PNG_PATH = "stlor/assets/png";

/**
 * Store PNG images in the Grist DigitalOcean Spaces bucket, s3://grist.
 */
async function main(): Promise<void> {
  const s3Client = new S3Client({
    endpoint: "https://nyc3.digitaloceanspaces.com/",
    forcePathStyle: false,
    region: "nyc3",
    credentials: {
      accessKeyId: process.env.DO_SPACES_KEY,
      secretAccessKey: process.env.DO_SPACES_SECRET,
    },
  });

  const files = ["bg"];

  for (const file of files) {
    console.log(`Uploading ${file}.png.`);

    const Body = await fs.readFile(
      path.resolve(__dirname, `../assets/${file}.png`)
    );
    const putObjectCommand = new PutObjectCommand({
      Bucket: "grist",
      Key: `${PNG_PATH}/${file}.png`,
      Body,
      ACL: "public-read",
      ContentType: "image/png",
    });
    try {
      const response = await s3Client.send(putObjectCommand);
      console.log(`Successfully uploaded ${file}.png`);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }
}

main();
