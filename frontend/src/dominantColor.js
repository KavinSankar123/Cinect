export function getDominantColor(canvasRef, imageSrc, callback) {
  const img = new Image();
  img.crossOrigin = "Anonymous"; // Use this if you're loading images from an external domain
  img.src = imageSrc;
  img.onload = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const colorCount = {};

    // Analyze blocks of pixels to improve performance
    for (let i = 0; i < data.length; i += 10) {
      const key = `${data[i]}-${data[i + 1]}-${data[i + 2]}`;
      if (colorCount[key]) {
        colorCount[key]++;
      } else {
        colorCount[key] = 1;
      }
    }

    // Find the most frequent color
    let maxColor = '';
    let maxCount = 0;
    for (let key in colorCount) {
      if (colorCount[key] > maxCount) {
        maxCount = colorCount[key];
        maxColor = key;
      }
    }

    const dominantColor = `#${parseInt(maxColor.split('-')[0], 10).toString(16).padStart(2, '0')}${parseInt(maxColor.split('-')[1], 10).toString(16).padStart(2, '0')}${parseInt(maxColor.split('-')[2], 10).toString(16).padStart(2, '0')}`;
    callback(dominantColor);
  };
}
