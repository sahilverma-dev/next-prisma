import { db } from "@/prisma/config";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  try {
    const data = await db.user.findFirst({
      where: {
        id,
      },
      include: {
        posts: true,
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
