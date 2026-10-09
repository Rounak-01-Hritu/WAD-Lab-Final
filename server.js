const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const session = require("express-session");
require("dotenv").config();

const User = require("./models/User");
const Complaint = require("./models/Complaint");

const app = express();

//const PORT = 3000;
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: "student-service-secret",
    resave: false,
    saveUninitialized: false
}));

// Connect MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");
    })
    .catch((error) => {
        console.log("MongoDB connection failed:");
        console.log(error.message);
    });

// Serve frontend
app.use(express.static("public"));

// Register user
app.post("/register", async (req, res) => {

    try {

        const { name, email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.send("Passwords do not match.");
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.send("Email already registered.");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword,
            role: "student"
        });

        await newUser.save();

        res.send("Registration successful!");

    } catch (error) {

        console.log(error);

        res.send("Registration failed.");

    }

});

// Login user
app.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.send("Invalid email or password.");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

if (!passwordMatch) {
    return res.send("Invalid email or password.");
}

req.session.userId = user._id;
req.session.userName = user.name;
req.session.userEmail = user.email;
req.session.userRole = user.role;

if (user.role === "admin") {
    res.redirect("/admin-dashboard.html");
} else {
    res.redirect("/dashboard.html");
}

    } catch (error) {

        console.log(error);

        res.send("Login failed.");

    }

});

app.post("/submit-complaint", async (req, res) => {

    try {

        if (!req.session.userId) {
            return res.send("Please login first.");
        }

        const { subject, category, priority, description } = req.body;

        const complaint = new Complaint({
    student: req.session.userId,
    subject: subject,
    category: category,
    priority: priority,
    description: description
});

        await complaint.save();

        res.send("Complaint submitted successfully!");

    } catch (error) {

        console.error(error);
        res.status(500).send("Error submitting complaint");

    }

});


app.get("/my-complaints", async (req, res) => {

    try {

        if (!req.session.userId) {
            return res.status(401).json({
                message: "Please login first."
            });
        }

        const complaints = await Complaint.find({
            student: req.session.userId
        }).sort({ createdAt: -1 });

        res.json(complaints);

    } catch (error) {

        console.error(error);
        res.status(500).json({
            message: "Error loading complaints."
        });

    }

});


app.get("/my-profile", async (req, res) => {

    try {

        if (!req.session.userId) {
            return res.status(401).json({
                message: "Please login first."
            });
        }

        const user = await User.findById(req.session.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        res.json({
            name: user.name,
            email: user.email,
            role: user.role
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Error loading profile."
        });

    }

});


app.get("/logout", (req, res) => {

    req.session.destroy((error) => {

        if (error) {
            console.error(error);
            return res.send("Logout failed.");
        }

        res.redirect("/index.html");

    });

});


app.get("/admin/complaints", async (req, res) => {

    try {

        if (!req.session.userId || req.session.userRole !== "admin") {
            return res.status(403).json({
                message: "Access denied."
            });
        }

        const complaints = await Complaint.find()
            .populate("student", "name email")
            .sort({ createdAt: -1 });

        res.json(complaints);

    } catch (error) {

        console.error("Admin complaints error:", error);

        res.status(500).json({
            message: "Error loading complaints."
        });

    }

});


app.post("/admin/update-status", async (req, res) => {

    try {

        if (!req.session.userId || req.session.userRole !== "admin") {
            return res.status(403).json({
                message: "Access denied."
            });
        }

        const { complaintId, status } = req.body;

        const allowedStatuses = [
            "Pending",
            "In Progress",
            "Resolved"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status."
            });
        }

        await Complaint.findByIdAndUpdate(
            complaintId,
            { status: status }
        );

        res.json({
            message: "Complaint status updated successfully!"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Error updating complaint status."
        });

    }

});



app.get("/admin/stats", async (req, res) => {
    try {
        if (!req.session.userId || req.session.userRole !== "admin") {
            return res.status(403).json({
                message: "Access denied."
            });
        }

        const total = await Complaint.countDocuments();
        const pending = await Complaint.countDocuments({ status: "Pending" });
        const inProgress = await Complaint.countDocuments({ status: "In Progress" });
        const resolved = await Complaint.countDocuments({ status: "Resolved" });

        res.json({
            total,
            pending,
            inProgress,
            resolved
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error loading statistics."
        });
    }
});

// app.listen(PORT, () => {
//     console.log(`Server running at http://localhost:${PORT}`);
// });

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});