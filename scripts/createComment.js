const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // First comment (the one that worked)
  await prisma.comment.create({
    data: {
      desc: "Sample comment 1",
      user: { connect: { email: "gh.kmar5@gmail.com" } },
      post: { connect: { slug: "aa" } }
    }
  })

  // Second comment
  await prisma.comment.create({
    data: {
      desc: "This is another helpful comment",
      user: { connect: { email: "gh.kmar5@gmail.com" } },
      post: { connect: { slug: "aa" } }
    }
  })

  // Third comment
  await prisma.comment.create({
    data: {
      desc: "Just adding one more thought here",
      user: { connect: { email: "gh.kmar5@gmail.com" } },
      post: { connect: { slug: "aa" } }
    }
  })

  console.log("Successfully created 3 comments!")
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())