import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/service/posts";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  console.log(res);

  const formData = await req.formData();

  try {
    console.log(formData.get("upload"));
    const file = formData.get("upload") as File | null;
    if (!file) {
      return res
        .status(400)
        .json({ error: 'No file uploaded with key "upload"' });
    }
    const fileUrl = await uploadImage(file);

    console.log("업로드 성공");
    return Response.json({
      uploaded: true,
      url: fileUrl,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
}
