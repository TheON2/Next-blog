import {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { readFile } from "fs/promises";
import path from "path";
import { cache } from "react";
import mongoose from "mongoose";
import Post from "@/models/post";
import PostModel from "@/models/post";

export type Post = {
  _id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string; // 추가된 필드
  featured: boolean;
  createdAt?: Date; // 자동 생성되는 필드, 선택적으로 설정
  fileUrl: string;
};

export type PostData = {
  title: string;
  fileUrl: string;
  category: string;
  date: string;
  description: string;
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

export const getAllPosts = async () => {
  try {
    // MongoDB 데이터베이스에 연결
    await mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_URI as string);

    // 데이터베이스에서 모든 게시글을 검색
    const posts = await PostModel.find({}); // 모든 게시글을 검색
    console.log(posts);

    return posts; // 검색된 게시글 반환
  } catch (error) {
    console.error("Error fetching posts from MongoDB", error);
    throw new Error("Error fetching posts from MongoDB");
  }
};

export async function getPostData(slug: string): Promise<PostData> {
  const posts = await getAllPosts();
  console.log(posts);
  const post = posts.find((post) => post._id.toString() === slug);

  console.log("post" + post);

  if (!post) throw new Error(`${slug}에 해당하는 포스트를 찾을 수 없음`);

  const index = posts.indexOf(post);
  const next = index > 0 ? posts[index - 1] : null;
  const prev = index < posts.length ? posts[index + 1] : null;
  const fileUrl = post.fileUrl;
  const title = post.title;
  const description = post.description;
  const category = post.category;
  const date = post.createdAt;

  return { title, category, date, description, fileUrl, next, prev };
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
