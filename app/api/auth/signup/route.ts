import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { hashPassword } from "@/lib/auth";
import { type User, sanitizeUser } from "@/lib/models/user";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, email, password, apartmentDetails } = body;

    // Basic validation
    if (!username || !email || !password || !apartmentDetails?.tower || !apartmentDetails?.floor || !apartmentDetails?.flatNumber) {
      return NextResponse.json({ success: false, message: "All fields are required." }, { status: 400 });
    }

    const db = await getDatabase();

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ $or: [ { username }, { email } ] });
    if (existingUser) {
      return NextResponse.json({ success: false, message: "Username or email already exists." }, { status: 409 });
    }

    const now = new Date();
    const hashedPassword = await hashPassword(password);

    const newUser: Omit<User, "_id"> = {
      username,
      email,
      password: hashedPassword,
      role: "resident",
      status: "active",
      apartmentDetails,
      createdAt: now,
      updatedAt: now
    };

    const result = await db.collection("users").insertOne(newUser);
    const createdUser = await db.collection("users").findOne({ _id: result.insertedId });

    if (!createdUser) {
      return NextResponse.json({ success: false, message: "Failed to create user." }, { status: 500 });
    }

    return NextResponse.json({ success: true, user: sanitizeUser(createdUser) });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
  }
}
