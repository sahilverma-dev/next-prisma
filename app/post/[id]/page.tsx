import PostCard from "@/components/custom/post-card";
import { buttonVariants } from "@/components/ui/button";
import { Post } from "@/interfaces";
import Link from "next/link";

const getPost = async (id: string): Promise<Post> => {
  const response = await fetch(`http://localhost:3000/api/v1/post/${id}`, {
    cache: "no-cache",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const data: any = await response.json();
  return data as Post;
};

const Post = async ({ params }: any) => {
  const { id } = params;
  const post = await getPost(id as string);

  return (
    <div className="w-full p-4">
      <div className="w-full max-w-3xl mx-auto ">
        <Link
          href={"/"}
          className={buttonVariants({ variant: "default", className: "mb-4" })}
        >
          Back
        </Link>
        <PostCard post={post} />
      </div>
    </div>
  );
};

export default Post;
