const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Verify both users exist
  const users = await prisma.user.findMany({
    where: { 
      email: { 
        in: ["gh.kmar5@gmail.com", "ghofranebouallegue5@gmail.com"] 
      } 
    }
  })

  if (users.length !== 2) {
    const missingUsers = ["gh.kmar5@gmail.com", "ghofranebouallegue5@gmail.com"]
      .filter(email => !users.some(u => u.email === email))
    throw new Error(`Missing users: ${missingUsers.join(", ")}`)
  }

  // Get existing categories
  const categorySlugs = ["food", "travel", "culture", "coding", "lifestyle", "fashion"]
  const existingCategories = await prisma.category.findMany({
    where: { slug: { in: categorySlugs } }
  })

  // Verify all categories exist
  const missingCategories = categorySlugs.filter(
    slug => !existingCategories.some(c => c.slug === slug))
  
  if (missingCategories.length > 0) {
    throw new Error(`Missing categories: ${missingCategories.join(", ")}`)
  }

  // Create posts distributed between users
  const posts = await prisma.$transaction([
    // User 1 posts
    prisma.post.create({
      data: {
        slug: "best-local-dishes",
        title: "Best Local Dishes You Must Try",
        desc: "Exploring the most delicious traditional foods in our region.",
        catSlug: "food",
        userEmail: "gh.kmar5@gmail.com",
        img: "/food.jpg"
      }
    }),
    prisma.post.create({
      data: {
        slug: "hidden-gem-destinations",
        title: "Hidden Gem Travel Destinations",
        desc: "Lesser-known but amazing places you should visit.",
        catSlug: "travel",
        userEmail: "gh.kmar5@gmail.com",
        img: "/travel.jpg"
      }
    }),
    prisma.post.create({
        data: {
          slug: "fashion trends",
          title: "Fashion Trends to Watch",
          desc: "fashionfashionfashionfashionfashion",
          catSlug: "fashion",
          userEmail: "ghofranebouallegue5@gmail.com",
          img: "/travel.jpg"
        }
      }),
    prisma.post.create({
      data: {
        slug: "cultural-traditions",
        title: "Fascinating Cultural Traditions",
        desc: "Exploring unique customs from around the world.",
        catSlug: "culture",
        userEmail: "gh.kmar5@gmail.com",
        img: "/culture.jpg"
      }
    }),

    // User 2 posts
    prisma.post.create({
      data: {
        slug: "prisma-tutorial",
        title: "Getting Started with Prisma",
        desc: "A beginner's guide to using Prisma with MongoDB.",
        catSlug: "coding",
        userEmail: "ghofranebouallegue5@gmail.com",
        img: "/tss.jpg"
      }
    }),
    prisma.post.create({
      data: {
        slug: "daily-productivity-hacks",
        title: "Daily Productivity Hacks",
        desc: "Simple tricks to make your day more efficient.",
        catSlug: "lifestyle",
        userEmail: "ghofranebouallegue5@gmail.com",
        img: "/totally spies.jpg"
      }
    })
  ])

  console.log("Successfully created posts:")
  posts.forEach(post => {
    console.log(`- ${post.title} by ${post.userEmail} in ${post.catSlug} category`)
  })

  // Create some sample comments
  const comments = await prisma.$transaction([
    prisma.comment.create({
      data: {
        desc: "Great post! I tried these dishes last week.",
        userEmail: "ghofranebouallegue5@gmail.com",
        postSlug: "best-local-dishes"
      }
    }),
    prisma.comment.create({
      data: {
        desc: "Very helpful tutorial, thanks!",
        userEmail: "gh.kmar5@gmail.com",
        postSlug: "prisma-tutorial"
      }
    })
  ])

  console.log("\nCreated sample comments:")
  comments.forEach(comment => {
    console.log(`- "${comment.desc}" by ${comment.userEmail}`)
  })
}

main()
  .catch(e => {
    console.error("Error:", e.message)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })