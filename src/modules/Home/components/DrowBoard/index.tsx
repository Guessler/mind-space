// src/modules/Home/components/DrawBoard.tsx

import {
  Box,
  Paper,
  Toolbar,
  Button,
  Divider,
  styled,
  useTheme,
} from '@mui/material';
import {
  Edit as PencilIcon,
  AutoStories as PenIcon,
  Highlight as MarkerIcon,
  CleaningServices as EraserIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
  Delete as TrashIcon,
} from '@mui/icons-material';
import { useEffect, useRef, useState } from 'react';

const CanvasArea = styled(Paper)(({ theme }) => ({
  flexGrow: 1,
  backgroundColor: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 0,
  border: `1px dashed ${theme.palette.divider}`,
  overflow: 'hidden',
}));

type Tool = 'pencil' | 'pen' | 'marker' | 'eraser';

const TOOL_SETTINGS: Record<Tool, { color: string; size: number }> = {
  pencil: { color: '#000000', size: 2 },
  pen: { color: '#0000ff', size: 3 },
  marker: { color: '#ff0000', size: 8 },
  eraser: { color: '#ffffff', size: 15 },
};

export const DrawBoard = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<Tool>('pencil');
  const [history, setHistory] = useState<string[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const theme = useTheme();

  // Инициализация canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Адаптация под DPR (device pixel ratio)
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement?.getBoundingClientRect();
    if (!rect) return;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = TOOL_SETTINGS.pencil.color;
    ctx.lineWidth = TOOL_SETTINGS.pencil.size;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    contextRef.current = ctx;
    saveState();
  }, []);

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL();
    const newHistory = history.slice(0, historyStep + 1);
    setHistory([...newHistory, dataUrl]);
    setHistoryStep(newHistory.length);
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    const ctx = contextRef.current;
    if (!ctx) return;

    const { color, size } = TOOL_SETTINGS[currentTool];
    ctx.strokeStyle = color;
    ctx.lineWidth = size;

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const pos = getMousePos(e);
    const ctx = contextRef.current;
    if (!ctx) return;
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveState();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
  };

  const undo = () => {
    if (historyStep > 0) {
      const newStep = historyStep - 1;
      const img = new Image();
      img.src = history[newStep];
      img.onload = () => {
        const ctx = contextRef.current;
        if (!ctx) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        setHistoryStep(newStep);
      };
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      const newStep = historyStep + 1;
      const img = new Image();
      img.src = history[newStep];
      img.onload = () => {
        const ctx = contextRef.current;
        if (!ctx) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        setHistoryStep(newStep);
      };
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100%',
        bgcolor: 'grey.100',
      }}
    >
      {/* Панель инструментов */}
      <Paper elevation={2} square>
        <Toolbar sx={{ gap: 1 }}>
          <Button
            variant={currentTool === 'pencil' ? 'contained' : 'outlined'}
            size="small"
            title="Карандаш"
            onClick={() => setCurrentTool('pencil')}
          >
            <PencilIcon fontSize="small" />
          </Button>
          <Button
            variant={currentTool === 'pen' ? 'contained' : 'outlined'}
            size="small"
            title="Ручка"
            onClick={() => setCurrentTool('pen')}
          >
            <PenIcon fontSize="small" />
          </Button>
          <Button
            variant={currentTool === 'marker' ? 'contained' : 'outlined'}
            size="small"
            title="Маркер"
            onClick={() => setCurrentTool('marker')}
          >
            <MarkerIcon fontSize="small" />
          </Button>
          <Button
            variant={currentTool === 'eraser' ? 'contained' : 'outlined'}
            size="small"
            title="Ластик"
            onClick={() => setCurrentTool('eraser')}
          >
            <EraserIcon fontSize="small" />
          </Button>

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          <Button
            variant="outlined"
            size="small"
            title="Назад"
            onClick={undo}
            disabled={historyStep <= 0}
          >
            <UndoIcon fontSize="small" />
          </Button>
          <Button
            variant="outlined"
            size="small"
            title="Вперёд"
            onClick={redo}
            disabled={historyStep >= history.length - 1}
          >
            <RedoIcon fontSize="small" />
          </Button>

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          <Button
            variant="outlined"
            size="small"
            title="Очистить холст"
            color="error"
            onClick={clearCanvas}
          >
            <TrashIcon fontSize="small" />
          </Button>
        </Toolbar>
      </Paper>

      {/* Холст */}
      <CanvasArea>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          style={{ width: '100%', height: '100%' }}
        />
      </CanvasArea>
    </Box>
  );
};