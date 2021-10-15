import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import CanvasDraw from "react-canvas-draw";
import Tesseract from 'tesseract.js';

import Hotkeys from 'react-hot-keys';
import debounce from 'lodash.debounce';

const Home: NextPage = () => {

  const [out, setOut] = React.useState("");
  const [preview, setPreview] = React.useState("");

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
    <div className="dark">
      <Hotkeys keyName="ctrl+z" onKeyDown={undoHandler} />
      <Hotkeys keyName="enter" onKeyDown={updateHandler} />
      <Head>
        <title>OCR</title>
        <meta name="description" content="Handwritten text recognition." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col justify-center items-center min-h-screen gap-5 dark:bg-gray-800 dark:text-white">
        <h1 className="font-sans text-center text-5xl">
          {preview || "Draw something to see a preview :)"}
        </h1>
        <div className="border-2 border-black">
          <CanvasDraw
            ref={canvasRef}
            brushRadius={6}
            canvasWidth={1000}
            canvasHeight={400}
            lazyRadius={0}
            hideGrid={true}
            onChange={debouncedPredict} />
        </div>
        <h1 className="font-sans text-center text-xl">
          {out || ""}
        </h1>
      </main>
    </div>
  )
}

export default Home
