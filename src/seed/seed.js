const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Role = require("../models/role/Role");
const Permission = require("../models/role/Permission");
const Account = require("../models/account/Account");

const seedData = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://Hung2304:Hung2304%40@thatcluster.v53cy.mongodb.net/thatvn?retryWrites=true&w=majority&appName=thatcluster"
    );
    console.log("Connected to MongoDB");

    // Xóa dữ liệu cũ
    await Role.deleteMany({});
    await Permission.deleteMany({});
    await Account.deleteMany({});

    console.log("Database cleared");

    // Tạo permissions
    const permissions = await Permission.insertMany([
      { name: "READ_USER", description: "Xem thông tin user" },
      { name: "CREATE_USER", description: "Tạo user mới" },
      { name: "UPDATE_USER", description: "Cập nhật user" },
      { name: "DELETE_USER", description: "Xóa user" },
      { name: "MANAGE_ROLES", description: "Quản lý roles" },
    ]);

    console.log("Permissions created");

    // Tạo roles
    const adminRole = await Role.create({
      name: "Admin",
      permissions: permissions.map((p) => p._id),
    });

    const userRole = await Role.create({
      name: "User",
      permissions: [permissions[0]._id], // Chỉ có quyền READ_USER
    });

    console.log("Roles created");

    // Hash mật khẩu
    const hashPassword = async (password) => {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(password, salt);
    };

    // Tạo users với mật khẩu đã băm
    await Account.create([
      {
        username: "admin",
        email: "admin@example.com",
        password: await hashPassword("admin123"),
        role: adminRole._id,
      },
      {
        username: "user1",
        email: "user1@example.com",
        password: await hashPassword("user123"),
        role: userRole._id,
      },
      {
        username: "user2",
        email: "user2@example.com",
        password: await hashPassword("user123"),
        role: userRole._id,
      },
    ]);

    console.log("Users created");

    mongoose.connection.close();
    console.log("Seeding complete!");
  } catch (error) {
    console.error("Error seeding database:", error);
    mongoose.connection.close();
  }
};

seedData();
