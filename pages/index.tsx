import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import CanvasDraw from "react-canvas-draw";
import Slider from '@mui/material/Slider';

import Tesseract from 'tesseract.js';

import { GlobalHotKeys, configure, KeyMap } from "react-hotkeys";
configure({ ignoreTags: [] })

import debounce from 'lodash.debounce';

const Home: NextPage = () => {

  const [out, setOut] = React.useState("");
  const [preview, setPreview] = React.useState("");
  const [erasing, setErasing] = React.useState(false)
  const [brushSize, setBrushSize] = React.useState(6)


  const canvasRef = React.useRef<CanvasDraw>(null);

  const debouncedPredict = React.useMemo(() => debounce(predict, 300), []);

  // cleanup
  React.useEffect(() => {
    return () => {
      debouncedPredict.cancel();
    }
  }, []);

  const undoHandler = () => {
    canvasRef.current?.undo();
  }

  const updateHandler = () => {
    setOut(out + preview);
    setPreview("");
    canvasRef.current?.clear();
  }

  const keyMap: KeyMap = {
    UNDO: "ctrl+z",
    UPDATE: "enter",
    ERASE_ON: { sequence: "e", action: "keydown" },
    ERASE_OFF: { sequence: "e", action: "keyup" }
  };

  const keyHandlers = {
    UNDO: undoHandler,
    UPDATE: updateHandler,
    ERASE_ON: () => setErasing(true),
    ERASE_OFF: () => setErasing(false)
  };

  function predict(canvas: CanvasDraw | any) {
    if (canvas.isDrawing)
      return;
    Tesseract.recognize(
      canvas.canvas.drawing,
      'eng'
    ).then((prediction) => {
      setPreview(prediction.data.text);
    });
  }

  return (
    <GlobalHotKeys handlers={keyHandlers} keyMap={keyMap}>
      <div className="dark">
        <Head>
          <title>OCR</title>
          <meta name="description" content="Handwritten text recognition." />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="flex flex-col justify-center items-center min-h-screen gap-5 dark:bg-gray-800 dark:text-white">
          <h1 className="font-sans text-center text-5xl">
            {preview || "Draw something to see a preview :)"}
          </h1>
          <div className="flex gap-x-5">

            <div className="border-2 border-black">
              <CanvasDraw
                ref={canvasRef}
                brushRadius={brushSize}
                brushColor={erasing ? "#FFFFFF" : "#444"}
                canvasWidth={1000}
                canvasHeight={400}
                lazyRadius={0}
                hideGrid={true}
                onChange={debouncedPredict} />
            </div>
            <Slider
              marks={true}
              valueLabelDisplay='auto'
              orientation="vertical"
              className="h-auto"
              min={0}
              max={10}
              value={brushSize}
              onChange={(event, v) => {
                event.stopPropagation()
                setBrushSize(v as number);
              }}
            />
          </div>
          <h1 className="font-sans text-center text-xl">
            {out || ""}
          </h1>
        </main>
      </div>
    </GlobalHotKeys>
  )
}

export default Home
