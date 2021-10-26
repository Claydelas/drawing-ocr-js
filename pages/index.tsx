import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import CanvasDraw from "react-canvas-draw";
import StyledSlider from '../components/StyledSlider';
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
    <GlobalHotKeys allowChanges={true} handlers={keyHandlers} keyMap={keyMap}>
      <div>
        <Head>
          <title>OCR</title>
          <meta name="description" content="Handwritten text recognition." />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="flex flex-col items-center min-h-screen justify-evenly bg-gradient-to-br from-red-300 to-indigo-400">
          <p>
            Save the current prediction with <strong>ENTER</strong>. <br />
            Hold <strong>E</strong> while drawing to erase. <br />
            Undo with <strong>CTRL+Z</strong>.
          </p>
          <div className="flex flex-col items-center justify-center gap-5">
            <h1 className="font-sans text-5xl text-center">
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
              <StyledSlider brushSize={brushSize} setBrushSize={setBrushSize}></StyledSlider>
            </div>
            <h1 className="font-sans text-xl text-center">
              {out || ""}
            </h1>
          </div>
        </main>
      </div>
    </GlobalHotKeys>
  )
}

export default Home
