import { indexTheDocument } from "./prepare.js";
import path from "path";

const filepath = path.resolve(
  process.cwd(),
  "Company_Internal_Documentation_Template.pdf"
);

try {
  await indexTheDocument(filepath);
} catch (error) {
  console.error("Error during indexing:", error);
  process.exit(1);
}
