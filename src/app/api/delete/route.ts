import { NextApiRequest, NextApiResponse } from "next";
import {
  deletePostData,
  updatePostData,
  uploadPostData,
} from "@/service/posts";
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import PostModel from "@/models/post";

export const config = {
  api: {
    bodyParser: {
      parse: true,
    },
  },
};

export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const chunks = [];
  const stream = req.body;
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  const body = Buffer.concat(chunks).toString("utf-8");

  const json = JSON.parse(body);

  let { fileName, postId } = json.postData;

  console.log(json.postData);

  try {
    await deletePostData(fileName);
    await mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_URI as string);
    const deletedPost = await PostModel.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({ message: "게시글을 찾을 수 없음" });
    }

    console.log("게시글 삭제 성공");
    return new Response(JSON.stringify({ message: "게시글 삭제 성공" }), {
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
