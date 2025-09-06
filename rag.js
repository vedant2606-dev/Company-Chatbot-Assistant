import { indexTheDocument } from "./prepare.js";

const filePath = "./Company_Internal_Documentation_Template.pdf";

try {
  await indexTheDocument(filePath);
} catch (error) {
  console.error("Error during indexing:", error);
  process.exit(1);
}
