const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // First verify how many posts exist
  const postCount = await prisma.post.count()
  console.log(`Found ${postCount} posts to delete`)

  if (postCount === 0) {
    console.log('No posts found to delete')
    return
  }

  // Delete in transaction to ensure data consistency
  const deleteResult = await prisma.$transaction([
    // First delete all comments (since they depend on posts)
    prisma.comment.deleteMany(),
    
    // Then delete all posts
    prisma.post.deleteMany()
  ])

  console.log(`\nSuccessfully deleted:
  - ${deleteResult[1].count} posts
  - ${deleteResult[0].count} comments`)

  // Verify deletion
  const remainingPosts = await prisma.post.count()
  const remainingComments = await prisma.comment.count()
  console.log(`\nRemaining in database:
  - Posts: ${remainingPosts}
  - Comments: ${remainingComments}`)
}

main()
  .catch(e => {
    console.error('Deletion failed:', e.message)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })