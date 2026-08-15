// app/api/users/route.ts

import { auth } from "@/auth";

export async function GET() {
  const session = await auth();

  if (!session) {
    return Response.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  // Get token internally from your Auth.js JWT/session mechanism
  // and call your backend here.

  return Response.json({
    success: true,
  });
}