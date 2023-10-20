import { db } from "@/prisma/config";

export const GET = async () => {
  try {
    const data = await db.post.findMany({
      include: {
        author: true,
      },
    });

    return Response.json({
      total: data?.length || 0,
      posts: data,
    });
  } catch (error) {
    console.log(error);

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
