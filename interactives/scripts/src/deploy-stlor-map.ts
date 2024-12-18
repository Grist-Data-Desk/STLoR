import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as url from "node:url";

import {
  PutObjectCommand,
  DeleteObjectsCommand,
  S3Client,
  ListObjectsCommand,
} from "@aws-sdk/client-s3";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const STLOR_MAP_PATH = "stlor/interactives/stlor-map/_app";

/**
 * Delete all objects in the stlor-map/_app directory from the Grist Digital
 * Ocean Spaces bucket.
 *
 * @param s3Client – The S3 client instance.
 */
async function deleteMap(s3Client: S3Client): Promise<void> {
  try {
    // List all objects in the stlor-map/_app directory.
    const listObjectsCommand = new ListObjectsCommand({
      Bucket: "grist",
      Prefix: STLOR_MAP_PATH,
    });

    // Grab the contents and delete them in a single request.
    const { Contents } = await s3Client.send(listObjectsCommand);

    if (!Contents) {
      console.log(`No objects found at ${STLOR_MAP_PATH}. Moving on.`);
      return;
    }

    const deleteObjectsCommand = new DeleteObjectsCommand({
      Bucket: "grist",
      Delete: {
        Objects: Contents.map(({ Key }) => ({ Key })),
        Quiet: false,
      },
    });

    await s3Client.send(deleteObjectsCommand);

    console.log(`Successfully deleted objects at ${STLOR_MAP_PATH}.`);
  } catch (error) {
    console.error(
      `Failed to delete objects at ${STLOR_MAP_PATH}. Error: `,
      error
    );
  }
}

/**
 * Derive the Content-Type header from a file's extension.
 *
 * @param file — The name of the file on disk.
 * @returns – The appropriate Content-Type header for the file type.
 */
function deriveContentType(file: string): string {
  const ext = path.extname(file);

  switch (ext) {
    case ".js":
      return "text/javascript";
    case ".css":
      return "text/css";
    case ".json":
      return "application/json";
    default:
      console.warn(`Attempting to upload file with unknown extension: ${ext}.`);
      break;
  }
}

/**
 * Deploy the source code located at `stlor-map/build/_app` to the Grist Digital
 * Ocean Spaces bucket.
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

  console.log(`Deleting objects at ${STLOR_MAP_PATH}`);
  await deleteMap(s3Client);

  const files = await fs.readdir(
    path.resolve(__dirname, "../../stlor-map/build/_app"),
    { recursive: true }
  );

  console.log(`Uploading build artifacts from stlor-map/build/_app.`);
  for (const file of files) {
    if (
      (
        await fs.lstat(
          path.resolve(__dirname, "../../stlor-map/build/_app/", file)
        )
      ).isDirectory()
    ) {
      continue;
    }

    const Body = await fs.readFile(
      path.resolve(__dirname, "../../stlor-map/build/_app/", file)
    );
    const putObjectCommand = new PutObjectCommand({
      Bucket: "grist",
      Key: `${STLOR_MAP_PATH}/${file}`,
      Body,
      ACL: "public-read",
      ContentType: deriveContentType(file),
    });

    try {
      const response = await s3Client.send(putObjectCommand);
      console.log(`Successfully uploaded ${file}`);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }
}

main();
