import { db } from "@/prisma/config";

export const GET = () => {
  return Response.json({
    hello: "hello",
  });
};

export const POST = async (req: Request) => {
  const body = await req.json();

  const { email, name, avatarImage } = body;

  try {
    const userExist = await db.user.findFirst({
      where: {
        email,
      },
    });

    if (userExist) {
      return Response.json({
        success: true,
        message: "User Found",
        newUser: false,
        user: userExist,
      });
    } else {
      const newUser = await db.user.create({
        data: {
          email,
          name,
          avatarImage,
        },
      });
      return Response.json(
        {
          success: true,
          newUser: true,
          message: "New User Created",
          user: newUser,
        },
        {
          status: 201,
        }
      );
    }
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
