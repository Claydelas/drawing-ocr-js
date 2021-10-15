import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React from 'react'

import CanvasDraw from "react-canvas-draw";
import Tesseract from 'tesseract.js';


const Home: NextPage = () => {
  
  const [prediction, setPrediction] = React.useState("")

  function predict(canvas:CanvasDraw | any){
    Tesseract.recognize(
      canvas.canvas.drawing,
      'eng'
    ).then((prediction) => {
      console.log(prediction.data)
      setPrediction(prediction.data.text)
    })
  }
  
  return (
    <div className={styles.container}>
      <Head>
        <title>OCR</title>
        <meta name="description" content="Handwritten text recognition." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 style={{textAlign:'center'}}>{prediction || "Predicted text will appear here"}</h1>
        <div className={styles.canvas}>
          <CanvasDraw brushRadius={3} canvasWidth={1000} canvasHeight={400} onChange={predict} lazyRadius={0} hideGrid={true}></CanvasDraw>
        </div>
      </main>

    </div>
  )
}

export default Home
