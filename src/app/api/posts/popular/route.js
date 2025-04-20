import { NextResponse } from "next/server";
import prisma from "@/utils/connect";

export const dynamic = "force-dynamic"; // prevent caching issues

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        views: "desc",
      },
      take: 3,
      include: {
        user: {
          select: { name: true },
        },
        cat: {
          select: { slug: true },
        },
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("[GET popular posts error]", error);
    return NextResponse.json(
      { message: "Failed to fetch popular posts" },
      { status: 500 }
    );
  }
}
