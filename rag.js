import { indexTheDocument } from "./prepare.js";
import path from "path";
import fs from "fs";

// More deployment-friendly approach
const filePath = path.resolve(
  process.cwd(),
  "assets/Company_Internal_Documentation_Template.pdf"
);

if (!fs.existsSync(filePath)) {
  console.error(`Document not found at: ${filePath}`);
  process.exit(1);
}

try {
  await indexTheDocument(filePath);
  console.log("Document indexing completed successfully!");
} catch (error) {
  console.error("Error during indexing:", error);
  process.exit(1);
}
