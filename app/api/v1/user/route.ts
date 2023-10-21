import { db } from "@/prisma/config";

export const POST = async (req: Request) => {
  const { email } = await req.json();

  try {
    const data = await db.user.findFirst({
      where: {
        email,
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
};
