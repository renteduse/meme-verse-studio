
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface MemeCanvasProps {
  imageUrl: string;
  topText: string;
  bottomText: string;
  fontSize: number;
  onImageRendered?: (canvas: HTMLCanvasElement) => void;
}

const MemeCanvas: React.FC<MemeCanvasProps> = ({
  imageUrl,
  topText,
  bottomText,
  fontSize,
  onImageRendered
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (canvasRef.current) {
        // Set canvas dimensions based on image
        const aspectRatio = img.width / img.height;
        let canvasWidth = Math.min(600, img.width);
        let canvasHeight = canvasWidth / aspectRatio;
        
        setDimensions({
          width: canvasWidth,
          height: canvasHeight
        });

        const canvas = canvasRef.current;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        
        const ctx = canvas.getContext("2d");
        if (ctx) {
          // Draw image
          ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
          
          // Configure text style
          ctx.strokeStyle = "black";
          ctx.lineWidth = Math.max(1, fontSize / 8);
          ctx.fillStyle = "white";
          ctx.textAlign = "center";
          ctx.lineJoin = "round";
          ctx.font = `${fontSize}px Impact`;

          // Draw top text
          if (topText) {
            wrapText(ctx, topText.toUpperCase(), canvasWidth / 2, fontSize + 10, canvasWidth - 20, fontSize * 1.2);
          }
          
          // Draw bottom text
          if (bottomText) {
            wrapText(ctx, bottomText.toUpperCase(), canvasWidth / 2, canvasHeight - fontSize - 10, canvasWidth - 20, fontSize * 1.2, true);
          }

          setLoading(false);
          
          if (onImageRendered) {
            onImageRendered(canvas);
          }
        }
      }
    };
    
    img.onerror = () => {
      setError("Failed to load image");
      setLoading(false);
    };
    
    img.src = imageUrl;
  }, [imageUrl, topText, bottomText, fontSize, onImageRendered]);

  // Function to wrap text in canvas
  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
    fromBottom: boolean = false
  ) => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + " " + word).width;
      if (width < maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);

    if (fromBottom) {
      const totalHeight = lines.length * lineHeight;
      y -= totalHeight - lineHeight;
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Draw outline
      ctx.strokeText(line, x, y + i * lineHeight);
      // Draw fill
      ctx.fillText(line, x, y + i * lineHeight);
    }
  };

  if (error) {
    return (
      <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-center">
        <p className="text-red-500">{error}</p>
        <p className="mt-2 text-sm text-red-400">Try another image or URL</p>
      </div>
    );
  }

  return (
    <div className="relative flex justify-center">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      <motion.canvas
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="max-w-full rounded-lg shadow-lg"
      />
    </div>
  );
};

export default MemeCanvas;
