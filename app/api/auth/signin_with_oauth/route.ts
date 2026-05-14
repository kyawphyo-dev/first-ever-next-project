import User from "@/database/user.model";
import dbConnect from "@/lib/dbConnect";
import { SignInWithOAuthSchema } from "@/lib/schemas/SignInWithOAuthSchema";
import slugify from "slugify";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    // restructure data and connect to db
    const { provider, providerAccountId, user } = await req.json();
    await dbConnect();
    // start transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // validate data
      const validatedData = SignInWithOAuthSchema.parse({
        provider,
        providerAccountId,
        user,
      });

      const {
        provider: vProvider,
        providerAccountId: vProviderAccountId,
        user: vUser,
      } = validatedData;
      const { email, name, username, image } = vUser;

      // check if user exists
      const existingUser = await User.findOne({ email }).session(session);

      if (!existingUser) {
        // create new user if user does not exist
        const [newUser] = await User.create(
          [
            {
              email,
              name,
              username: slugify(username || "", {
                lower: true,
                remove: /[*+~.()'"!:@]/g,
                strict: true,
                trim: true,
              }),
              image,
              provider: vProvider,
              providerAccountId: vProviderAccountId,
            },
          ],
          { session },
        );
        // commit transaction
        await session.commitTransaction();
        return Response.json({ user: newUser }, { status: 201 });
      } else {
        // update user if user exists
        const updatedUser = await User.findOneAndUpdate(
          {
            _id: existingUser._id,
          },
          {
            $set: {
              name,
              image,
              provider: vProvider,
              providerAccountId: vProviderAccountId,
            },
          },
          { new: true, session },
        );
        // commit transaction
        await session.commitTransaction();
        return Response.json({ user: updatedUser }, { status: 200 });
      }
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  } catch (error: unknown) {
    console.log(error);
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
