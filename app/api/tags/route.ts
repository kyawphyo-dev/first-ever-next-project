import Tag from "@/database/tag.model";
import dbConnect from "@/lib/dbConnect";
import { errorResponse, successResponse } from "@/lib/response";
import { CreateTagSchema } from "@/lib/schemas/TagSchema";

// get all users
export async function GET() {
  try {
    // connect to db
    await dbConnect();
    // get all tags
    const tags = await Tag.find();
    // return users
    return successResponse(tags, 200);
  } catch (e) {
    return errorResponse(e, 500);
  }
}

// create user
export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();

    // Validate the data
    const validatedData = CreateTagSchema.parse(data);

    const { name, description } = validatedData;

    const existingName = await Tag.findOne({ name });
    if (existingName) {
      throw new Error("Tag name already exists!");
    }

    //create User
    const tag = new Tag(validatedData);
    await tag.save();

    return successResponse(tag, 201);
  } catch (e) {
    return errorResponse(e, 400);
  }
}
