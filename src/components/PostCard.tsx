import { Post } from "@/service/posts";
import Image from "next/image";
import Link from "next/link";

function formatDate(date: string) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "Asia/Seoul", // 시간대를 명시적으로 설정
  };

  return new Intl.DateTimeFormat("ko-KR", options).format(new Date(date));
}

type Props = { post: Post };
export default function PostCard({
  post: { title, description, createdAt, category, thumbnail, fileUrl, _id },
}: Props) {
  const formattedDate = formatDate(createdAt);
  return (
    <a href={`/posts/${_id}`}>
      <article className="rounded-md overflow-hidden shadow-md hover:shadow-xl">
        <Image
          className="w-full"
          src={thumbnail}
          alt={title}
          width={300}
          height={200}
        />
        <div className="flex flex-col items-center p-4">
          <time className=" text-gray-700">{formattedDate}</time>
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="w-full truncate text-center">{description}</p>
          <span className="text-sm rounded-lg bg-green-100 px-2 my-2">
            {category}
          </span>
        </div>
      </article>
    </a>
  );
}
