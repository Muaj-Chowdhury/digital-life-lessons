require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kw3z4m2.mongodb.net/?appName=Cluster0&maxPoolSize=5`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function setupDatabase() {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await client.connect();

    const db = client.db("digitalLifeLessons");
    const usersCollection = db.collection("users");
    const lessonsCollection = db.collection("lessons");
    const favoriteCollection = db.collection("favorites");
    const commentsCollection = db.collection("comments");
    const reportsCollection = db.collection("reports");

    console.log("⚙️ Creating/verifying indexes...");

    await usersCollection.createIndex(
      { email: 1 },
      { unique: true, name: "unique_user_email" },
    );
    await usersCollection.createIndex(
      { createdAt: 1 },
      { name: "users_createdAt_index" },
    );

    await lessonsCollection.createIndex(
      { authorEmail: 1, createdAt: -1 },
      { name: "lesson_author_created_index" },
    );
    await lessonsCollection.createIndex(
      { isFeatured: 1, visibility: 1, isDeleted: 1, updatedAt: -1 },
      { name: "lesson_featured_home_index" },
    );
    await lessonsCollection.createIndex(
      { visibility: 1, isDeleted: 1, favoritesCount: -1 },
      { name: "lesson_most_saved_index" },
    );
    await lessonsCollection.createIndex(
      { visibility: 1, category: 1, tone: 1, createdAt: -1 },
      { name: "lesson_public_filter_created_index" },
    );
    await lessonsCollection.createIndex(
      { existStatus: 1, createdAt: -1 },
      { name: "lesson_status_created_index" },
    );
    await lessonsCollection.createIndex(
      { visibility: 1, category: 1, tone: 1, favoritesCount: -1 },
      { name: "lesson_public_filter_saved_index" },
    );
    await lessonsCollection.createIndex(
      { category: 1, visibility: 1, createdAt: -1 },
      { name: "lesson_category_similar_index" },
    );
    await lessonsCollection.createIndex(
      { title: "text", description: "text" },
      { name: "lesson_text_search_index" },
    );
    await lessonsCollection.createIndex(
      { createdAt: 1 },
      { name: "lesson_createdAt_index" },
    );
    await lessonsCollection.createIndex(
      { isReviewed: 1, isDeleted: 1 },
      { name: "lesson_review_status_index" },
    );
    await lessonsCollection.createIndex(
      { reportCount: -1 },
      { name: "lesson_report_sort_index" },
    );
    await lessonsCollection.createIndex(
      { isDeleted: 1, deletedAt: 1 },
      {
        partialFilterExpression: { isDeleted: true },
        name: "lesson_deleted_partial_index",
      },
    );

    await favoriteCollection.createIndex(
      { userEmail: 1, lessonId: 1 },
      { unique: true, name: "unique_user_favorite" },
    );
    await favoriteCollection.createIndex(
      { lessonId: 1 },
      { name: "favorite_lesson_lookup" },
    );

    await commentsCollection.createIndex(
      { lessonId: 1, createdAt: -1 },
      { name: "comments_lesson_sort_index" },
    );

    await reportsCollection.createIndex(
      { lessonId: 1 },
      { name: "reports_lesson_lookup" },
    );
    await reportsCollection.createIndex(
      { status: 1 },
      { name: "reports_status_index" },
    );

    console.log("✅ Database indexes verified successfully");
  } catch (error) {
    console.error("❌ Database index setup failed:", error);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

setupDatabase();
