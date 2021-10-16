// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import Tesseract from 'tesseract.js';

// prone to server overload from spamming prediction requests
// doesn't currently validate images before attempting OCR
// possibly able to access local files via the image parameter
// TODO: implement ability to pass OCR target language as parameter
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Tesseract.Page | {}>
) {
  switch (req.method) {
    case 'POST':
      if (req.body.image) {
        return Tesseract.recognize(req.body.image, 'eng').then((pred) => {
          let { text, confidence } = pred.data
          res.status(200).json({ text, confidence })
        })
          .catch((error) => {
            console.error(error)
            res.status(400).send("Image format not supported.")
          })
      }
      break;

    default:
      res.status(500)
  }

}
