require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const admin = require("firebase-admin");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const port = process.env.PORT || 3000;

if (!process.env.FB_SERVICE_KEY) {
  console.error("❌ Error: FB_SERVICE_KEY is missing from .env file");
  process.exit(1); // Stop the server early with a clear message
}
const decoded = Buffer.from(process.env.FB_SERVICE_KEY, "base64").toString(
  "utf-8",
);
const serviceAccount = JSON.parse(decoded);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();

// Modify your MongoDB URI connection options string like this:
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kw3z4m2.mongodb.net/?appName=Cluster0&maxPoolSize=1&maxIdleTimeMS=5000`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
// Global collection references (Your 40 APIs rely on these variables)
let usersCollection, lessonsCollection, favoriteCollection, commentsCollection, reportsCollection, db;

// Track if indexes have been created to prevent redundant runs in serverless environments
let indicesCreated = false; 

// Update your middleware block to match this layout precisely:
app.use(async (req, res, next) => {
  try {
    if (usersCollection && lessonsCollection) {
      return next(); // Connections already live, move forward instantly
    }
    
    await client.connect();
    db = client.db("digitalLifeLessons");
    
    usersCollection = db.collection("users");
    lessonsCollection = db.collection("lessons");
    favoriteCollection = db.collection("favorites");
    commentsCollection = db.collection("comments");
    reportsCollection = db.collection("reports");
    
    // 🔥 SAFE SERVERLESS INDEX RUNNER
    // This guarantees the database is 100% connected before indexing starts,
    // and the tracking variable prevents it from running more than once per container instance.
    if (!indicesCreated) {
      console.log("⚙️ Initializing database indexes...");
      await setupDatabase();
      indicesCreated = true;
      console.log("✅ Database indexes created successfully");
    }
    
    next();
  } catch (error) {
    console.error("❌ Database connection error:", error);
    res.status(500).json({ error: "Database initialization failed" });
  }
});




// 2. WEBHOOK MUST BE HERE (Before express.json())
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    // DEBUG LOGS
    console.log("--- Webhook Attempt ---");
    console.log("Signature present:", !!sig);
    console.log("Webhook Secret present:", !!process.env.STRIPE_WEBHOOK_SECRET);

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      console.error("❌ Verification Failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    // 2. Ensure DB is connected (Important for Vercel!)
    if (!usersCollection) {
      const db = client.db("digitalLifeLessons");
      usersCollection = db.collection("users");
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userEmail = session.metadata?.userEmail;

      console.log("✅ Payment Success for Email:", userEmail);

      if (userEmail) {
        const result = await usersCollection.updateOne(
          { email: userEmail },
          { $set: { isPremium: true, premiumActivatedAt: new Date() } },
        );
        console.log(
          "DB Update Result:",
          result.modifiedCount > 0
            ? "Success"
            : "No user found/Already premium",
        );
      }
    }

    res.json({ received: true });
  },
);
// middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://digital-life-lessons-sl2z.vercel.app",
    ],
    credentials: true,
  }),
);

app.use(express.json());

// middlewares
// jwt middleware
const verifyJWT = async (req, res, next) => {
  const token = req?.headers?.authorization?.split(" ")[1];
  if (!token) return res.status(401).send({ message: "Unauthorized Access!" });
  console.log("token successfully received !");
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.tokenEmail = decoded.email;
    console.log("decoded email:", decoded.email);
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).send({ message: "Unauthorized Access!", err });
  }
};


    // 3 Setup Database Indexes (Inside run)
    const setupDatabase = async () => {
      try {
        /* ---------------- USERS ---------------- */
        await usersCollection.createIndex(
          { email: 1 },
          { unique: true, name: "unique_user_email" },
        );

        // Dashboard growth chart
        await usersCollection.createIndex(
          { createdAt: 1 },
          { name: "users_createdAt_index" },
        );

        /* ---------------- LESSONS ---------------- */

        // Fetch by author + sort by newest (profile/dashboard/my-lessons queries)
        // Replaces redundant single-field authorEmail index
        await lessonsCollection.createIndex(
          { authorEmail: 1, createdAt: -1 },
          { name: "lesson_author_created_index" },
        );

        // Featured lessons query (Home page overview)
        await lessonsCollection.createIndex(
          { isFeatured: 1, visibility: 1, isDeleted: 1, updatedAt: -1 },
          { name: "lesson_featured_home_index" },
        );

        // Most saved lessons query (Home page overview)
        await lessonsCollection.createIndex(
          { visibility: 1, isDeleted: 1, favoritesCount: -1 },
          { name: "lesson_most_saved_index" },
        );

        // Public lessons page filtering + newest sort
        await lessonsCollection.createIndex(
          { visibility: 1, category: 1, tone: 1, createdAt: -1 },
          { name: "lesson_public_filter_created_index" },
        );

        // Public lessons page filtering + popularity sort
        await lessonsCollection.createIndex(
          { visibility: 1, category: 1, tone: 1, favoritesCount: -1 },
          { name: "lesson_public_filter_saved_index" },
        );

        // Similar lessons by category
        await lessonsCollection.createIndex(
          { category: 1, visibility: 1, createdAt: -1 },
          { name: "lesson_category_similar_index" },
        );

        // Text search index for title and description keywords
        await lessonsCollection.createIndex(
          { title: "text", description: "text" },
          { name: "lesson_text_search_index" },
        );

        // Growth chart queries
        await lessonsCollection.createIndex(
          { createdAt: 1 },
          { name: "lesson_createdAt_index" },
        );

        // Admin review + moderation queries
        await lessonsCollection.createIndex(
          { isReviewed: 1, isDeleted: 1 },
          { name: "lesson_review_status_index" },
        );

        // Reports filtering
        await lessonsCollection.createIndex(
          { reportCount: -1 },
          { name: "lesson_report_sort_index" },
        );

        // Soft-delete optimized queries (partial index)
        await lessonsCollection.createIndex(
          { isDeleted: 1, deletedAt: 1 },
          {
            partialFilterExpression: { isDeleted: true },
            name: "lesson_deleted_partial_index",
          },
        );

        /* ---------------- FAVORITES ---------------- */

        // Prevent duplicate favorites
        await favoriteCollection.createIndex(
          { userEmail: 1, lessonId: 1 },
          { unique: true, name: "unique_user_favorite" },
        );

        // Most saved lessons ranking
        await favoriteCollection.createIndex(
          { lessonId: 1 },
          { name: "favorite_lesson_lookup" },
        );

        /* ---------------- COMMENTS ---------------- */

        await commentsCollection.createIndex(
          { lessonId: 1, createdAt: -1 },
          { name: "comments_lesson_sort_index" },
        );

        /* ---------------- REPORTS ---------------- */

        await reportsCollection.createIndex(
          { lessonId: 1 },
          { name: "reports_lesson_lookup" },
        );

        await reportsCollection.createIndex(
          { status: 1 },
          { name: "reports_status_index" },
        );

        console.log(" Database indexes initialized successfully");
      } catch (err) {
        console.error(" Index creation warning:", err.message);
      }
    };



    // role middlewares
    const verifyADMIN = async (req, res, next) => {
      const email = req.tokenEmail;
      const user = await usersCollection.findOne({ email });
      if (user?.role !== "admin")
        return res
          .status(403)
          .send({ message: "Admin only Actions!", role: user?.role });

      next();
    };

    // payment APIs
    app.post("/create-checkout-session", async (req, res) => {
      const { userEmail } = req.body;
      console.log("checkout session email", userEmail);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",

        line_items: [
          {
            price_data: {
              currency: "bdt",
              product_data: { name: "Premium Lifetime Access" },
              unit_amount: 1500 * 100,
            },
            quantity: 1,
          },
        ],

        success_url: `${process.env.CLIENT_DOMAIN}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_DOMAIN}/payment-cancel`,

        metadata: { userEmail },
      });

      res.send({ url: session.url });
    });

    //users related api
    // get user role and access level
    app.get("/users/:email", verifyJWT, async (req, res) => {
      const email = req.params.email;
      console.log(req.params.email);
      if (req.tokenEmail !== email) {
        return res.status(403).send({ message: "forbidden access" });
      }
      const result = await usersCollection.findOne({ email });
      res.send({ role: result?.role, isPremium: result?.isPremium });
    });

    // save or update user
    app.post("/users", async (req, res) => {
      const user = req.body;
      user.createdAt = new Date().toISOString();
      user.loggedInAt = new Date().toISOString();
      user.isPremium = false;
      user.role = "user";
      const existedUser = await usersCollection.findOne({ email: user.email });
      if (existedUser) {
        const result = await usersCollection.updateOne(
          { email: user.email },
          { $set: { loggedInAt: new Date().toISOString() } },
        );
        return res.send(result);
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    // get user profile info with lessons created and saves count
    app.get("/users/profile/:email", verifyJWT, async (req, res) => {
      const email = req.params.email;

      const user = await usersCollection.findOne({ email });

      if (!user) return res.status(404).send({ message: "User not found" });

      const lessonsCreated = await lessonsCollection.countDocuments({
        authorEmail: email,
      });

      const lessonsSaved = await favoriteCollection.countDocuments({
        userEmail: email,
      });

      res.send({
        ...user,
        lessonsCreated,
        lessonsSaved,
      });
    });
    //update user profile info
    app.patch("/users/update-profile/:email", verifyJWT, async (req, res) => {
      const email = req.params.email;
      const { name, image } = req.body;

      const update = {};

      if (name) update.name = name;
      if (image) update.image = image;

      const result = await usersCollection.updateOne(
        { email },
        { $set: update },
      );

      res.send(result);
    });

    // get all users for admin with searching and pagination and lessons created by individual user
    app.get("/admin/users", verifyJWT, verifyADMIN, async (req, res) => {
      try {
        const adminEmail = req.tokenEmail;
        const searchText = req.query.searchText || "";
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const matchStage = {
          email: { $ne: adminEmail },
          ...(searchText && {
            $or: [
              { name: { $regex: searchText, $options: "i" } },
              { email: { $regex: searchText, $options: "i" } },
            ],
          }),
        };

        const result = await db
          .collection("users")
          .aggregate([
            { $match: matchStage },
            {
              $facet: {
                // Track 1: Handle pagination first (Super Fast)
                data: [
                  { $sort: { createdAt: -1 } },
                  { $skip: skip },
                  { $limit: limit },
                  // JOIN AND COUNT ONLY FOR THE RELEVANT PAGE CARDS
                  {
                    $lookup: {
                      from: "lessons",
                      let: { userEmail: "$email" },
                      pipeline: [
                        {
                          $match: {
                            $expr: { $eq: ["$authorEmail", "$$userEmail"] },
                          },
                        },
                        { $count: "count" },
                      ],
                      as: "lessonCountArray",
                    },
                  },
                  {
                    $addFields: {
                      totalLessons: {
                        $ifNull: [
                          { $arrayElemAt: ["$lessonCountArray.count", 0] },

                          0,
                        ],
                      },
                    },
                  },
                  {
                    $project: {
                      lessonCountArray: 0,
                    },
                  },
                ],
                // Track 2: Just count total records matching search filters
                totalCount: [{ $count: "count" }],
              },
            },
          ])
          .toArray();

        // Prevent crashes if database returns empty arrays
        const users = result[0]?.data || [];
        const total = result[0]?.totalCount[0]?.count || 0;

        res.send({
          users,
          total,
          page,
          totalPages: Math.ceil(total / limit),
        });
      } catch (error) {
        console.error("Error fetching admin users:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });
    /**┌─── Track 1: "totalCount" ───> Counts ALL matching users (e.g., 100 users)
                      │
Incoming Filtered ────┤
     Users            │
                      └─── Track 2: "data" ─────────> Pagination ($sort, $skip, $limit to get 10 users)
                                                            │
                                                      Only these 10 users go into the $lookup count! */

    // update user role by admin
    app.patch(
      "/admin/users/:id/role",
      verifyJWT,
      verifyADMIN,
      async (req, res) => {
        const userId = new ObjectId(req.params.id);
        const { role } = req.body;

        await db
          .collection("users")
          .updateOne({ _id: userId }, { $set: { role } });

        res.send({ success: true });
      },
    );

    // delete user by id and all lessons , favorites , comments and reports created by that user
    app.delete("/admin/users/:id", verifyJWT, verifyADMIN, async (req, res) => {
      const userId = new ObjectId(req.params.id);
      const email = req.body.email;
      const deleteRes = await db.collection("users").deleteOne({ _id: userId });
      if (deleteRes.deletedCount === 0) {
        return res.status(404).send({ message: "User not found" });
      }
      await db.collection("lessons").deleteMany({ authorEmail: email });
      await db.collection("favorites").deleteMany({ userEmail: email });
      await db.collection("comments").deleteMany({ userEmail: email });
      await db.collection("reports").deleteMany({ reporterEmail: email });

      res.send({ success: true });
    });

    //user dashboard overview
    app.get("/dashboard/overview", verifyJWT, async (req, res) => {
      try {
        const email = req.query.email;
        if (!email)
          return res.status(400).send({ message: "Email parameter required" });

        // 1. Establish unified time ranges
        const daysLimit = 7;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - (daysLimit - 1));
        startDate.setHours(0, 0, 0, 0);

        // 2. Dispatch all async tasks to execute concurrently
        const [totalLessons, totalFavorites, recentLessons, chartData] =
          await Promise.all([
            lessonsCollection.countDocuments({ authorEmail: email }),
            favoriteCollection.countDocuments({ userEmail: email }),
            lessonsCollection
              .find({ authorEmail: email })
              .sort({ createdAt: -1 })
              .limit(5)
              .toArray(),
            lessonsCollection
              .aggregate([
                {
                  $match: {
                    authorEmail: email,
                    // Ensure comparison works uniformly by storing or converting values cleanly
                    createdAt: { $gte: startDate.toISOString() },
                  },
                },
                {
                  $group: {
                    _id: {
                      $dateToString: {
                        format: "%Y-%m-%d",
                        date: { $toDate: "$createdAt" },
                        timezone: "Asia/Dhaka",
                      },
                    },
                    count: { $sum: 1 },
                  },
                },
                { $sort: { _id: 1 } },
              ])
              .toArray(),
          ]);

        // 3. Build data pad tracking arrays
        const days = [];
        for (let i = daysLimit - 1; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          days.push(d.toISOString().slice(0, 10));
        }

        const map = chartData.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {});

        const finalChartData = days.map((day) => ({
          date: day,
          count: map[day] || 0,
        }));

        res.send({
          stats: { totalLessons, totalFavorites },
          recentLessons,
          finalChartData,
        });
      } catch (error) {
        console.error("Dashboard overview error:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    // lessons related api
    // save/create lesson
    app.post("/lessons", verifyJWT, async (req, res) => {
      const lesson = req.body;
      console.log(req.body);
      const finalLesson = {
        ...lesson,
        likes: [],
        updatedAt: new Date(),
        likesCount: 0,
        favoritesCount: 0,
        isFeatured: false,
        isReviewed: false,
        reportCount: 0,
        existStatus: "active",
        isDeleted: false,
        deletedBy: null,
        deletedAt: null,
        reviewedBy: null,
      };
      const result = await lessonsCollection.insertOne(finalLesson);

      // await lessonsCollection.updateMany(
      //   {}, // Matches all documents
      //   {
      //     $unset: { status: "" }, // Use empty string/1 to remove field
      //     $set: {
      //       updatedAt: new Date()
      //     },
      //   },
      // );
      res.send(result);
    });
    //  public lessons page
    // get all lessons for public lessons page
    app.get("/lessons", async (req, res) => {
      console.log("queries", req.query);

      const { visibility, tone, category, search, sortBy } = req.query;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 4;

      let skip = (page - 1) * limit;
      const query = {};
      if (visibility == "public") query.visibility = "public";

      if (tone) query.tone = tone;

      if (category) query.category = category;

      let sortQuery = {};
      if (sortBy === "mostSaved") sortQuery = { favoritesCount: -1 };
      if (sortBy === "newest") sortQuery = { createdAt: -1 };

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }
      const total = await lessonsCollection.countDocuments(query);
      res.setHeader("X-Total-Count", total);
      const lessons = await lessonsCollection
        .find(query)
        .sort(sortQuery)
        .limit(limit)
        .skip(skip)
        .toArray();

      // console.log( "final data",{lessons , total , totalPages: Math.ceil(total / limit) , currentPage: page})

      res.send({
        lessons: lessons,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      });
    });
    // get lessons for MyLessons page
    app.get("/my-lessons", verifyJWT, async (req, res) => {
      const email = req.query.email;

      const lessons = await lessonsCollection
        .find({ authorEmail: email })
        .sort({ createdAt: -1 })
        .toArray();

      res.send(lessons);
    });
    // get favorite lessons  for user
    app.get("/favorites/:email", verifyJWT, async (req, res) => {
      try {
        const email = req.params.email;
        const { category, tone } = req.query;

        // 1. Build strict filters for the joined collection
        const lessonMatchConditions = [];
        if (category && category !== "all") {
          lessonMatchConditions.push({ $eq: ["$category", category] });
        }
        if (tone && tone !== "all") {
          lessonMatchConditions.push({ $eq: ["$tone", tone] });
        }

        const favorites = await favoriteCollection
          .aggregate([
            {
              // Filter favorites by user immediately (Uses Index)
              $match: { userEmail: email },
            },
            {
              // Optimized Lookup: Filter and Join simultaneously
              $lookup: {
                from: "lessons",
                let: { favLessonId: "$lessonId" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$_id", "$$favLessonId"] },
                          ...lessonMatchConditions, // Only joins if category/tone match!
                        ],
                      },
                    },
                  },
                ],
                as: "lessonDetails",
              },
            },
            {
              // Filter out favorite records that didn't match the lesson criteria
              $match: { "lessonDetails.0": { $exists: true } },
            },
            {
              $unwind: "$lessonDetails",
            },
            {
              $project: {
                _id: 1,
                lessonId: 1,
                createdAt: 1,
                title: "$lessonDetails.title",
                category: "$lessonDetails.category",
                tone: "$lessonDetails.tone",
                image: "$lessonDetails.image",
              },
            },
          ])
          .toArray();

        res.send(favorites);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    // update lesson info for user
    app.patch("/lessons/updateInfo/:id", verifyJWT, async (req, res) => {
      const lessonId = new ObjectId(req.params.id);
      const body = req.body;
      console.log("lesson update info", body);
      if (body === undefined || Object.keys(body).length === 0) {
        return res.send({ message: "No valid fields to update." });
      }
      body.updated = new Date();
      // 1. Define allowed fields (Security)
      const allowed = [
        "visibility",
        "accessLevel",
        "title",
        "description",
        "category",
        "tone",
        "image",
      ];

      // 2. Build the doc (Cleanliness)
      const updateDoc = Object.keys(req.body)
        .filter((key) => allowed.includes(key) && req.body[key] != null)
        .reduce((acc, key) => {
          acc[key] = req.body[key];
          return acc;
        }, {});

      // 3. Update (Efficiency)
      const result = await lessonsCollection.updateOne(
        { _id: lessonId },
        { $set: { ...updateDoc, updatedAt: new Date() } },
      );
      res.send(result);
    });
    // delete lesson for user/admin
    app.delete("/lessons/:id", verifyJWT, async (req, res) => {
      const id = new ObjectId(req.params.id);

      const result = await lessonsCollection.deleteOne({ _id: id });
      await favoriteCollection.deleteMany({ lessonId: id });
      if (result.deletedCount === 0) {
        return res.status(404).send({ message: "Lesson not found." });
      }
      await commentsCollection.deleteMany({ lessonId: id });
      await reportsCollection.deleteMany({ lessonId: id });

      res.send({ success: true });
    });

    // lesson details page
    // get lesson by id
    app.get("/lesson/:id", verifyJWT, async (req, res) => {
      const lessonId = new ObjectId(req.params.id);
      const userEmail = req.query.userEmail;
      const lesson = await lessonsCollection.findOne({ _id: lessonId });
      let isFavorite = false;
      if (userEmail) {
        const fav = await favoriteCollection.findOne({ lessonId, userEmail });
        isFavorite = !!fav; //isFavorite = fav ? true : false;
      }
      res.send({
        ...lesson,
        isFavorite,
      });
    });
    // like lesson by id
    app.put("/lesson/likes/:id", verifyJWT, async (req, res) => {
      const { userEmail } = req.body;
      const { id } = req.params;

      const lessonData = await lessonsCollection.findOne({
        _id: new ObjectId(id),
      });

      const isLiked = lessonData?.likes?.includes(userEmail);
      const updatedDoc = isLiked
        ? { $pull: { likes: userEmail }, $inc: { likesCount: -1 } }
        : { $addToSet: { likes: userEmail }, $inc: { likesCount: 1 } };

      const result = await lessonsCollection.updateOne(
        { _id: new ObjectId(id) },
        updatedDoc,
      );

      const updatedLesson = await lessonsCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send({
        success: true,
        isLiked: !isLiked,
        likesCount: updatedLesson.likes.length,
      });
    });
    // make lessons favorite  by id
    app.post("/lesson/favorites/:id", verifyJWT, async (req, res) => {
      const lessonId = new ObjectId(req.params.id);
      const { userEmail } = req.body;

      const exist = await favoriteCollection.findOne({ lessonId, userEmail });

      if (exist) {
        // remove favorite
        await favoriteCollection.deleteOne({ lessonId, userEmail });

        await lessonsCollection.updateOne({ _id: lessonId }, [
          {
            $set: {
              favoritesCount: {
                $max: [0, { $add: ["$favoritesCount", -1] }], //"$max" compares and substracts ,if the value is lower than 0 it doesn't update . "$add" adds an array of values .
              },
            },
          },
        ]);

        return res.send({ favorited: false });
      } else {
        // add favorite
        await favoriteCollection.insertOne({
          lessonId,
          userEmail,
          createdAt: new Date(),
        });

        await lessonsCollection.updateOne(
          { _id: lessonId },
          { $inc: { favoritesCount: 1 } },
        );

        res.send({ favorited: true });
      }
    });
    // delete from favorites by id and subtract count from lessons collection
    app.delete("/favorites/delete/:id", verifyJWT, async (req, res) => {
      const lessonId = new ObjectId(req.params.id);
      const { userEmail } = req.body;
      console.log("userEmail", userEmail);

      const exist = await favoriteCollection.findOne({ lessonId, userEmail });
      if (!exist) return res.send({ message: "Favorites entry not found." });

      await favoriteCollection.deleteOne({ lessonId, userEmail });
      await lessonsCollection.updateOne({ _id: lessonId }, [
        {
          $set: {
            favoritesCount: {
              $max: [0, { $add: ["$favoritesCount", -1] }], //"$max" compares and substracts ,if the value is lower than 0 it doesn't update . "$add" adds an array of values .
            },
          },
        },
      ]);

      res.send({ success: true });
    });
    // comment on a lesson by id
    app.post("/lesson/comments/:id", verifyJWT, async (req, res) => {
      const id = new ObjectId(req.params.id);
      console.log("id", id);
      const commentData = { lessonId: id, ...req.body };
      const result = await commentsCollection.insertOne(commentData);
      res.send({ success: true, insertedId: result.insertedId });
    });
    // ➤ get comments for lesson
    app.get("/lesson/comments/:id", async (req, res) => {
      const lessonId = new ObjectId(req.params.id);

      const comments = await commentsCollection
        .find({ lessonId })
        .sort({ createdAt: -1 }) // newest first
        .toArray();

      res.send(comments);
    });
    // report on a lesson

    app.post("/lessons/:id/report", verifyJWT, async (req, res) => {
      const lessonId = new ObjectId(req.params.id);
      const { reporterEmail, reason } = req.body;

      const exists = await reportsCollection.findOne({
        lessonId,
        reporterEmail,
        status: "pending",
      });

      if (exists) {
        return res.send({ success: false, message: "Already reported" });
      }

      await reportsCollection.insertOne({
        lessonId,
        reporterEmail,
        reason,
        createdAt: new Date(),
        status: "pending",
      });

      await lessonsCollection.updateOne(
        { _id: lessonId },
        { $inc: { reportCount: 1 } },
      );

      res.send({ success: true });
    });

    // get similar lesson by category
    app.get("/lessons/similar/category/:id", async (req, res) => {
      const lessonId = new ObjectId(req.params.id);

      const lesson = await lessonsCollection.findOne({ _id: lessonId });

      const lessons = await lessonsCollection
        .find({
          _id: { $ne: lessonId },
          category: lesson.category,
          visibility: "public",
        })
        .sort({ createdAt: -1 })
        .limit(6)
        .toArray();

      res.send(lessons);
    });

    // manage lessons page
    // get lessons for admin with pagination and filtering
    app.get("/admin/lessons", verifyJWT, verifyADMIN, async (req, res) => {
      const { page = 1, limit = 10, category, visibility, status } = req.query;
      const skip = (page - 1) * limit;

      const query = { existStatus: "active" };

      if (status === "reported") query.reportCount = { $gt: 0 };
      if (status === "featured") query.isFeatured = true;

      if (category !== "all") query.category = category;
      if (visibility !== "all") query.visibility = visibility;

      console.log("query object", query);

      const result = await lessonsCollection
        .aggregate([
          { $match: query },
          {
            $facet: {
              lessons: [
                { $sort: { createdAt: -1 } },
                { $skip: Number(skip) },
                { $limit: Number(limit) },
                {
                  $project: {
                    title: 1,
                    authorName: 1,
                    visibility: 1,
                    isFeatured: 1,
                    isReviewed: 1,
                    reportCount: 1,
                    createdAt: 1,
                  },
                },
              ],
              total: [{ $count: "count" }],
            },
          },
        ])
        .toArray();

      const lessons = result[0].lessons;
      const total = result[0].total[0]?.count || 0;

      res.send({
        lessons,
        totalPages: Math.ceil(total / limit),
        totalLessons: total,
      });
    });
    //  get lesson details with reports for admin review
    app.get("/admin/lessons/:id", verifyJWT, verifyADMIN, async (req, res) => {
      const lessonId = new ObjectId(req.params.id);

      const lesson = await lessonsCollection.findOne({ _id: lessonId });
      if (!lesson) return res.status(404).send({ message: "Lesson not found" });

      const reports = await reportsCollection
        .find({ lessonId, status: "pending" })
        .sort({ createdAt: -1 })
        .toArray();

      res.send({
        ...lesson,
        reports,
      });
    });
    // toggling a lesson featured or reviewed by admin
    app.patch(
      "/admin/lessons/:id/toggle",
      verifyJWT,
      verifyADMIN,
      async (req, res) => {
        const tokenEmail = req.tokenEmail;
        const lessonId = new ObjectId(req.params.id);
        const { field, actionTakenBy } = req.body; // e.g., { "field": "isFeatured" , "actionTakenBy": "reviewedBy"  }

        // Use an aggregation pipeline to toggle the boolean value atomically
        const result = await lessonsCollection.updateOne({ _id: lessonId }, [
          {
            $set: {
              // Toggle the boolean field
              [field]: { $not: `$${field}` },
              // Update reviewedBy based on the NEW value of the field
              [actionTakenBy]: {
                $cond: {
                  // If the field will be false after the toggle, set to null
                  if: { $eq: [{ $not: `$${field}` }, false] },
                  then: null,
                  else: tokenEmail,
                },
              },
            },
          },
        ]);

        if (result.modifiedCount > 0) {
          res.send({ success: true, message: `${field} toggled successfully` });
        } else {
          res.status(404).send({ success: false, message: "Lesson not found" });
        }
      },
    );

    // get lessons stats for Manage Lessons page
    app.get(
      "/admin/lessons/stats",
      verifyJWT,
      verifyADMIN,
      async (req, res) => {
        const [stats] = await lessonsCollection
          .aggregate([
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                public: {
                  $sum: { $cond: [{ $eq: ["$visibility", "public"] }, 1, 0] },
                },
                private: {
                  $sum: { $cond: [{ $eq: ["$visibility", "private"] }, 1, 0] },
                },
                reported: {
                  $sum: { $cond: [{ $gt: ["$reportCount", 0] }, 1, 0] },
                },
              },
            },
          ])
          .toArray();

        res.send(stats || {});
      },
    );

    // reports collection page
    // get reported lessons for admin
    app.get(
      "/admin/reported-lessons",
      verifyJWT,
      verifyADMIN,
      async (req, res) => {
        try {
          const lessons = await lessonsCollection
            .aggregate([
              {
                // 1. Initial entry filter using indexed fields
                $match: { reportCount: { $gt: 0 } },
              },
              {
                // 2. Optimized Lookup: Search and filter reports simultaneously
                $lookup: {
                  from: "reports",
                  let: { targetLessonId: "$_id" },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            { $eq: ["$lessonId", "$$targetLessonId"] },
                            { $eq: ["$status", "pending"] }, // Filters directly on the disk!
                          ],
                        },
                      },
                    },
                  ],
                  as: "pendingReports",
                },
              },
              {
                // 3. Drop lessons that do not have any ACTIVE pending reports
                $match: { "pendingReports.0": { $exists: true } },
              },
              {
                // 4. Shape cleaner output payload
                $project: {
                  title: 1,
                  reportCount: 1,
                  authorEmail: 1,
                  createdAt: 1,
                  // Accurately extracts values specifically from pending reports
                  reason: { $arrayElemAt: ["$pendingReports.reason", 0] },
                  reporterEmail: {
                    $arrayElemAt: ["$pendingReports.reporterEmail", 0],
                  },
                },
              },
              {
                // 5. Order list by the highest volume of reports
                $sort: { reportCount: -1 },
              },
            ])
            .toArray();

          res.send(lessons);
        } catch (error) {
          console.error("Error fetching reported lessons:", error);
          res.status(500).send({ message: "Internal server error" });
        }
      },
    );

    // get reports for any lessons
    app.get("/admin/reports/:id", verifyJWT, verifyADMIN, async (req, res) => {
      const lessonId = new ObjectId(req.params.id);

      const reports = await reportsCollection
        .find({ lessonId, status: "pending" })
        .sort({ createdAt: -1 })
        .toArray();

      res.send(reports);
    });

    // update lesson reports status
    app.patch(
  "/admin/report/status/:id",
  verifyJWT,
  verifyADMIN,
  async (req, res) => {
    // Start an atomic database session
    const session = client.startSession();
    
    try {
      const lessonId = new ObjectId(req.params.id);
      const { status } = req.body;  // e.g., { "status": "resolved/ignored"}
      const adminEmail = req.tokenEmail;

      if (!status) {
        return res.status(400).send({ success: false, message: "Status parameter is required" });
      }

      // Execute both actions inside a managed ACID transaction
      await session.withTransaction(async () => {
        
        // 1. Bulk update matching reports
        await reportsCollection.updateMany(
          { lessonId, status: "pending" },
          {
            $set: {
              status: status,
              handledBy: adminEmail,
              handledAt: new Date(),
            },
          },
          { session }
        );

        // 2. Optimized static update on the lesson record (Removed aggregate overhead)
        await lessonsCollection.updateOne(
          { _id: lessonId },
          {
            $set: {
              reportCount: 0,
              isReviewed: true,
              reviewedBy: adminEmail,
              updatedAt: new Date() // Keeping timestamps accurate
            },
          },
          { session }
        );
      });
      // // Square brackets enable aggregation pipeline for updates
      //   await lessonsCollection.updateOne({ _id: lessonId }, [
      //     {
      //       // Stage 1: Update the flag first
      //       $set: {
      //         reportCount: 0,
      //         isReviewed: true,
      //       },
      //     },
      //     {
      //       // Stage 2: Reference the flag updated in Stage 1
      //       $set: {
      //         reviewedBy: {
      //           $cond: {
      //             if: { $eq: ["$isReviewed", true] },
      //             then: adminEmail,
      //             else: null,
      //           },
      //         },
      //       },
      //     },
      //   ]);

      res.send({ success: true, message: "Reports handled and lesson status reset successfully." });
    } catch (error) {
      console.error("Failed to update report status transaction:", error);
      res.status(500).send({ success: false, message: "Internal server error" });
    } finally {
      await session.endSession();
    }
  },
);

    // delete lesson and all related reports by admin
    app.delete(
      "/admin/report/delete/:id",
      verifyJWT,
      verifyADMIN,
      async (req, res) => {
        const lessonId = new ObjectId(req.params.id);

        const result = await lessonsCollection.deleteOne({ _id: lessonId });
        if (result.deletedCount === 0) {
          return res.status(404).send({ message: "Lesson not found." });
        }
        await favoriteCollection.deleteMany({ lessonId: lessonId });
        await commentsCollection.deleteMany({ lessonId: lessonId });
        await reportsCollection.deleteMany({ lessonId: lessonId });

        res.send({ success: true });
      },
    );

    // get  AUTHOR INFO
    app.get("/author/:email/summary", verifyJWT, async (req, res) => {
      const email = req.params.email;

      const totalLessons = await lessonsCollection.countDocuments({
        authorEmail: email,
      });

      const author = await lessonsCollection.findOne(
        { authorEmail: email },
        { projection: { authorName: 1, authorImage: 1 } },
      );

      res.send({
        authorName: author?.authorName,
        authorImage: author?.authorImage,
        totalLessons,
      });
    });

    //Admin profile page

    // GET admin profile
    app.get("/admin/profile", verifyJWT, verifyADMIN, async (req, res) => {
      const adminEmail = req.tokenEmail;

      const admin = await usersCollection.findOne(
        { email: adminEmail },
        { projection: { name: 1, email: 1, image: 1, role: 1, createdAt: 1 } },
      );

      res.send(admin);
    });

    // PATCH admin profile
    app.patch("/admin/profile", verifyJWT, verifyADMIN, async (req, res) => {
      const adminEmail = req.tokenEmail;
      const { name, image } = req.body;

      const updateDoc = {};
      if (name) updateDoc.name = name;
      if (image) updateDoc.image = image;

      const result = await usersCollection.updateOne(
        { email: adminEmail },
        { $set: updateDoc },
      );

      res.send({ success: result.modifiedCount > 0 });
    });

    // get admin profile stats
    app.get(
      "/admin/profile/stats",
      verifyJWT,
      verifyADMIN,
      async (req, res) => {
        const email = req.tokenEmail;

        const lessonsReviewed = await lessonsCollection.countDocuments({
          reviewedBy: email,
        });

        const lessonsDeleted = await lessonsCollection.countDocuments({
          deletedBy: email,
        });

        const reportsHandled = await reportsCollection.countDocuments({
          handledBy: email,
        });

        res.send({
          lessonsReviewed,
          lessonsDeleted,
          reportsHandled,
        });
      },
    );

    // Admin dashboard page
    function getLastDays(n = 7) {
      const days = [];
      for (let i = n - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push(d.toISOString().slice(0, 10));
      }
      return days;
    }

    // admin dashboard overview
    app.get(
      "/admin/dashboard/overview",
      verifyJWT,
      verifyADMIN,
      async (req, res) => {
        try {
          const daysLimit = 7;
          const startDate = new Date();
          startDate.setDate(startDate.getDate() - (daysLimit - 1));
          startDate.setHours(0, 0, 0, 0);

          const days = getLastDays(daysLimit);

          const [
            totalUsers,
            totalLessons,
            reportedLessons,
            todayLessons,
            lessonGrowthRaw,
            userGrowthRaw,
            topContributors,
          ] = await Promise.all([
            usersCollection.countDocuments(),
            lessonsCollection.countDocuments({ visibility: "public" }),
            lessonsCollection.countDocuments({ reportCount: { $gt: 0 } }),
            lessonsCollection.countDocuments({
              createdAt: { $gte: new Date().setHours(0, 0, 0, 0) },
            }),

            //  Lesson Growth
            lessonsCollection
              .aggregate([
                {
                  $match: {
                    createdAt: { $gte: startDate.toISOString() },
                  },
                },
                {
                  $group: {
                    _id: {
                      $dateToString: {
                        format: "%Y-%m-%d",
                        date: { $toDate: "$createdAt" },
                        timezone: "Asia/Dhaka",
                      },
                    },
                    count: { $sum: 1 },
                  },
                },
                { $sort: { _id: 1 } },
              ])
              .toArray(),

            //  User Growth
            usersCollection
              .aggregate([
                {
                  $match: {
                    $expr: {
                      $gte: [{ $toDate: "$createdAt" }, startDate],
                    },
                  },
                },
                {
                  $group: {
                    _id: {
                      $dateToString: {
                        format: "%Y-%m-%d",
                        date: { $toDate: "$createdAt" },
                        timezone: "Asia/Dhaka",
                      },
                    },
                    count: { $sum: 1 },
                  },
                },
                { $sort: { _id: 1 } },
              ])
              .toArray(),

            //  Top Contributors
            lessonsCollection
              .aggregate([
                {
                  $group: {
                    _id: "$authorEmail",
                    lessons: { $sum: 1 },
                  },
                },
                { $sort: { lessons: -1 } },
                { $limit: 5 },
                {
                  $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "email",
                    as: "user",
                  },
                },
                { $unwind: "$user" },
                {
                  $project: {
                    _id: 0,
                    email: "$_id",
                    name: "$user.name",
                    lessons: 1,
                  },
                },
              ])
              .toArray(),
          ]);

          //  Fill missing dates
          const fillDates = (raw) => {
            const map = raw.reduce((acc, i) => {
              acc[i._id] = i.count;
              return acc;
            }, {});

            return days.map((day) => ({
              date: day,
              count: map[day] || 0,
            }));
          };
          console.log("lesson growth row", lessonGrowthRaw);

          res.send({
            stats: {
              totalUsers,
              totalLessons,
              reportedLessons,
              todayLessons,
            },
            lessonGrowth: fillDates(lessonGrowthRaw),
            userGrowth: fillDates(userGrowthRaw),

            topContributors,
          });
        } catch (error) {
          res.status(500).send({ message: "Dashboard data fetch failed" });
        }
      },
    );

    // home page contents
    app.get("/home/overview", async (req, res) => {
      try {
        console.log("home overview");
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);

        const [featured, mostSaved, contributors] = await Promise.all([
          //  Featured Lessons
          lessonsCollection
            .find({
              isFeatured: true,
              visibility: "public",
              isDeleted: false,
            })
            .sort({ updatedAt: -1 })
            .limit(6)
            .toArray(),

          //  Most Saved Lessons
          lessonsCollection
            .find({
              visibility: "public",
              isDeleted: false,
            })
            .sort({ favoritesCount: -1 })
            .limit(6)
            .toArray(),

          //  Top Contributors (last 7 days)
          lessonsCollection
            .aggregate([
              {
                $match: {
                  createdAt: { $gte: startDate.toISOString() },
                  isDeleted: false,
                  visibility: "public",
                },
              },
              {
                $group: {
                  _id: "$authorEmail",
                  name: { $first: "$authorName" },
                  lessons: { $sum: 1 },
                },
              },
              { $sort: { lessons: -1 } },
              { $limit: 5 },
            ])
            .toArray(),
        ]);

        res.send({
          featured,
          mostSaved,
          contributors,
        });
      } catch (err) {
        res.status(500).send({ error: true });
      }
    });



app.get("/", (req, res) => {
  res.send("Hello from Server!");
});

// 6. Conditional local listener & Vercel Export
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server running locally on port ${port}`);
  });
}

module.exports = app; // Exposes Express to Vercel's serverless pipeline
