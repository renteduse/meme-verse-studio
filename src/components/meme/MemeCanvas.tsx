
import React, { useEffect, useRef } from 'react';

interface MemeCanvasProps {
  imageUrl: string;
  topText: string;
  bottomText: string;
  fontSize: number;
  fontColor?: string;
  onImageRendered?: (canvas: HTMLCanvasElement) => void;
}

const MemeCanvas: React.FC<MemeCanvasProps> = ({ 
  imageUrl, 
  topText, 
  bottomText, 
  fontSize = 40,
  fontColor = '#FFFFFF',
  onImageRendered 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    img.onload = () => {
      // Calculate canvas dimensions to maintain image aspect ratio
      const maxWidth = 800;
      const maxHeight = 600;
      
      let width = img.width;
      let height = img.height;
      
      // Scale down if image is larger than max dimensions
      if (width > maxWidth) {
        const ratio = maxWidth / width;
        width = maxWidth;
        height = height * ratio;
      }
      
      if (height > maxHeight) {
        const ratio = maxHeight / height;
        height = maxHeight;
        width = width * ratio;
      }
      
      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;
      
      // Draw image
      ctx.drawImage(img, 0, 0, width, height);
      
      // Configure text style
      ctx.fillStyle = fontColor;
      ctx.strokeStyle = 'black';
      ctx.lineWidth = fontSize / 15;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.font = `bold ${fontSize}px Impact, sans-serif`;
      
      // Draw top text
      if (topText) {
        const topY = fontSize / 3;
        wrapText(ctx, topText.toUpperCase(), width / 2, topY, width * 0.9, fontSize * 1.2);
      }
      
      // Draw bottom text
      if (bottomText) {
        ctx.textBaseline = 'bottom';
        const bottomY = height - fontSize / 3;
        wrapText(ctx, bottomText.toUpperCase(), width / 2, bottomY, width * 0.9, fontSize * 1.2);
      }
      
      // Notify parent that canvas is rendered
      if (onImageRendered) {
        onImageRendered(canvas);
      }
    };

    img.onerror = () => {
      // Handle image loading error
      ctx.fillStyle = 'gray';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '20px sans-serif';
      ctx.fillText('Error loading image', canvas.width / 2, canvas.height / 2);
    };
  }, [imageUrl, topText, bottomText, fontSize, fontColor, onImageRendered]);

  // Wrap text function to handle long text
  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) => {
    // Split the text into words
    const words = text.split(' ');
    let line = '';
    
    // If drawing from bottom, we need to calculate lines first
    const lines: string[] = [];
    
    for (const word of words) {
      const testLine = line ? `${line} ${word}` : word;
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = testLine;
      }
    }
    
    if (line) {
      lines.push(line);
    }
    
    // Adjust y position if drawing text from bottom
    if (ctx.textBaseline === 'bottom') {
      y -= lineHeight * (lines.length - 1);
    }
    
    // Draw each line
    for (let i = 0; i < lines.length; i++) {
      const lineText = lines[i];
      
      // Stroke the text (outline)
      ctx.strokeText(lineText, x, y);
      
      // Fill the text
      ctx.fillText(lineText, x, y);
      
      // Move to next line
      y += lineHeight;
    }
  };

  return (
    <canvas
      ref={canvasRef}
      className="w-full max-w-full h-auto border rounded-lg mx-auto shadow-inner bg-gray-100 dark:bg-gray-700"
      style={{ maxHeight: '600px' }}
    />
  );
};

export default MemeCanvas;
