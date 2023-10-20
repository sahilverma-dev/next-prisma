import { db } from "@/prisma/config";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  try {
    const data = await db.post.findFirst({
      where: {
        id,
      },
      include: {
        author: true,
      },
    });

    return Response.json({
      ...data,
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
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const payload = await req.json();

  const { title, body } = payload;

  try {
    const postExist = await db.post.findUnique({ where: { id } });

    if (!postExist) {
      return Response.json(
        {
          message: "Post not found for this id",
        },
        {
          status: 404,
        }
      );
    }

    const updatePost = await db.post.update({
      where: { id },
      data: {
        title,
        body,
      },
    });

    return Response.json(
      {
        message: "Post updated",
        post: updatePost,
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
}

// delete
export const DELETE = async (
  _: Request,
  { params }: { params: { id: string } }
) => {
  const { id } = params;

  try {
    const postExist = await db.post.findUnique({ where: { id } });

    if (!postExist) {
      return Response.json(
        {
          message: "Post not found for this id",
        },
        {
          status: 404,
        }
      );
    }

    await db.post.delete({ where: { id } });

    return Response.json({
      message: "post deleted",
    });
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
