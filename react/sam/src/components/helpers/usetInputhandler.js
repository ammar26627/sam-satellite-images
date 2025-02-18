let points = [];

export const getUserInputPoints = () => {
  return points;
};

document.addEventListener("click", (event) => {
  points.push({ x: event.clientX, y: event.clientY });
});

document.addEventListener("mousemove", (event) => {
  if (points.length > 10) points.shift(); // Keep last 10 points
  points.push({ x: event.clientX, y: event.clientY });
});
