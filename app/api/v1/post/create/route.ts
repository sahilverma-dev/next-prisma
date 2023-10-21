import { db } from "@/prisma/config";

export const POST = async (req: Request) => {
  try {
    const payload = await req.json();
    const { title, body, authorId } = payload;

    const newPost = await db.post.create({
      data: {
        title,
        body,
        authorId,
        slug: title?.replaceAll(" ", "-"),
      },
    });

    return Response.json(
      {
        ...newPost,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        success: false,
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
};
