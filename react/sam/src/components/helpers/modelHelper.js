import { Tensor, InferenceSession } from "onnxruntime-web";
import { useContext } from "react";
import AppContext from "../hooks/createContext";
import { modeDataProps } from "../interfaces";

// Load ONNX Model (Should be called once)
let session;
const loadModel = async () => {
  if (!session) {
    session = await InferenceSession.create("/path/to/sam_model.onnx"); // Update with actual path
    console.log("ONNX Model Loaded Successfully!");
  }
};

export const runModelOnUserInteraction = async (tensor, modelScale, setMaskImg) => {
  const { clicks } = useContext(AppContext);

  if (!tensor || !clicks || clicks.length === 0) {
    console.warn("Tensor or clicks data is missing. Skipping inference.");
    return;
  }

  await loadModel(); // Ensure model is loaded before running inference

  try {
    console.log("Running model with clicks:", clicks);

    let n = clicks.length;
    const pointCoords = new Float32Array(2 * (n + 1));
    const pointLabels = new Float32Array(n + 1);

    for (let i = 0; i < n; i++) {
      pointCoords[2 * i] = clicks[i].x * modelScale.samScale;
      pointCoords[2 * i + 1] = clicks[i].y * modelScale.samScale;
      pointLabels[i] = clicks[i].clickType;
    }

    // Add the extra padding point
    pointCoords[2 * n] = 0.0;
    pointCoords[2 * n + 1] = 0.0;
    pointLabels[n] = -1.0;

    // Create ONNX tensors
    const pointCoordsTensor = new Tensor("float32", pointCoords, [1, n + 1, 2]);
    const pointLabelsTensor = new Tensor("float32", pointLabels, [1, n + 1]);
    const imageSizeTensor = new Tensor("float32", [modelScale.height, modelScale.width]);
    const maskInput = new Tensor("float32", new Float32Array(256 * 256), [1, 1, 256, 256]);
    const hasMaskInput = new Tensor("float32", [0]);

    // Run ONNX inference
    const modelInputs = {
      image_embeddings: tensor,
      point_coords: pointCoordsTensor,
      point_labels: pointLabelsTensor,
      orig_im_size: imageSizeTensor,
      mask_input: maskInput,
      has_mask_input: hasMaskInput,
    };

    const output = await session.run(modelInputs);

    // Assuming the model returns a mask tensor
    const outputMask = output["masks"].data; // Adjust based on model output

    setMaskImg(outputMask);
    console.log("Inference completed!");
  } catch (error) {
    console.error("Error running model inference:", error);
  }
};
