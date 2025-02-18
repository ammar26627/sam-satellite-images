// Convert the onnx model mask prediction to ImageData
function arrayToImageData(input, width, height) {
    const [r, g, b, a] = [0, 114, 189, 255]; // the mask's blue color
    const arr = new Uint8ClampedArray(4 * width * height).fill(0);
  
    for (let i = 0; i < input.length; i++) {
      // Threshold the onnx model mask prediction at 0.0
      if (input[i] > 0.0) {
        arr[4 * i] = r;      // Red
        arr[4 * i + 1] = g;  // Green
        arr[4 * i + 2] = b;  // Blue
        arr[4 * i + 3] = a;  // Alpha (opacity)
      }
    }
    return new ImageData(arr, width, height);
  }
  
  // Use a Canvas element to produce an image from ImageData
  function imageDataToImage(imageData) {
    const canvas = imageDataToCanvas(imageData); // Convert ImageData to Canvas
    const image = new Image(); // Create an HTML Image element
    image.src = canvas.toDataURL(); // Set the source of the image as the PNG data URL from the canvas
    return image; // Return the Image object
  }
  
  // Canvas elements can be created from ImageData
  function imageDataToCanvas(imageData) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
  
    canvas.width = imageData.width;
    canvas.height = imageData.height;
  
    if (ctx) {
      ctx.putImageData(imageData, 0, 0);
    }
  
    return canvas;
  }
  
  // Generate mask from ONNX model output and return the mask image
  function generateMask(input, width, height) {
    // Convert the ONNX model mask prediction to ImageData
    const imageData = arrayToImageData(input, width, height);
  
    // Convert the ImageData to an HTML Image element
    return imageDataToImage(imageData);
  }
  