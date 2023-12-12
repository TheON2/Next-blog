import {
  DeleteObjectCommand,
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
  thumbnail: string;
  date: string;
  postId: string;
  featured: boolean;
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

    const transformedPosts = posts.map((post) => {
      return {
        ...post.toObject(),
        _id: post._id.toString(), // ObjectId를 문자열로 변환
      };
    });
    return transformedPosts;
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
  const postId = post._id;
  const featured = post.featured;
  const thumbnail = post.thumbnail;

  return {
    title,
    category,
    date,
    description,
    featured,
    fileUrl,
    thumbnail,
    next,
    prev,
    postId,
  };
}

export async function getPostHTML(contentUrl: string): Promise<string> {
  const noCacheUrl = `${contentUrl}?nocache=${new Date().getTime()}`;
  let htmlContent;
  try {
    const response = await fetch(noCacheUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    htmlContent = await response.text();
  } catch (error) {
    console.error("Failed to fetch content", error);
  }

  return htmlContent as string;
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

export async function updatePostData(
  postName: string,
  htmlContent: string,
  contentType: string = "text/html"
): Promise<string> {
  const safeFileName = encodeURIComponent(postName).replace(/%/g, "") + ".html";
  const buffer = Buffer.from(htmlContent, "utf-8");

  await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
      Key: `blog/${safeFileName}`,
      Body: buffer,
      ContentType: contentType,
    })
  );

  return `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/blog/${safeFileName}`;
}

export async function deletePostData(postName: string): Promise<void> {
  // URL에서 안전한 파일 이름 생성
  const safeFileName = encodeURIComponent(postName).replace(/%/g, "") + ".html";

  // S3 클라이언트를 사용하여 DeleteObjectCommand 실행
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
      Key: `blog/${safeFileName}`,
    })
  );

  console.log(`Deleted: blog/${safeFileName}`);
}