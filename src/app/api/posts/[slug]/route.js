import { getAuthSession } from "@/utils/auth";
import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

// GET SINGLE POST
export const GET = async (req, { params }) => {
  const { slug } = params;

  try {
    // fetch the post and increment views in one transaction (if you want)
    const post = await prisma.post.findUnique({
      where: { slug },
      include: { user: true },
    });

    if (!post) {
      return new NextResponse(
        JSON.stringify({ message: "Post not found!" }, null, 2),
        { status: 404 }
      );
    }

    // Optionally increment views
    await prisma.post.update({
      where: { slug },
      data: { views: { increment: 1 } },
    });

    return new NextResponse(
      JSON.stringify(post, null, 2),
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }, null, 2),
      { status: 500 }
    );
  }
};

// UPDATE A POST
export const PUT = async (req, { params }) => {
  const { slug } = params;
  const session = await getAuthSession();

  if (!session) {
    return new NextResponse(
      JSON.stringify({ message: "Not Authenticated!" }, null, 2),
      { status: 401 }
    );
  }

  try {
    const body = await req.json();

    const existingPost = await prisma.post.findUnique({
      where: { slug },
    });

    if (!existingPost) {
      return new NextResponse(
        JSON.stringify({ message: "Post not found!" }, null, 2),
        { status: 404 }
      );
    }

    if (existingPost.userEmail !== session.user.email) {
      return new NextResponse(
        JSON.stringify({ message: "Unauthorized!" }, null, 2),
        { status: 403 }
      );
    }

    const post = await prisma.post.update({
      where: { slug },
      data: { ...body },
    });

    return new NextResponse(JSON.stringify(post, null, 2), { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }, null, 2),
      { status: 500 }
    );
  }
};

// DELETE A POST
export const DELETE = async (req, { params }) => {
  const { slug } = params;
  const session = await getAuthSession();

  if (!session) {
    return new NextResponse(
      JSON.stringify({ message: "Not Authenticated!" }, null, 2),
      { status: 401 }
    );
  }

  try {
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    });

    if (!existingPost) {
      return new NextResponse(
        JSON.stringify({ message: "Post not found!" }, null, 2),
        { status: 404 }
      );
    }

    if (existingPost.userEmail !== session.user.email) {
      return new NextResponse(
        JSON.stringify({ message: "Unauthorized!" }, null, 2),
        { status: 403 }
      );
    }

    await prisma.post.delete({
      where: { slug },
    });

    return new NextResponse(
      JSON.stringify({ message: "Post deleted!" }, null, 2),
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }, null, 2),
      { status: 500 }
    );
  }
};