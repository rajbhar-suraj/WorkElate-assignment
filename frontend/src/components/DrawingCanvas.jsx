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
    
    // Listening for drawing history
    const handleHistory = (history) => {
      const ctx = canvasRef.current.getContext('2d');

      history.forEach(cmd => {
        if (cmd.type === 'stroke' && cmd.data) {
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
  }, [newSocket, roomId]);

  function trackCursor(e) {
    if (!newSocket || !roomId) return;

    newSocket.emit("cursor-move", {
      roomId,
      data: {
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY,
        userId: newSocket.id, // or some unique user ID
        color, // optional: match cursor color with user’s pen
      },
    });
  }

  // DRAW START
  useEffect(() => {
    if (!newSocket) return;
    const ctx = canvasRef.current.getContext("2d");

    const handleDrawStart = (data) => {
      ctx.beginPath();
      ctx.moveTo(data.x, data.y);
      ctx.strokeStyle = data.color;
      ctx.lineWidth = data.strokeWidth;
      ctx.lineCap = "round";
    };

    newSocket.on("draw-start", handleDrawStart);
    return () => newSocket.off("draw-start", handleDrawStart);
  }, [newSocket]);

  // DRAW MOVE
  useEffect(() => {
    if (!newSocket) return;
    const ctx = canvasRef.current.getContext("2d");

    const handleDrawMove = (data) => {
      ctx.beginPath();
      ctx.moveTo(data.prevX, data.prevY);
      ctx.lineTo(data.x, data.y);
      ctx.strokeStyle = data.color;
      ctx.lineWidth = data.strokeWidth;
      ctx.lineCap = "round";
      ctx.stroke();
    };

    newSocket.on("draw-move", handleDrawMove);
    return () => newSocket.off("draw-move", handleDrawMove);
  }, [newSocket]);

  // DRAW END
  useEffect(() => {
    if (!newSocket) return;
    const ctx = canvasRef.current.getContext("2d");

    const handleDrawEnd = () => ctx.closePath();

    newSocket.on("draw-end", handleDrawEnd);
    return () => newSocket.off("draw-end", handleDrawEnd);
  }, [newSocket]);

  // CLEAR CANVAS
  useEffect(() => {
    if (!newSocket) return;
    const ctx = canvasRef.current.getContext("2d");

    const handleClear = () => {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    };

    newSocket.on("clear-canvas", handleClear);
    return () => newSocket.off("clear-canvas", handleClear);
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
    setLastX(e.nativeEvent.offsetX);
    setLastY(e.nativeEvent.offsetY);

    if (!newSocket || !roomId) return;
    newSocket.emit("draw-start", {
      roomId,
      data: {
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

    const newX = e.nativeEvent.offsetX;
    const newY = e.nativeEvent.offsetY;

    // Draw clean segment
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);    // start from previous point
    ctx.lineTo(newX, newY);      // draw to current point
    ctx.strokeStyle = color;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = "round";
    ctx.stroke();

    if (!newSocket || !roomId) return;

    newSocket.emit("draw-move", {
      roomId,
      data: {
        prevX: lastX,
        prevY: lastY,
        x: newX,
        y: newY,
        color,
        strokeWidth,
      }
    });

    setLastX(newX);
    setLastY(newY);
  }

  function stopDrawing() {
    setIsDrawing(false);
    if (!newSocket || !roomId) return;

    newSocket.emit("draw-end", {
      roomId,
      data: {} // not much needed here, just to signal stroke completion
    });
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