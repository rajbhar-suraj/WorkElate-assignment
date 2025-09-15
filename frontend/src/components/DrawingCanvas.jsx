import React from 'react'
import Toolbar from './ToolBar'
import { useRef, useState, useEffect } from 'react'
import useFeatures from '../store/Feature'

const DrawingCanvas = () => {
  const canvasRef = useRef(null)
  const { roomId, newSocket } = useFeatures()
  const [color, setColor] = useState("black")
  const [strokeWidth, setStrokeWidth] = useState("2")
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(false)
  const [lastY, setLastY] = useState(false)

  //calculating the size of the canva
  useEffect(() => {
    const canvas = canvasRef.current;
    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
      }
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  useEffect(() => {
    if (!newSocket || !roomId) return; // wait until socket and roomId exist
    // Join room
    newSocket.emit('join-room', roomId);

    // Listen for drawing history
    const handleHistory = (history) => {
      const ctx = canvasRef.current.getContext('2d');
      history.forEach(cmd => {
        if (cmd.type === 'stroke') {
          const { prevX, prevY, x, y, color, strokeWidth } = cmd.data;
          ctx.strokeStyle = color;
          ctx.lineWidth = strokeWidth;
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(x, y);
          ctx.stroke();
        } else if (cmd.type === 'clear') {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      });
    };

    newSocket.on('drawing-history', handleHistory);

    // Cleanup
    return () => {
      newSocket.off('drawing-history', handleHistory);
    };
  }, [newSocket, roomId]); // <- run again when socket or roomId is ready


 useEffect(() => {
  if (!newSocket) return;

  const handleDraw = (data) => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.strokeStyle = data.color;
    ctx.lineWidth = data.strokeWidth;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(data.prevX, data.prevY);
    ctx.lineTo(data.x, data.y);
    ctx.stroke();
  };

  const handleClear = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  newSocket.on("draw", handleDraw);
  newSocket.on("clear-canvas", handleClear);

  return () => {
    newSocket.off("draw", handleDraw);
    newSocket.off("clear-canvas", handleClear);
  };
}, [newSocket]);


  function clearCanvas() {
    const ctx = canvasRef.current.getContext("2d")
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    if (!newSocket || !roomId) return; // wait until socket and roomId exist

    newSocket.emit('clear-canvas', roomId)
  }

  function startDrawing(e) {
    const ctx = canvasRef.current.getContext("2d");
    ctx.strokeStyle = color
    ctx.lineWidth = strokeWidth
    ctx.lineCap = "round"
    ctx.beginPath()
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
    if (!newSocket || !roomId) return; // wait for socket and roomId

    newSocket.emit("draw", {
      roomId,
      data: {
        prevX: e.nativeEvent.offsetX,
        prevY: e.nativeEvent.offsetY,
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY,
        color,
        strokeWidth,
      }
    });
  }


  function draw(e) {
    if (!isDrawing) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();

    if (!newSocket || !roomId) return;

    newSocket.emit("draw", {
      roomId,
      data: {
        prevX: lastX,
        prevY: lastY,
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY,
        color,
        strokeWidth,
      }
    });
    setLastX(e.nativeEvent.offsetX);
    setLastY(e.nativeEvent.offsetY);
  }
  function stopDrawing() {
    setIsDrawing(false);

  }
  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      {/* Toolbar always at the top */}
      <div className="bg-gray-100  shadow-md">
        <Toolbar
          color={color}
          setColor={setColor}
          strokeWidth={strokeWidth}
          setStrokeWidth={setStrokeWidth}
          clearCanvas={clearCanvas}
        />
      </div>

      {/* Canvas fills rest of screen */}
      <div className="flex-1">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="w-full h-full bg-white"
        />
      </div>
    </div>
  )
}

export default DrawingCanvas