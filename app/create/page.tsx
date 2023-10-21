"use client";

import Header from "@/components/custom/header";
import { useAuth } from "@/components/providers/auth-providers";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@/interfaces";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";

const CreatePost = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();

  const createPost = async ({
    title,
    body,
    authorId,
  }: {
    title: string;
    body: string;
    authorId: string;
  }) => {
    try {
      const payload = JSON.stringify({ title, body, authorId });

      const response = await fetch("/api/v1/post/create", {
        body: payload,
        method: "POST",
      });

      const data: Promise<User> = await response.json();

      router.push(`/post/${(await data).id}`);
      toast({
        title: "Post created",
      });
    } catch (error) {
      console.log(error);

      toast({
        title: "Failed to add post",
        variant: "destructive",
      });
    }
  };

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
      title: "",
      body: "",
    },
  });

  const onSubmit = async () => {
    createPost({
      title: form.getValues().title,
      body: form.getValues().body,
      authorId: user?.id as string,
    });
  };

  return (
    <div className="w-full">
      <Header />
      <div className="w-full max-w-3xl mx-auto">
        <div className="flex w-full items-center justify-between">
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
                  <Button type="submit">Create</Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
