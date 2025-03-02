// 1. Import environment variables
import * as dotenv from "dotenv";
dotenv.config();

// 2. Import necessary libraries
import express from "express";
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import pkg from 'pg';  // Use default import for CommonJS modules
const { Client } = pkg;  
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"; // Correct import for AWS SDK (ES6 syntax)
import multerS3 from 'multer-s3'; // For multer S3 integration
import nodemailer from 'nodemailer';
import { randomInt } from 'crypto';


// 3. Initialize Express app
const app = express();

const allowedOrigins = [
  "https://new-hope-dashboard.vercel.app",
  "https://new-hope-dashboard-58jjy73zk-pallo-banguras-projects.vercel.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
console.log("CORS Options:", corsOptions);

// 5. Middleware: Parse incoming JSON requests and cookies
app.use(express.json());
app.use(cookieParser());

// 6. Serve uploaded files from 'uploads/' folder
app.use("/uploads", express.static("uploads"));

// 7. Configure AWS S3
const s3 = new S3Client({
  region: process.env.AWS_REGION, // e.g. 'us-east-1'
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use a different email service
  auth: {
    user: process.env.EMAIL_USER, // Use your email address
    pass: process.env.EMAIL_PASS, // Use your email password
  },
});

// 8. Setup PostgreSQL Client for database connection
const db = new Client({
  connectionString: process.env.DATABASE_URL,  // Heroku URL or fallback to local config
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,  // SSL in production
});

console.log(db);
// Connect to PostgreSQL
db.connect()
  .then(() => {
    console.log('Connected to PostgreSQL');
  })
  .catch((err) => {
    console.error('❌ Error connecting to PostgreSQL:', err);
  });

// 9. Configure Multer to upload files to S3
const storage = multerS3({
  s3: s3,
  bucket: process.env.AWS_BUCKET_NAME,
  key: function (req, file, cb) {
    cb(null, `delegates/${Date.now()}-${file.originalname}`);
  }
});

// Initialize Multer with the storage settings
const upload = multer({ storage: storage });

// 10. Handling Multer Errors (like file size limit)
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error("🚨 Multer Error:", err);
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File too large. Maximum size allowed is 10MB." });
    }
  }
  next(); // Pass to the next middleware
});



//ROUTES//
//web
app.post("/register", async (req, res) => {
  try {
    const { name, email, phone_number, password } = req.body;

    if (!name || !password || (!email && !phone_number)) {
      return res.status(400).json({ error: "Name, password, and either email or phone number are required." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let query;
    let values;

    if (email) {
      query = "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, 'admin') RETURNING id, name, email, role";
      values = [name, email, hashedPassword];
    } else {
      query = "INSERT INTO users (name, phone_number, password, role) VALUES ($1, $2, $3, 'user') RETURNING id, name, phone_number, role";
      values = [name, phone_number, hashedPassword];
    }

    const result = await db.query(query, values);
    res.status(201).json({ message: "User registered successfully", user: result.rows[0] });

  } catch (err) {
    console.error("❌ Error registering user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// mobile register Route
app.post('/mobile/register', async (req, res) => {
  const { name, phone_number, password } = req.body;

  try {
    // Hash the user's password using bcrypt with 10 salt rounds
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user record into the mobileusers table
    const result = await db.query(
      'INSERT INTO mobileusers (name, phone_number, password) VALUES ($1, $2, $3) RETURNING id',
      [name, phone_number, hashedPassword]
    );

    const userId = result.rows[0].id;
    res.status(200).json({ message: 'Registration successful', userId });
  } catch (err) {
    console.error('Error registering mobile user:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Mobile login route
app.post('/mobile/login', async (req, res) => {
  const { phone_number, password } = req.body;

  try {
    // Query the mobileusers table for a user with the given phone number
    const result = await db.query('SELECT * FROM mobileusers WHERE phone_number = $1', [phone_number]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    // Optionally, create a JWT token for authentication (make sure you have JWT_SECRET in your env variables)
    const token = jwt.sign({ id: user.id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      token,
      user_id: user.id,
      role: 'user'
    });
  } catch (error) {
    console.error('Mobile login error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Login Route
app.post("/login", async (req, res) => {
  try {
    const { email, phone_number, password } = req.body;

    if ((!email && !phone_number) || !password) {
      return res.status(400).json({ error: "Email or Phone number and password are required." });
    }

    let query;
    let value;

    if (email) {
      query = "SELECT * FROM users WHERE email = $1";
      value = email;
    } else {
      query = "SELECT * FROM users WHERE phone_number = $1";
      value = phone_number;
    }

    // Execute the query to check user credentials
    const result = await db.query(query, [value]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email || null, phone_number: user.phone_number || null },
      process.env.JWT_SECRET,  // Get secret from environment variables
      { expiresIn: "1h" }
    );

    // Send the response with token and user info
    res.json({ message: "Login successful", token, user_id: user.id, role: user.role });

  } catch (err) {
    console.error("❌ Error logging in:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Passport JWT strategy setup for protected routes
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET, // Ensure this is set correctly
    },
    async (jwtPayload, done) => {
      try {
        // First, try to find the user in the 'users' table (for web dashboard users)
        let result = await db.query("SELECT id, name, email FROM users WHERE id = $1", [jwtPayload.id]);

        // If not found, check in the 'mobileusers' table (for mobile app users)
        if (result.rows.length === 0) {
          result = await db.query("SELECT id, name, phone_number AS email FROM mobileusers WHERE id = $1", [jwtPayload.id]);
        }

        // If user is still not found, return an error
        if (result.rows.length === 0) {
          return done(null, false); // User not found in either table
        }

        // If user is found in either table, return the user data
        return done(null, result.rows[0]);

      } catch (err) {
        return done(err, false); // Handle any error during querying
      }
    }
  )
);


app.post("/makeadmin", async (req, res) => {
  try {
    const { userId } = req.body;

    // Check if the user exists
    const userCheck = await db.query("SELECT * FROM users WHERE id = $1", [userId]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user's role
    await db.query("UPDATE users SET role = 'admin' WHERE id = $1", [userId]);

    res.status(200).json({ message: "User promoted to admin successfully" });
  } catch (err) {
    console.error("❌ Error promoting user to admin:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching user with ID:", id);

    const result = await db.query("SELECT name, phone_number, role FROM users WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(result.rows[0]); // ✅ Returns phone_number instead of email
  } catch (err) {
    console.error("❌ Error fetching user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.patch("/mobileusers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone_number, password } = req.body;

    if (!name && !phone_number && !password) {
      return res.status(400).json({ error: "At least one field is required." });
    }

    let updateFields = [];
    let values = [];
    let counter = 1; // For parameter numbering

    if (name) {
      updateFields.push(`name = $${counter}`);
      values.push(name);
      counter++;
    }
    if (phone_number) {
      updateFields.push(`phone_number = $${counter}`);
      values.push(phone_number);
      counter++;
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10); // Hash password before storing
      updateFields.push(`password = $${counter}`);
      values.push(hashedPassword);
      counter++;
    }

    // Append the id for the WHERE clause
    values.push(id);

    const query = `UPDATE mobileusers SET ${updateFields.join(", ")} WHERE id = $${counter} RETURNING *`;
    const result = await db.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Mobile user not found." });
    }

    res.json({ message: "Profile updated successfully!", user: result.rows[0] });
  } catch (err) {
    console.error("Error updating mobile user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/protected", passport.authenticate("jwt", { session: false }), (req, res) => {
  res.json({ message: "You are authorized", user: req.user });
});

// API route to fetch delegate data
app.get('/monthlydelegates', async (req, res) => {
  try {
    const result = await db.query('SELECT month, target, engaged FROM monthlydelegates');
    const data = result.rows;
    res.json(data); // Send the data to the frontend
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.get("/mobileusers", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM mobileusers");
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Mobile users not found." });
    }
    // Return the array of mobile users rather than a single user object.
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching mobile users:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.get("/mobileusers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query("SELECT id, name FROM mobileusers WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Mobile user not found." });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching mobile user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/mobileusers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Delete the mobile user with the given id
    const result = await db.query(
      "DELETE FROM mobileusers WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Mobile user not found." });
    }

    res.json({ message: "Mobile user deleted successfully!" });
  } catch (err) {
    console.error("Error deleting mobile user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// API route to fetch delegate organs
app.get('/delegateorgans', async (req, res) => {
  try {
    const result = await db.query("SELECT id, organname, delegateamount, last_engagement FROM delegateorgans");
    
    // Format the date before sending response
    const formattedData = result.rows.map(row => ({
        ...row,
        last_engagement: new Date(row.last_engagement).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        })
    }));

    res.json(formattedData);
} catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
}
});

app.get("/delegates", async (req, res) => {
  const { organname } = req.query;
  try {
    const query = organname
      ? "SELECT * FROM delegates WHERE organname = $1"
      : "SELECT * FROM delegates";
    const values = organname ? [organname] : [];
    const result = await db.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching delegates:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get("/delegateorgans/:organname/delegates", async (req, res) => {
  const { organname } = req.params;
  try {
      const result = await db.query("SELECT * FROM delegates WHERE organname = $1", [organname]);

      if (result.rows.length === 0) {
          return res.status(404).json({ message: "No delegates found for this organ." });
      }

      res.json(result.rows);
  } catch (err) {
      console.error("Error fetching delegates:", err);
      res.status(500).json({ message: "Server error" });
  }
});

// Get details of a specific delegate organ
app.get('/delegate_organs/:organname', async (req, res) => {
  const { organname } = req.params;
  try {
    const result = await db.query(`
      SELECT id, organname, description 
      FROM delegate_organs 
      WHERE organname = $1
    `, [organname]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Delegate organ not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching delegate organ details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Handle Delegate Submission
app.post("/delegates", upload.single("profilepic"), async (req, res) => {
  try {
    const { name, role, phonenumber, email, address, constituency, supportstatus, organname, organ_id } = req.body;
    const profilepic = req.file ? req.file.location : null;  // Get the S3 file URL

    // Insert into PostgreSQL
    const newDelegate = await db.query(
      "INSERT INTO delegates (name, role, phonenumber, email, address, constituency, supportstatus, organname, organ_id, profilepic) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
      [name, role, phonenumber, email, address, constituency, supportstatus, organname, organ_id, profilepic]
    );

    res.status(201).json({ message: "Delegate added successfully", data: newDelegate.rows[0] });
  } catch (err) {
    console.error("Error adding delegate:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//test
//testing

// ✅ API Endpoint for Bulk Delegate Upload
app.post("/delegates/bulk", async (req, res) => {
  try {
    const { delegates } = req.body;
    console.log(delegates);

    if (!Array.isArray(delegates) || delegates.length === 0) {
      return res.status(400).json({ error: "Invalid CSV data." });
    }

    const values = delegates.map(d => [
      d.name, d.role, d.phonenumber, d.email, d.address, d.constituency, d.supportstatus, d.organname
    ]);

    const query = `
      INSERT INTO delegates (name, role, phonenumber, email, address, constituency, supportstatus, organname) 
      VALUES ${values.map(() => "(?, ?, ?, ?, ?, ?, ?, ?)").join(", ")}
    `;

    await db.query(query, values.flat());
    console.log(query);

    res.status(201).json({ message: "Delegates added successfully!" });
  } catch (err) {
    console.error("Error inserting bulk delegates:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Get Single Delegate by ID
app.get("/delegates/:id", async (req, res) => {
  try {
      const { id } = req.params;
      const delegate = await db.query("SELECT * FROM delegates WHERE id = $1", [id]);

      if (delegate.rows.length === 0) {
          return res.status(404).json({ error: "Delegate not found" });
      }

      res.json(delegate.rows[0]);
  } catch (error) {
      console.error("Error fetching delegate:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});


app.patch("/delegates/:id", upload.single("profilepic"), async (req, res) => {
  try {
      const { id } = req.params;
      const { name, role, phonenumber, email, address, constituency, supportstatus, organname, organ_id } = req.body;
      
      // Get the file URL from S3 if a new image was uploaded
      const profilepic = req.file ? req.file.location : null;  // Use req.file.location for the S3 URL

      // Build the update query dynamically
      let updateQuery = "UPDATE delegates SET name=$1, role=$2, phonenumber=$3, email=$4, address=$5, constituency=$6, supportstatus=$7, organname=$8, organ_id=$9";
      let values = [name, role, phonenumber, email, address, constituency, supportstatus, organname, organ_id];

      // Only add profilepic to the update query if it's being updated
      if (profilepic) {
          updateQuery += ", profilepic=$10";
          values.push(profilepic);
      }

      // Add the ID for the WHERE clause
      updateQuery += " WHERE id=$" + (values.length + 1) + " RETURNING *";
      values.push(id);

      const updatedDelegate = await db.query(updateQuery, values);
      
      if (updatedDelegate.rowCount === 0) {
          return res.status(404).json({ error: "Delegate not found" });
      }

      // Return the updated delegate with the new image URL
      res.json({ message: "Delegate updated successfully", data: updatedDelegate.rows[0] });
  } catch (err) {
      console.error("Error updating delegate:", err.message);
      res.status(500).json({ error: "Internal Server Error" });
  }
});


app.delete("/delegates/:id", async (req, res) => {
  try {
      const { id } = req.params;

      // ✅ Get Delegate to Check if Profile Pic Exists
      const delegate = await db.query("SELECT profilepic FROM delegates WHERE id = $1", [id]);
      if (delegate.rows.length === 0) {
          return res.status(404).json({ error: "Delegate not found" });
      }

      // ✅ Delete the Delegate
      await db.query("DELETE FROM delegates WHERE id = $1", [id]);

      res.json({ message: "Delegate deleted successfully!" });
  } catch (err) {
      console.error("Error deleting delegate:", err);
      res.status(500).json({ error: "Failed to delete delegate" });
  }
});

app.get("/engagements/:delegate_id", async (req, res) => {
  try {
    const { delegate_id } = req.params;
    const result = await db.query("SELECT * FROM engagements WHERE delegate_id = $1 ORDER BY date DESC", [delegate_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No engagements found for this delegate." });
    }

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching engagements:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



app.post("/engagements", async (req, res) => {
  try {
    const { date, name, time, details, delegate_id, organ_id } = req.body;

    // ✅ Debugging: Log received request
    console.log("📩 Received Engagement Data:", req.body);

    // ✅ Ensure all required fields are provided
    if (!date || !name || !time || !delegate_id || !organ_id) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // ✅ Insert into PostgreSQL
    const newEngagement = await db.query(
      "INSERT INTO engagements (date, name, time, details, delegate_id, organ_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [date, name, time, details, delegate_id, organ_id]
    );

    res.status(201).json({ message: "Engagement added successfully!", engagement: newEngagement.rows[0] });
  } catch (err) {
    console.error("❌ Error adding engagement:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Delete Engagement
app.delete("/engagements/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEngagement = await db.query("DELETE FROM engagements WHERE id = $1 RETURNING *", [id]);

    if (deletedEngagement.rowCount === 0) {
      return res.status(404).json({ error: "Engagement not found." });
    }

    res.status(200).json({ message: "Engagement deleted successfully!" });
  } catch (err) {
    console.error("❌ Error deleting engagement:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/campaigns", async (req, res) => {
  try {
    const campaigns = await db.query("SELECT * FROM campaigns");
    
    // Replace the localhost URL with the production URL for thumbnails.
    const formattedCampaigns = campaigns.rows.map(campaign => ({
      ...campaign,
      thumbnail: campaign.thumbnail 
        ? `https://new-hope-e46616a5d911.herokuapp.com/${campaign.thumbnail}` 
        : null
    }));

    res.status(200).json(formattedCampaigns);
  } catch (err) {
    console.error("Error fetching campaigns:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



app.post("/campaigns", upload.single("thumbnail"), async (req, res) => {
  try {
    const { name, target_amount, details, category, start_date, end_date, payment_methods } = req.body;
    const thumbnail = req.file ? req.file.path : null;

    if (!name || !target_amount || !details || !category || !start_date || !end_date || !payment_methods) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // ✅ Validate category before inserting into the database
    const allowedCategories = ["Presidential Campaign", "Health", "Education", "Environment", "Elderly Care", "Labor", "Technology", "Political Support"];
    if (!allowedCategories.includes(category)) {
      return res.status(400).json({ error: "Invalid category selection." });
    }

    // ✅ Convert payment_methods to PostgreSQL Array Format
    const formattedPaymentMethods = `{${JSON.parse(payment_methods).map(method => `"${method}"`).join(',')}}`;

    const newCampaign = await db.query(
      "INSERT INTO campaigns (name, target_amount, details, category, start_date, end_date, payment_methods, thumbnail) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [name, target_amount, details, category, start_date, end_date, formattedPaymentMethods, thumbnail]
    );

    res.status(201).json({ message: "Campaign Created Successfully!", data: newCampaign.rows[0] });
  } catch (err) {
    console.error("Error creating campaign:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Get a Single Campaign by ID
app.get("/campaigns/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query("SELECT * FROM campaigns WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Campaign not found." });
    }
    
    // If needed, update the thumbnail field to a full URL:
    const campaign = result.rows[0];
    if (campaign.thumbnail && !campaign.thumbnail.startsWith("http")) {
      campaign.thumbnail = `https://new-hope-e46616a5d911.herokuapp.com/${campaign.thumbnail}`;
    }
    
    res.json(campaign);
  } catch (err) {
    console.error("Error fetching campaign:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.patch("/campaigns/:id", upload.single("thumbnail"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, target_amount, details, category, start_date, end_date, payment_methods } = req.body;
    const thumbnail = req.file ? req.file.path : null; // ✅ Only update if a new file is uploaded

    // Fetch the existing campaign
    const existingCampaign = await db.query("SELECT * FROM campaigns WHERE id = $1", [id]);
    if (existingCampaign.rows.length === 0) {
      return res.status(404).json({ error: "Campaign not found." });
    }

    // ✅ Convert payment_methods to PostgreSQL Array Format
    let formattedPaymentMethods;
    try {
      formattedPaymentMethods = `{${JSON.parse(payment_methods).map(method => `"${method}"`).join(',')}}`;
    } catch (error) {
      console.error("Error parsing payment methods:", error);
      return res.status(400).json({ error: "Invalid payment methods format." });
    }

    // ✅ Dynamically Build the Update Query
    let updateQuery = `
      UPDATE campaigns 
      SET name = $1, target_amount = $2, details = $3, category = $4, start_date = $5, end_date = $6, payment_methods = $7
    `;
    let values = [name, target_amount, details, category, start_date, end_date, formattedPaymentMethods];

    if (thumbnail) {
      updateQuery += ", thumbnail = $8";
      values.push(thumbnail);
    }

    updateQuery += " WHERE id = $" + (values.length + 1) + " RETURNING *";
    values.push(id);

    const updatedCampaign = await db.query(updateQuery, values);
    res.status(200).json({ message: "Campaign updated successfully!", data: updatedCampaign.rows[0] });

  } catch (err) {
    console.error("Error updating campaign:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// ✅ Delete Campaign by ID
app.delete("/campaigns/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query("DELETE FROM campaigns WHERE id = $1 RETURNING *", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Campaign not found." });
    }
    res.json({ message: "Campaign deleted successfully!" });
  } catch (err) {
    console.error("Error deleting campaign:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// ✅ Get wallet balance
app.get("/wallet", async (req, res) => {
  try {
      const result = await db.query("SELECT balance, currency FROM wallet WHERE id = 1");
      if (result.rows.length === 0) {
          return res.status(404).json({ error: "Wallet not found" });
      }
      res.json(result.rows[0]);
  } catch (err) {
      console.error("❌ Error fetching wallet balance:", err);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Update wallet currency
app.patch("/wallet/currency", async (req, res) => {
  try {
      const { newCurrency } = req.body;
      const validCurrencies = ["SLL", "USD", "EUR"];
      if (!validCurrencies.includes(newCurrency)) {
          return res.status(400).json({ error: "Invalid currency type." });
      }

      await db.query("UPDATE wallet SET currency = $1 WHERE id = 1", [newCurrency]);
      res.json({ message: "Currency updated successfully!" });
  } catch (err) {
      console.error("❌ Error updating currency:", err);
      res.status(500).json({ error: "Internal Server Error" });
  }
});


// ✅ Get all news stories
app.get("/news", async (req, res) => {
  try {
      const result = await db.query("SELECT id, title, content, category, status, thumbnail, user_id FROM news ORDER BY created_at DESC");
      console.log("📤 Retrieved News Stories:", result.rows); // ✅ Debugging

      // Prepending the full thumbnail URL for each news item if thumbnail exists
      const newsWithFullThumbnail = result.rows.map(newsItem => {
        if (newsItem.thumbnail && !newsItem.thumbnail.startsWith('http')) {
          // If the thumbnail is just a filename, prepend the S3 URL
          newsItem.thumbnail = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${newsItem.thumbnail}`;
        }
        return newsItem;
      });

      res.json(newsWithFullThumbnail);  // Send the updated response with the full thumbnail URLs
  } catch (error) {
      console.error("❌ Error fetching news:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});



// ✅ Get a Single News Story by ID
app.get("/news/:id", async (req, res) => {
  try {
    const { id } = req.params;  // Get the news ID from the URL
    const result = await db.query("SELECT * FROM news WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "News story not found." });
    }

    let newsItem = result.rows[0];

    // Ensure the full URL for the thumbnail
    if (newsItem.thumbnail && !newsItem.thumbnail.startsWith("http")) {
      newsItem.thumbnail = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${newsItem.thumbnail}`;
    }

    res.json(newsItem);  // Send the full news data including the thumbnail URL
  } catch (err) {
    console.error("Error fetching news story:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Create a News Story
app.post("/news", upload.single("thumbnail"), passport.authenticate("jwt", { session: false }), async (req, res) => {
  console.log("Headers:", req.headers);  
  try {
    const { title, content, category, status } = req.body;
    const user_id = req.user.id;  // This comes from the JWT payload

    // Ensure file is handled correctly
    const thumbnail = req.file ? req.file.key : null;  // S3 file key

    if (!title || !content || !category || !status) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const thumbnailUrl = thumbnail ? `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${thumbnail}` : null;

    // Insert data into the news table
    const result = await db.query(
      "INSERT INTO news (title, content, category, status, thumbnail, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [title, content, category, status, thumbnailUrl, user_id]
    );

    res.status(201).json({ message: "News story created successfully!", news: result.rows[0] });
  } catch (err) {
    console.error("❌ Error creating news story:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Update a News Story
app.patch("/news/:id", upload.single("thumbnail"), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, status } = req.body;
    const thumbnail = req.file ? req.file.filename : null;

    // Ensure required fields are present
    if (!title || !content || !category || !status) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const existingNews = await db.query("SELECT * FROM news WHERE id = $1", [id]);
    if (existingNews.rows.length === 0) {
      return res.status(404).json({ error: "News story not found." });
    }

    let updateQuery = "UPDATE news SET title=$1, content=$2, category=$3, status=$4";
    let values = [title, content, category, status];

    if (thumbnail) {
      updateQuery += ", thumbnail=$5";
      values.push(thumbnail);
    }

    updateQuery += " WHERE id=$" + (values.length + 1) + " RETURNING *";
    values.push(id);

    const updatedNews = await db.query(updateQuery, values);
    
    console.log("✅ News Updated:", updatedNews.rows[0]); // Debug log
    res.json(updatedNews.rows[0]);
  } catch (err) {
    console.error("❌ Error updating news story:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



// ✅ Delete a News Story
app.delete("/news/:id", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: "Invalid news ID." });
    }

    const result = await db.query("DELETE FROM news WHERE id = $1 RETURNING *", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "News story not found." });
    }

    res.json({ message: "News story deleted successfully!" });
  } catch (err) {
    console.error("❌ Error deleting news story:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/user/news", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from the JWT token
    const result = await db.query(
      "SELECT id, title, content, category, status, thumbnail, user_id FROM news WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    console.log("📤 Retrieved User News:", result.rows); // ✅ Debugging
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching user news:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.post("/user/news", passport.authenticate("jwt", { session: false }), upload.single("thumbnail"), async (req, res) => {
  try {
    const { title, content, category, status } = req.body;
    // After passport.authenticate, the req.user object should be populated with the user details
    const user_id = req.user ? req.user.id : req.body.user_id;  // Get user_id from token (JWT) payload
    const thumbnail = req.file ? req.file.key : null;  // Get filename from S3 upload

    if (!title || !content || !category || !user_id) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Construct the thumbnail URL
    const thumbnailUrl = thumbnail ? `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${thumbnail}` : null;

    // Insert news story into the database
    const result = await db.query(
      "INSERT INTO news (title, content, category, status, thumbnail, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [title, content, category, status, thumbnailUrl, user_id]
    );

    res.status(201).json({ message: "News story created successfully!", news: result.rows[0] });
  } catch (err) {
    console.error("Error creating news story:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.patch("/user/news/:id", upload.single("thumbnail"), passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category } = req.body;
    const user_id = req.user.id; // ✅ Get user ID from JWT
    const thumbnail = req.file ? req.file.key : null;

    console.log("Authenticated User:", req.user); 

    // ✅ Check if the news belongs to the user
    const existingNews = await db.query("SELECT * FROM news WHERE id = $1 AND user_id = $2", [id, user_id]);
    if (existingNews.rows.length === 0) {
      return res.status(403).json({ error: "Unauthorized to edit this news." });
    }

    let updateQuery = "UPDATE news SET title=$1, content=$2, category=$3";
    let values = [title, content, category];

    if (thumbnail) {
      updateQuery += ", thumbnail=$4";
      values.push(thumbnail);
    }

    updateQuery += " WHERE id=$" + (values.length + 1) + " AND user_id=$" + (values.length + 2) + " RETURNING *";
    values.push(id, user_id);

    const updatedNews = await db.query(updateQuery, values);
    res.json(updatedNews.rows[0]);
  } catch (err) {
    console.error("Error updating user news story:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/user/news/:id", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id; // Get user ID from JWT

    const result = await db.query(
      "DELETE FROM news WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, user_id]
    );

    if (result.rowCount === 0) {
      return res.status(403).json({ error: "Unauthorized to delete this news." });
    }

    res.json({ message: "User news story deleted successfully!" });
  } catch (err) {
    console.error("Error deleting user news story:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});





app.get("/surveyresponses", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM surveyresponses");

    if (result.rows.length === 0) {
      return res.status(200).json([]); // ✅ Return empty array instead of 404
    }

    res.json(result.rows); // ✅ Return all responses
  } catch (err) {
    console.error("❌ Error fetching survey responses:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



app.post("/surveyresponses", async (req, res) => {
  try {
    const { name, email, answers, survey_id } = req.body;

    if (!name || !email || !answers || !Array.isArray(answers) || !survey_id) {
      return res.status(400).json({ error: "All fields are required and answers must be an array." });
    }

    const result = await db.query(
      "INSERT INTO surveyresponses (name, email, answers, survey_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, JSON.stringify(answers), survey_id]
    );

    res.status(201).json({ message: "Survey response submitted successfully!", response: result.rows[0] });

  } catch (error) {
    console.error("❌ Error submitting survey response:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/surveys", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM surveys");
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching surveys:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/surveys/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch survey from DB
    const result = await db.query("SELECT * FROM surveys WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Survey not found" });
    }

    res.json(result.rows[0]); // Return survey data
  } catch (error) {
    console.error("❌ Error fetching survey:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.get("/surveyresponses/:survey_id", async (req, res) => {
  try {
      const { survey_id } = req.params;
      const result = await db.query("SELECT * FROM surveyresponses WHERE survey_id = $1", [survey_id]);

      if (result.rows.length === 0) {
          return res.status(404).json({ error: "No responses found for this survey" });
      }

      res.json(result.rows);
  } catch (error) {
      console.error("❌ Error fetching survey responses:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});





app.post("/surveys", async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({ error: "Survey must have a title and at least one question." });
    }

    const newSurvey = await db.query(
      "INSERT INTO surveys (title, description, questions) VALUES ($1, $2, $3) RETURNING *",
      [title, description, JSON.stringify(questions)]
    );

    res.status(201).json({ message: "Survey created successfully!", survey: newSurvey.rows[0] });
  } catch (error) {
    console.error("Error creating survey:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/surveys/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // First, check if the survey exists
    const surveyExists = await db.query("SELECT * FROM surveys WHERE id = $1", [id]);

    if (surveyExists.rows.length === 0) {
      return res.status(404).json({ error: "Survey not found" });
    }

    // Delete related responses first (if any)
    await db.query("DELETE FROM surveyresponses WHERE survey_id = $1", [id]);

    // Delete the survey
    await db.query("DELETE FROM surveys WHERE id = $1", [id]);

    res.json({ message: "Survey deleted successfully!" });
  } catch (error) {
    console.error("❌ Error deleting survey:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// 📩 Fetch Messages
app.get("/messages", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM supportmessages ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching messages:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.get("/messages/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query("SELECT * FROM supportmessages WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error fetching message:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// 📩 Post a New Message
app.post("/messages", async (req, res) => {
  try {
      const { name, phone, message } = req.body;
      await db.query(
          "INSERT INTO supportmessages (name, phone, message) VALUES ($1, $2, $3)",
          [name, phone, message]
      );
      res.status(201).json({ message: "Message sent successfully!" });
  } catch (err) {
      console.error("❌ Error posting message:", err);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/messages/:id/respond", async (req, res) => {
  try {
      const { id } = req.params;
      const { response } = req.body;

      // ✅ Ensure response text is provided
      if (!response.trim()) {
          return res.status(400).json({ error: "Response cannot be empty" });
      }

      // ✅ Check if message exists
      const messageCheck = await db.query("SELECT * FROM supportmessages WHERE id = $1", [id]);
      if (messageCheck.rows.length === 0) {
          return res.status(404).json({ error: "Message not found" });
      }

      // ✅ Update message with admin response
      const result = await db.query(
          "UPDATE supportmessages SET admin_response = $1 WHERE id = $2 RETURNING *",
          [response, id]
      );

      res.status(200).json({ message: "Response added successfully!", updatedMessage: result.rows[0] });
  } catch (error) {
      console.error("❌ Error responding to message:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});





// 📄 Fetch Documents
app.get("/documents", async (req, res) => {
  try {
      const result = await db.query("SELECT * FROM documents ORDER BY uploaded_at DESC");
      res.json(result.rows);
  } catch (err) {
      console.error("❌ Error fetching documents:", err);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/skills-directory", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM skills_directory ORDER BY created_at DESC");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching skills directory:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/skills-directory", async (req, res) => {
  try {
    const { name, email, address, date_of_birth, skills } = req.body;

    if (!name || !email || !address || !date_of_birth || !skills) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const result = await db.query(
      "INSERT INTO skills_directory (name, email, address, date_of_birth, skills) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, email, address, date_of_birth, skills]
    );

    res.status(201).json({ message: "Skills submitted successfully!", entry: result.rows[0] });
  } catch (err) {
    console.error("❌ Error submitting skills:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




// Ensure your Express server is using the correct port for Heroku
const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});