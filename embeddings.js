import { pipeline } from "@xenova/transformers";

export class HuggingFaceEmbeddings {
  constructor(modelName = "Xenova/all-MiniLM-L6-v2") {
    this.modelName = modelName;
    this.embedder = null;
  }

  async initialize() {
    if (!this.embedder) {
      this.embedder = await pipeline("feature-extraction", this.modelName);
    }
  }

  async embedDocuments(texts) {
    await this.initialize();

    const embeddings = [];

    for (let i = 0; i < texts.length; i++) {
      const text = texts[i].replace(/\s+/g, " ").trim();
      console.log(`Processing ${i + 1}/${texts.length}...`);

      const embedding = await this.embedder(text, {
        pooling: "mean",
        normalize: true,
      });

      embeddings.push(Array.from(embedding.data));
    }

    return embeddings;
  }

  async embedQuery(text) {
    await this.initialize();

    const cleanText = text.replace(/\s+/g, " ").trim();
    const embedding = await this.embedder(cleanText, {
      pooling: "mean",
      normalize: true,
    });

    return Array.from(embedding.data);
  }
}
