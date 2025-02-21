import React, { useEffect, useState, useContext } from "react";
import { InferenceSession, Tensor } from "onnxruntime-web";
import "./assets/scss/App.scss";
import { getUserInputPoints } from "./components/helpers/userInputHandler"; 
import { loadImageEmbedding } from "./components/helpers/loadEmbedding"; 
import { handleImageScale } from "./components/helpers/calculateScale"; 
import Stage from "./components/stage";
import AppContext from "./components/hooks/createContext"; 
import { runModelOnUserInteraction } from "./components/helpers/runModelOnUserInteraction"; 

const MODEL_DIR = "/model/sam_onnx_quantized_example.onnx";

const App = () => {
  const { 
    image: [image, setImage], 
    maskImg: [, setMaskImg],
    clicks: [clicks, setClicks],
  } = useContext(AppContext);

  const [model, setModel] = useState(null);
  const [tensor, setTensor] = useState(null);
  const [modelScale, setModelScale] = useState(null);

  // Initialize the ONNX model
  useEffect(() => {
    const initModel = async () => {
      try {
        if (!MODEL_DIR) {
          console.error("Model directory is not defined.");
          return;
        }
        const session = await InferenceSession.create(MODEL_DIR);
        setModel(session);
      } catch (error) {
        console.error("Error loading ONNX model:", error);
      }
    };

    initModel();
  }, []);

  // Load the image embedding and compute scale from context image
  useEffect(() => {
    const loadImageData = async () => {
      try {
        const embedding = await loadImageEmbedding();
        setTensor(embedding);

        if (image) {
          const { samScale } = handleImageScale(image);
          setModelScale(samScale);
        } else {
          console.error("Image not found in context.");
        }
      } catch (error) {
        console.error("Error loading image embedding:", error);
      }
    };

    loadImageData();
  }, [image]);

  // Handle user interactions (clicks and mouse moves)
  useEffect(() => {
    const handleUserInteraction = async (event) => {
      const newPoints = getUserInputPoints(event);
      if (!newPoints) return;

      setClicks((prevClicks) => [...prevClicks, newPoints]);

      if (tensor && modelScale && newPoints) {
        try {
          await runModelOnUserInteraction();
        } catch (error) {
          console.error("Error running model on user interaction:", error);
        }
      }
    };

    document.addEventListener("click", handleUserInteraction);
    document.addEventListener("mousemove", handleUserInteraction);

    return () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("mousemove", handleUserInteraction);
    };
  }, [tensor, modelScale, setMaskImg, setClicks]);

  return <Stage />;
};

export default App;
