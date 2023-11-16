import {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { readFile } from "fs/promises";
import path from "path";
import { cache } from "react";

export type Post = {
  title: string;
  description: string;
  date: Date;
  category: string;
  path: string;
  featured: boolean;
};

export type PostData = Post & {
  content: string;
  next: Post | null;
  prev: Post | null;
};

const awsConfig = {
  region: process.env.NEXT_PUBLIC_AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY as string,
  },
};

const s3Client = new S3Client(awsConfig);

export async function getFeaturedPosts(): Promise<Post[]> {
  return getAllPosts() //
    .then((posts) => posts.filter((post) => post.featured));
}

export async function getNonFeaturedPosts(): Promise<Post[]> {
  return getAllPosts() //
    .then((posts) => posts.filter((post) => !post.featured));
}

export const getAllPosts = cache(async () => {
  const filePath = path.join(process.cwd(), "data", "posts.json");
  return readFile(filePath, "utf-8")
    .then<Post[]>(JSON.parse)
    .then((posts) => posts.sort((a, b) => (a.date > b.date ? -1 : 1)));
});

export const getAllPost = async () => {
  const bucketName = "theon2blog"; // S3 버킷 이름 설정

  // S3 버킷에서 객체 목록을 가져옵니다.
  const listObjectsCommand = new ListObjectsV2Command({
    Bucket: bucketName,
    Prefix: "blog/", // 게시글이 위치한 디렉토리 경로를 Prefix로 지정
  });

  try {
    const { Contents } = await s3Client.send(listObjectsCommand);
    if (!Contents) {
      return [];
    }

    // 각 객체의 내용을 읽어옵니다.
    const postsPromises = Contents.map(async (object) => {
      if (!object.Key) {
        return null;
      }

      const getObjectCommand = new GetObjectCommand({
        Bucket: bucketName,
        Key: object.Key,
      });

      // 객체의 URL을 가져옵니다. (옵션: 서명된 URL 사용)
      // const url = await getSignedUrl(s3Client, getObjectCommand, { expiresIn: 3600 });

      // 객체의 내용을 직접 가져옵니다.
      const { Body } = await s3Client.send(getObjectCommand);
      const bodyContents = await streamToString(Body); // 스트림을 문자열로 변환하는 helper 함수
      console.log("바디컨텐츠" + bodyContents);

      return bodyContents; // JSON으로 파싱된 객체를 반환
    });

    // 모든 게시글을 읽어옵니다.
    return (await Promise.all(postsPromises)).filter((post) => post !== null);
  } catch (error) {
    console.error("Error fetching posts from S3", error);
    throw new Error("Error fetching posts from S3");
  }
};

// 스트림을 문자열로 변환하는 helper 함수
const streamToString = async (stream) => {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk instanceof Buffer ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf-8");
};

export async function getPostData(fileName: string): Promise<PostData> {
  const filePath = path.join(process.cwd(), "data", "posts", `${fileName}.md`);
  const posts = await getAllPosts();
  const post = posts.find((post) => post.path === fileName);

  if (!post) throw new Error(`${fileName}에 해당하는 포스트를 찾을 수 없음`);

  const index = posts.indexOf(post);
  const next = index > 0 ? posts[index - 1] : null;
  const prev = index < posts.length ? posts[index + 1] : null;
  const content = await readFile(filePath, "utf-8");

  return { ...post, content, next, prev };
}

export async function uploadImage(file: File): Promise<string> {
  const fileName = file.name;
  const buffer = Buffer.from(await file.arrayBuffer());

  await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
    })
  );

  return `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${fileName}`;
}

export async function uploadPostData(
  htmlContent: string,
  contentType: string = "text/html"
): Promise<string> {
  console.log("진입함");
  const fileName = `blog/${Date.now()}.html`;
  const buffer = Buffer.from(htmlContent, "utf-8");

  console.log("buffer" + htmlContent);
  console.log("buffer" + fileName);

  await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: contentType,
    })
  );

  return `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${fileName}`;
}
