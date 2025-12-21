import { NextResponse } from "next/server";
import { sendTemplatedEmail } from "@/lib/sendTemplatedEmail";

export async function POST(req: Request) {
  try {
    const { email, firstName } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email required" },
        { status: 400 }
      );
    }

    await sendTemplatedEmail({
      templateKey: "welcome",
      to: email,
      variables: {
        first_name: firstName ?? "",
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Welcome email API error:", err);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}





