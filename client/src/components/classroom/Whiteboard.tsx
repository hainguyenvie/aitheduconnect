import { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Eraser,
  Pencil,
  Square,
  Circle,
  Type,
  Download,
  Save,
  Trash2,
  Move,
  StickyNote,
  Image,
  Undo,
  Redo,
  RotateCcw,
} from "lucide-react";

interface WhiteboardProps {
  socketRef: React.MutableRefObject<Socket | null>;
}

type DrawingMode = 'pencil' | 'eraser' | 'rectangle' | 'circle' | 'text' | 'move' | 'sticky' | 'image';

interface DrawingOptions {
  color: string;
  width: number;
  mode: DrawingMode;
  font: string;
  fontSize: number;
}

const Whiteboard = ({ socketRef }: WhiteboardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [options, setOptions] = useState<DrawingOptions>({
    color: '#000000',
    width: 2,
    mode: 'pencil',
    font: 'Arial',
    fontSize: 16
  });
  const [currentText, setCurrentText] = useState('');
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [isAddingText, setIsAddingText] = useState(false);
  const [drawHistory, setDrawHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Image upload ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Setup canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Set canvas to full size
    canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
    canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Set default style
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = options.color;
    context.lineWidth = options.width;
    
    // Initialize with white background
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    contextRef.current = context;
    
    // Save initial state
    saveToHistory();
    
    // Handle window resize
    const handleResize = () => {
      if (canvas && context) {
        // Save current drawing
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        
        // Resize canvas
        canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
        canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
        
        // Restore drawing and settings
        context.putImageData(imageData, 0, 0);
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.strokeStyle = options.color;
        context.lineWidth = options.width;
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Handle socket events
  useEffect(() => {
    if (!socketRef.current) return;
    
    // Listen for drawing events from other users
    socketRef.current.on('draw', (data: any) => {
      drawFromSocketData(data);
    });
    
    // Listen for clear whiteboard event
    socketRef.current.on('clear-whiteboard', () => {
      clearCanvas();
    });
    
    return () => {
      if (socketRef.current) {
        socketRef.current.off('draw');
        socketRef.current.off('clear-whiteboard');
      }
    };
  }, [socketRef.current]);
  
  // Save current canvas state to history
  const saveToHistory = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;
    
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    
    // If we've gone back in history and are creating a new branch,
    // remove the future states
    if (historyIndex >= 0 && historyIndex < drawHistory.length - 1) {
      setDrawHistory(prevHistory => prevHistory.slice(0, historyIndex + 1));
    }
    
    setDrawHistory(prevHistory => [...prevHistory, imageData]);
    setHistoryIndex(prev => prev + 1);
  };
  
  // Undo last action
  const undo = () => {
    if (historyIndex <= 0) return;
    
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;
    
    context.putImageData(drawHistory[newIndex], 0, 0);
    
    // Notify other users
    if (socketRef.current) {
      socketRef.current.emit('whiteboard-undo');
    }
  };
  
  // Redo last undone action
  const redo = () => {
    if (historyIndex >= drawHistory.length - 1) return;
    
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;
    
    context.putImageData(drawHistory[newIndex], 0, 0);
    
    // Notify other users
    if (socketRef.current) {
      socketRef.current.emit('whiteboard-redo');
    }
  };
  
  // Draw from socket data
  const drawFromSocketData = (data: any) => {
    const { type, points, options: remoteOptions, text, imageUrl } = data;
    const context = contextRef.current;
    const canvas = canvasRef.current;
    
    if (!context || !canvas) return;
    
    // Set received styles
    context.strokeStyle = remoteOptions.color;
    context.lineWidth = remoteOptions.width;
    context.font = `${remoteOptions.fontSize}px ${remoteOptions.font}`;
    context.fillStyle = remoteOptions.color;
    
    if (type === 'path') {
      // Draw path from another user
      context.beginPath();
      context.moveTo(points[0].x, points[0].y);
      
      for (let i = 1; i < points.length; i++) {
        context.lineTo(points[i].x, points[i].y);
      }
      
      context.stroke();
    } else if (type === 'rectangle') {
      // Draw rectangle
      const { x, y, width, height } = points;
      context.beginPath();
      context.rect(x, y, width, height);
      context.stroke();
    } else if (type === 'circle') {
      // Draw circle
      const { x, y, radius } = points;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.stroke();
    } else if (type === 'text') {
      // Draw text
      const { x, y } = points;
      context.fillText(text, x, y);
    } else if (type === 'image') {
      // Draw image
      const { x, y } = points;
      const img = new Image();
      img.onload = () => {
        context.drawImage(img, x, y);
        saveToHistory();
      };
      img.src = imageUrl;
    } else if (type === 'clear') {
      // Clear canvas
      clearCanvas();
    }
    
    // Save after drawing from socket
    saveToHistory();
  };
  
  // Start drawing
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (isAddingText) {
      // Handle text placement
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = e instanceof MouseEvent 
        ? e.clientX - rect.left 
        : e.touches[0].clientX - rect.left;
      const y = e instanceof MouseEvent 
        ? e.clientY - rect.top 
        : e.touches[0].clientY - rect.top;
      
      setTextPosition({ x, y });
      
      // Show text input dialog
      setCurrentText('');
      const textInput = prompt('Nhập nội dung văn bản:');
      if (textInput) {
        setCurrentText(textInput);
        drawText(x, y, textInput);
      }
      
      setIsAddingText(false);
      return;
    }
    
    if (options.mode === 'move') {
      // In move mode, don't draw
      return;
    }
    
    if (options.mode === 'sticky') {
      // Add sticky note
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = e instanceof MouseEvent 
        ? e.clientX - rect.left 
        : e.touches[0].clientX - rect.left;
      const y = e instanceof MouseEvent 
        ? e.clientY - rect.top 
        : e.touches[0].clientY - rect.top;
      
      const note = prompt('Nhập nội dung ghi chú:');
      if (note) {
        drawStickyNote(x, y, note);
      }
      return;
    }
    
    if (options.mode === 'image') {
      // Trigger file input click
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
      return;
    }
    
    // Set drawing state to true
    setIsDrawing(true);
    
    const canvas = canvasRef.current;
    const context = contextRef.current;
    
    if (!canvas || !context) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e instanceof MouseEvent 
      ? e.clientX - rect.left 
      : e.touches[0].clientX - rect.left;
    const y = e instanceof MouseEvent 
      ? e.clientY - rect.top 
      : e.touches[0].clientY - rect.top;
    
    // Start path
    context.beginPath();
    context.moveTo(x, y);
    
    // Save points for emitting to socket
    drawPoints.current = [{ x, y }];
    
    // For shapes, save start position
    shapeStart.current = { x, y };
  };
  
  // Store drawing points for socket emit
  const drawPoints = useRef<Array<{x: number, y: number}>>([]);
  
  // Store start position for shapes
  const shapeStart = useRef<{x: number, y: number} | null>(null);
  
  // Draw while moving
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const context = contextRef.current;
    
    if (!canvas || !context) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e instanceof MouseEvent 
      ? e.clientX - rect.left 
      : e.touches[0].clientX - rect.left;
    const y = e instanceof MouseEvent 
      ? e.clientY - rect.top 
      : e.touches[0].clientY - rect.top;
    
    if (options.mode === 'pencil') {
      // Continue drawing pencil path
      context.lineTo(x, y);
      context.stroke();
      
      // Save point for socket
      drawPoints.current.push({ x, y });
    } else if (options.mode === 'eraser') {
      // Use eraser (white, larger width)
      const originalColor = context.strokeStyle;
      const originalWidth = context.lineWidth;
      
      context.strokeStyle = '#ffffff';
      context.lineWidth = options.width * 5;
      
      context.lineTo(x, y);
      context.stroke();
      
      // Restore original settings after erasing
      context.strokeStyle = originalColor;
      context.lineWidth = originalWidth;
      
      // Save point for socket
      drawPoints.current.push({ x, y });
    } else if (options.mode === 'rectangle' && shapeStart.current) {
      // Draw preview rectangle (redraw on each move)
      // First, restore the canvas to before we started drawing
      if (historyIndex >= 0) {
        context.putImageData(drawHistory[historyIndex], 0, 0);
      }
      
      // Calculate width and height
      const width = x - shapeStart.current.x;
      const height = y - shapeStart.current.y;
      
      // Draw the rectangle
      context.beginPath();
      context.rect(shapeStart.current.x, shapeStart.current.y, width, height);
      context.stroke();
    } else if (options.mode === 'circle' && shapeStart.current) {
      // Draw preview circle (redraw on each move)
      // First, restore the canvas to before we started drawing
      if (historyIndex >= 0) {
        context.putImageData(drawHistory[historyIndex], 0, 0);
      }
      
      // Calculate radius based on distance
      const radius = Math.sqrt(
        Math.pow(x - shapeStart.current.x, 2) + 
        Math.pow(y - shapeStart.current.y, 2)
      );
      
      // Draw the circle
      context.beginPath();
      context.arc(shapeStart.current.x, shapeStart.current.y, radius, 0, Math.PI * 2);
      context.stroke();
    }
  };
  
  // Stop drawing
  const stopDrawing = () => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    
    const canvas = canvasRef.current;
    const context = contextRef.current;
    
    if (!canvas || !context) return;
    
    // Complete the drawing
    context.closePath();
    
    // Send drawing to server
    if (socketRef.current && drawPoints.current.length > 0) {
      if (options.mode === 'pencil' || options.mode === 'eraser') {
        socketRef.current.emit('draw', {
          type: 'path',
          points: drawPoints.current,
          options: {
            color: options.mode === 'eraser' ? '#ffffff' : options.color,
            width: options.mode === 'eraser' ? options.width * 5 : options.width,
            mode: options.mode,
            font: options.font,
            fontSize: options.fontSize
          }
        });
      } else if (options.mode === 'rectangle' && shapeStart.current) {
        const lastPoint = drawPoints.current[drawPoints.current.length - 1];
        
        // Calculate width and height
        const width = lastPoint.x - shapeStart.current.x;
        const height = lastPoint.y - shapeStart.current.y;
        
        socketRef.current.emit('draw', {
          type: 'rectangle',
          points: {
            x: shapeStart.current.x,
            y: shapeStart.current.y,
            width,
            height
          },
          options: {
            color: options.color,
            width: options.width,
            mode: options.mode,
            font: options.font,
            fontSize: options.fontSize
          }
        });
      } else if (options.mode === 'circle' && shapeStart.current) {
        const lastPoint = drawPoints.current[drawPoints.current.length - 1];
        
        // Calculate radius
        const radius = Math.sqrt(
          Math.pow(lastPoint.x - shapeStart.current.x, 2) + 
          Math.pow(lastPoint.y - shapeStart.current.y, 2)
        );
        
        socketRef.current.emit('draw', {
          type: 'circle',
          points: {
            x: shapeStart.current.x,
            y: shapeStart.current.y,
            radius
          },
          options: {
            color: options.color,
            width: options.width,
            mode: options.mode,
            font: options.font,
            fontSize: options.fontSize
          }
        });
      }
    }
    
    // Reset draw points
    drawPoints.current = [];
    
    // Save to history
    saveToHistory();
  };
  
  // Draw text
  const drawText = (x: number, y: number, text: string) => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    
    if (!canvas || !context || !text) return;
    
    // Set font
    context.font = `${options.fontSize}px ${options.font}`;
    context.fillStyle = options.color;
    
    // Draw the text
    context.fillText(text, x, y);
    
    // Send to socket
    if (socketRef.current) {
      socketRef.current.emit('draw', {
        type: 'text',
        points: { x, y },
        text,
        options: {
          color: options.color,
          width: options.width,
          mode: 'text',
          font: options.font,
          fontSize: options.fontSize
        }
      });
    }
    
    // Save to history
    saveToHistory();
  };
  
  // Draw sticky note
  const drawStickyNote = (x: number, y: number, text: string) => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    
    if (!canvas || !context || !text) return;
    
    // Set sticky note style
    const noteWidth = 150;
    const lineHeight = 20;
    const padding = 10;
    
    // Split text into lines
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = context.measureText(testLine);
      
      if (metrics.width > noteWidth - (padding * 2)) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    // Calculate note height
    const noteHeight = lines.length * lineHeight + (padding * 2);
    
    // Draw note background
    context.fillStyle = '#fef3c7'; // Light yellow
    context.fillRect(x, y, noteWidth, noteHeight);
    
    // Draw note border
    context.strokeStyle = '#d97706'; // Amber
    context.lineWidth = 1;
    context.strokeRect(x, y, noteWidth, noteHeight);
    
    // Draw text
    context.fillStyle = '#000000';
    context.font = `${options.fontSize}px ${options.font}`;
    
    for (let i = 0; i < lines.length; i++) {
      context.fillText(
        lines[i],
        x + padding,
        y + padding + (i * lineHeight) + options.fontSize / 2
      );
    }
    
    // Send to socket (as an image for simplicity)
    if (socketRef.current) {
      const imageData = canvas.toDataURL('image/png');
      socketRef.current.emit('draw', {
        type: 'image',
        points: { x: 0, y: 0 },
        imageUrl: imageData,
        options: {
          color: options.color,
          width: options.width,
          mode: 'image'
        }
      });
    }
    
    // Save to history
    saveToHistory();
  };
  
  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const context = contextRef.current;
        
        if (!canvas || !context) return;
        
        // Draw image at center
        const x = (canvas.width - img.width) / 2;
        const y = (canvas.height - img.height) / 2;
        
        context.drawImage(img, x, y);
        
        // Send to socket
        if (socketRef.current) {
          socketRef.current.emit('draw', {
            type: 'image',
            points: { x, y },
            imageUrl: event.target?.result,
            options: {
              color: options.color,
              width: options.width,
              mode: 'image'
            }
          });
        }
        
        // Save to history
        saveToHistory();
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Clear canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    
    if (!canvas || !context) return;
    
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Notify other users
    if (socketRef.current) {
      socketRef.current.emit('clear-whiteboard');
    }
    
    // Save to history
    saveToHistory();
  };
  
  // Save canvas as image
  const saveAsImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `whiteboard-${new Date().toISOString()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  // Change drawing tool
  const changeTool = (tool: DrawingMode) => {
    setOptions({ ...options, mode: tool });
    setIsAddingText(tool === 'text');
  };
  
  // Change color
  const changeColor = (color: string) => {
    setOptions({ ...options, color });
    
    const context = contextRef.current;
    if (context) {
      context.strokeStyle = color;
      context.fillStyle = color;
    }
  };
  
  // Change stroke width
  const changeWidth = (width: string) => {
    const newWidth = parseInt(width);
    setOptions({ ...options, width: newWidth });
    
    const context = contextRef.current;
    if (context) {
      context.lineWidth = newWidth;
    }
  };
  
  // Change font
  const changeFont = (font: string) => {
    setOptions({ ...options, font });
  };
  
  // Change font size
  const changeFontSize = (size: string) => {
    const newSize = parseInt(size);
    setOptions({ ...options, fontSize: newSize });
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="bg-white border-b p-2 flex flex-wrap gap-1">
        <div className="tools-group flex space-x-1 mr-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={`h-8 w-8 ${options.mode === 'pencil' ? 'bg-muted' : ''}`}
                  onClick={() => changeTool('pencil')}
                >
                  <Pencil size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Bút vẽ</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={`h-8 w-8 ${options.mode === 'eraser' ? 'bg-muted' : ''}`}
                  onClick={() => changeTool('eraser')}
                >
                  <Eraser size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Tẩy</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={`h-8 w-8 ${options.mode === 'rectangle' ? 'bg-muted' : ''}`}
                  onClick={() => changeTool('rectangle')}
                >
                  <Square size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Hình chữ nhật</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={`h-8 w-8 ${options.mode === 'circle' ? 'bg-muted' : ''}`}
                  onClick={() => changeTool('circle')}
                >
                  <Circle size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Hình tròn</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={`h-8 w-8 ${options.mode === 'text' ? 'bg-muted' : ''}`}
                  onClick={() => changeTool('text')}
                >
                  <Type size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Văn bản</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={`h-8 w-8 ${options.mode === 'sticky' ? 'bg-muted' : ''}`}
                  onClick={() => changeTool('sticky')}
                >
                  <StickyNote size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ghi chú</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={`h-8 w-8 ${options.mode === 'image' ? 'bg-muted' : ''}`}
                  onClick={() => changeTool('image')}
                >
                  <Image size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Chèn hình ảnh</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={`h-8 w-8 ${options.mode === 'move' ? 'bg-muted' : ''}`}
                  onClick={() => changeTool('move')}
                >
                  <Move size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Di chuyển</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="format-group flex items-center space-x-1 mr-4">
          <input
            type="color"
            value={options.color}
            onChange={(e) => changeColor(e.target.value)}
            className="w-8 h-8 rounded p-0 cursor-pointer"
            title="Chọn màu"
          />
          
          <Select
            value={options.width.toString()}
            onValueChange={changeWidth}
          >
            <SelectTrigger className="w-18 h-8">
              <SelectValue placeholder="Độ dày" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Mảnh</SelectItem>
              <SelectItem value="2">Bình thường</SelectItem>
              <SelectItem value="4">Dày</SelectItem>
              <SelectItem value="8">Rất dày</SelectItem>
            </SelectContent>
          </Select>
          
          {(options.mode === 'text' || options.mode === 'sticky') && (
            <>
              <Select
                value={options.font}
                onValueChange={changeFont}
              >
                <SelectTrigger className="w-24 h-8">
                  <SelectValue placeholder="Font" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Arial">Arial</SelectItem>
                  <SelectItem value="Times New Roman">Times</SelectItem>
                  <SelectItem value="Courier New">Courier</SelectItem>
                  <SelectItem value="Georgia">Georgia</SelectItem>
                  <SelectItem value="Verdana">Verdana</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={options.fontSize.toString()}
                onValueChange={changeFontSize}
              >
                <SelectTrigger className="w-18 h-8">
                  <SelectValue placeholder="Cỡ chữ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">12px</SelectItem>
                  <SelectItem value="16">16px</SelectItem>
                  <SelectItem value="20">20px</SelectItem>
                  <SelectItem value="24">24px</SelectItem>
                  <SelectItem value="32">32px</SelectItem>
                </SelectContent>
              </Select>
            </>
          )}
        </div>
        
        <div className="action-group flex space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={undo}
                  disabled={historyIndex <= 0}
                >
                  <Undo size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Hoàn tác</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={redo}
                  disabled={historyIndex >= drawHistory.length - 1}
                >
                  <Redo size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Làm lại</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 text-red-500"
                  onClick={clearCanvas}
                >
                  <Trash2 size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Xóa tất cả</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={saveAsImage}
                >
                  <Download size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Tải xuống</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      {/* Canvas */}
      <div className="flex-grow relative bg-gray-50 overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="touch-none"
        />
        
        {/* Hidden file input for image upload */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageUpload}
        />
      </div>
    </div>
  );
};

export default Whiteboard;