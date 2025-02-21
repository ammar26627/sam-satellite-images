import { Tensor, InferenceSession } from "onnxruntime-web";
import { useContext } from "react";
import AppContext from "../hooks/createContext";
import { modeDataProps } from "../interfaces";



export const runModelOnUserInteraction = async () => {
  const { clicks } = useContext(AppContext);
  const { tensor } = useContext(AppContext);
  const { modelScale } = useContext(AppContext);
  const { setMaskImg } = useContext(AppContext);
  const { model } = useContext(AppContext);

  if (!tensor || !clicks || clicks.length === 0) {
    console.warn("Tensor or clicks data is missing. Skipping inference.");
    return;
  }


  try {
    console.log("Running model with clicks:", clicks);

    const n = clicks.length;
    const pointCoords = new Float32Array(2 * n);
    const pointLabels = new Float32Array(n);

    clicks.forEach((coord, i) => {
      pointCoords[2 * i] = coord.x * modelScale.samScale;
      pointCoords[2 * i + 1] = coord.y * modelScale.samScale;
      pointLabels[i] = coord.label;  // Using the label from the coordinate object
  });


    // Create ONNX tensors
    const pointCoordsTensor = new Tensor("float32", pointCoords, [1, n, 2]);
    const pointLabelsTensor = new Tensor("float32", pointLabels, [1, n]);
    const imageSizeTensor = new Tensor("float32", [modelScale.height, modelScale.width]);
    const maskInput = new Tensor("float32", new Float32Array(1024 * 1024), [1, 1, 1024, 1024]);
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

    const output = await model.run(modelInputs);

    // Assuming the model returns a mask tensor
    const outputMask = output["masks"].data[0]; // Adjust based on model output

    setMaskImg(outputMask);
    console.log("Inference completed!");
  } catch (error) {
    console.error("Error running model inference:", error);
  }
};
