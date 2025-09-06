import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import dotenv from "dotenv";
import { HuggingFaceEmbeddings } from "./embeddings.js";

dotenv.config();

// Initialize components
const embeddings = new HuggingFaceEmbeddings("Xenova/all-MiniLM-L6-v2");
const pinecone = new PineconeClient();
const pineconeIndex = pinecone.index(process.env.PINECONE_INDEX_NAME);

const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
  pineconeIndex,
  maxConcurrency: 5,
});

export async function indexTheDocument(filePath) {
  // Load PDF
  const loader = new PDFLoader(filePath, { splitPages: false });
  const doc = await loader.load();

  // Split into chunks
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
  });

  const texts = await textSplitter.splitText(doc[0].pageContent);

  // Create documents with metadata
  const documents = texts.map((chunk, index) => ({
    pageContent: chunk,
    metadata: { source: filePath, chunkIndex: index },
  }));

  // Add to Pinecone
  await vectorStore.addDocuments(documents);
}

export async function queryDocuments(question, k = 5) {
  const results = await vectorStore.similaritySearch(question, k);
  return results.map((result) => result.pageContent);
}
