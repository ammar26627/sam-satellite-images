import { Tensor } from "onnxruntime-web";

export const loadImageEmbedding = async () => {
  try {
    const response = await fetch("/api/get_embedding");
    const data = await response.json();

    const embedding = new Tensor("float32", new Float32Array(data.embedding), data.shape);
    const image = new Image();
    image.src = data.imageUrl;

    return { embedding, image, scale: data.scale };
  } catch (error) {
    console.error("Error fetching image embedding:", error);
    return { embedding: null, image: null, scale: null };
  }
};
