import { NextApiRequest, NextApiResponse } from "next";
import { uploadPostData } from "@/service/posts";

export const config = {
  api: {
    bodyParser: {
      parse: true,
    },
  },
};

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const chunks = [];
  const stream = req.body;
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  const body = Buffer.concat(chunks).toString("utf-8");

  const json = JSON.parse(body);
  const content = json.content;

  try {
    const fileUrl = await uploadPostData(content);
    console.log("업로드 성공");
    return Response.json({
      uploaded: true,
      url: fileUrl,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      Response.json({ error: error.message }), { status: 500 };
    } else {
      Response.json({ error: "An unknown error occurred" }), { status: 500 };
    }
  }
}
