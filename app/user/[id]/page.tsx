import Header from "@/components/custom/header";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User } from "@/interfaces";

import Link from "next/link";

const getUser = async (id: string) => {
  const response = await fetch(`http://localhost:3000/api/v1/user/${id}`, {
    cache: "no-cache",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const data: any = await response.json();
  return data as User;
};

const UserPage = async ({ params }: any) => {
  const { id } = params;
  const user = await getUser(id as string);
  return (
    <div className="w-full">
      <Header />

      <div className="w-full max-w-3xl mx-auto p-4">
        <Card>
          <CardContent className="grid gap-6 pt-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage
                    src={user.avatarImage}
                    className="object-cover"
                  />
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">
                    {user.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <p className={buttonVariants({ variant: "outline" })}>
                {user.posts.length} Posts
              </p>
            </div>
          </CardContent>
        </Card>
        <div className="flex w-full items-center justify-between">
          <h1 className="text-xl font-bold my-4">Posts</h1>
        </div>
        <div className="w-full flex flex-col gap-4">
          {user.posts?.map((post) => (
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
                  href={`/user/${user.id}`}
                  target="_blank"
                  className="text-blue-500 "
                >
                  {user?.name}
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserPage;
