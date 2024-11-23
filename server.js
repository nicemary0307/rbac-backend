const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
const dbURI = process.env.MONGO_URI;
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Define Mongoose Schemas and Models
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  roles: [String],
  status: String,
});
const User = mongoose.model("User", userSchema);

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  permissions: [String],
});

const Role = mongoose.model("Role", roleSchema);
// Routes

//get all user
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});
//add user
app.post("/users", async (req, res) => {
  const newUser = new User(req.body);
  await newUser.save();
  res.status(201).json(newUser);
});
//edit user
app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updatedUser);
});

//delete user
app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the user" });
  }
});

// Get all roles
app.get("/roles", async (req, res) => {
  try {
    const roles = await Role.find();
    res.json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error.message);
    res.status(500).json({ error: "An error occurred while fetching roles" });
  }
});

// Add a new role
app.post("/roles", async (req, res) => {
  try {
    const { name, permissions } = req.body;
    const newRole = new Role({ name, permissions });
    await newRole.save();
    res.status(201).json(newRole);
  } catch (error) {
    console.error("Error creating role:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while creating the role" });
  }
});

// Update a role
app.put("/roles/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRole = await Role.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedRole);
  } catch (error) {
    console.error("Error updating role:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while updating the role" });
  }
});

// Delete a role
app.delete("/roles/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRole = await Role.findByIdAndDelete(id);
    if (!deletedRole) {
      return res.status(404).json({ error: "Role not found" });
    }
    res.status(200).json({ message: "Role deleted successfully" });
  } catch (error) {
    console.error("Error deleting role:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the role" });
  }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
