"use client";

import { Post } from "@/interfaces";
import { FC, FormEvent, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useMutation } from "@tanstack/react-query";

import Link from "next/link";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

interface Props {
  post: Post;
}

const PostCard: FC<Props> = ({ post }) => {
  const { toast } = useToast();
  const router = useRouter();

  const formSchema = z.object({
    title: z
      .string()
      .min(1, { message: "Title must be at least 1 character long." })
      .max(100, { message: "Title can't exceed 100 characters." }),

    body: z
      .string()
      .min(1, { message: "Body must be at least 1 character long." })
      .max(5000, { message: "Body can't exceed 5000 characters." }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post.title,
      body: post.body,
    },
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const updatePost: (data: {
    id: string;
    title: string;
    body: string;
  }) => Promise<Post | undefined> = async ({ id, title, body }) => {
    try {
      const payload = JSON.stringify({
        title,
        body,
      });
      const response = await fetch(`http://localhost:3000/api/v1/post/${id}`, {
        method: "PATCH",
        body: payload,
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data: any = await response.json();
      return data as Post;
    } catch (error) {
      console.log(error);
    }
  };

  //   const formMutation = useMutation(
  //     () => {
  //       const { title, body } = form.getValues();

  //       return updatePost({
  //         id: post.id as string,
  //         title,
  //         body,
  //       });
  //     },
  //     {
  //       onSuccess: () => {
  //         toast({
  //           title: "Thanks for contacting",
  //         });
  //       },
  //       onError: (err: any) => {
  //         console.log(err);
  //         toast({
  //           title: "Something went wrong",
  //           variant: "destructive",
  //         });
  //       },
  //     }
  //   );

  // const formMutation = useMutation(
  //     {
  //      mutationFn:()=>{

  //      }
  //     }
  // )

  const onSubmit = () => {
    // e.preventDefault();
    console.log(form.getValues());
    updatePost({
      body: form.getValues().body,
      title: form.getValues().title,
      id: post.id,
    });
  };

  const deletePost = async () => {
    try {
      await fetch(`http://localhost:3000/api/v1/post/${post.id}`, {
        method: "DELETE",
      });
      setShowDeleteModal(false);
      router.replace("/");
      toast({
        title: "Post Deleted",
      });
    } catch (error) {
      toast({
        title: "Failed to delete the post",
        variant: "destructive",
      });
      console.log(error);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex w-full items-center justify-between">
            <CardTitle>{post.title}</CardTitle>
            <div className="flex gap-3 items-center">
              <Button
                variant={"default"}
                onClick={() => setShowEditModal(true)}
              >
                Update
              </Button>
              <Button
                variant={"destructive"}
                onClick={() => setShowDeleteModal(true)}
              >
                Delete
              </Button>
            </div>
          </div>
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
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update {post.title}</DialogTitle>
            <DialogDescription>Update your post data</DialogDescription>
          </DialogHeader>
          <div className="w-full p-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your title" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="body"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Body</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your Body" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex w-full justify-end pt-4 items-center gap-2">
                  <Button type="submit">Update</Button>
                  <Button
                    variant={"destructive"}
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Do you want to delete this post?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
            <div className="flex w-full justify-end pt-4 items-center gap-2">
              <Button variant={"destructive"} onClick={deletePost}>
                Delete
              </Button>
              <Button onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PostCard;
