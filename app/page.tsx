import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Post } from "@/interfaces";
import Link from "next/link";

const getPosts = async (): Promise<Post[]> => {
  const response = await fetch("http://localhost:3000/api/v1/post/get", {
    cache: "no-cache",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const data: any = await response.json();
  return data?.posts as Post[];
};

const Home = async () => {
  const posts = await getPosts();

  return (
    <div className="w-full p-4">
      <div className="w-full max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Posts</h1>
        <div className="w-full flex flex-col gap-4">
          {posts?.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <CardTitle>
                  <div className="flex w-full items-center justify-between">
                    {post.title}
                    <Link
                      href={`/post/${post.id}`}
                      className={buttonVariants({
                        variant: "default",
                        className: "mb-4",
                      })}
                    >
                      Open
                    </Link>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{post.body}</p>
              </CardContent>
              <CardFooter className="inline-flex items-center gap-2">
                <b>Author:</b>
                <Link
                  href={`/author/${post.author.id}`}
                  target="_blank"
                  className="text-blue-500 "
                >
                  {post?.author?.name}
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
