import { indexTheDocument } from "./prepare.js";
import path from "path";

const filePath = path.resolve(
  process.cwd(),
  "public",
  "Company_Internal_Documentation_Template.pdf"
);

try {
  await indexTheDocument(filePath);
} catch (error) {
  console.error("Error during indexing:", error);
  process.exit(1);
}
