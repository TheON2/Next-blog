import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: String, // 문자열
    description: String, // 문자열
    category: String, // 문자열
    thumbnail: String, // 문자열 (URL)
    featured: Boolean, // 불리언
    fileUrl:String,
  },
  {
    timestamps: true, // createdAt 및 updatedAt 타임스탬프 자동 생성
  }
);

const PostModel = mongoose.models.post || mongoose.model("post", postSchema);

export default PostModel;
