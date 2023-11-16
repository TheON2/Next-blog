import { NextApiRequest, NextApiResponse } from "next";
import { uploadPostData } from "@/service/posts";
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

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

  const { htmlContent, title, description, category, thumbnail, featured } =
    json.postData;

  try {
    const fileUrl = await uploadPostData(htmlContent);

    // MongoDB에 데이터 저장
    const client = await MongoClient.connect(
      process.env.NEXT_PUBLIC_MONGODB_URI as string
    );
    const db = client.db();
    const collection = db.collection("theblog");
    await collection.insertOne({
      title,
      date: Date.now(),
      description,
      category,
      thumbnail,
      featured,
    });

    console.log("업로드 성공");
    return new Response(JSON.stringify({ message: "게시글 업로드 성공" }), {
      status: 200,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    } else {
      new Response(JSON.stringify({ error: "An unknown error occurred" }), {
        status: 500,
      });
    }
  }
}
