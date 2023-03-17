// pages/api/counter.ts
import { NextApiRequest, NextApiResponse } from "next";
import { encode } from "gpt-3-encoder";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { prompt } = req.body;
  const encodedInput = encode(prompt);
  const tokenCount = encodedInput.length;
  res.status(200).json({ tokenCount });
}
