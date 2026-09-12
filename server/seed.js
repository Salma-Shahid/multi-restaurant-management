require("dotenv").config();
// DNS lookup patch for seed environment
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Restaurant = require("./models/Restaurant");
const Table = require("./models/Table");
const connectDB = require("./config/db");

const seedDatabase = async () => {
  try {
    // Database connect karein
    await connectDB();

    console.log("🧹 Purana sample data database se clear kiya ja raha hai...");
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await Table.deleteMany({});

    console.log("🔐 Passwords hash kiye ja rahe hain...");
    const salt = await bcrypt.genSalt(10);
    const adminPass = await bcrypt.hash("admin123", salt);
    const owner1Pass = await bcrypt.hash("owner123", salt);
    const owner2Pass = await bcrypt.hash("owner223", salt);
    const owner3Pass = await bcrypt.hash("owner323", salt);
    const user1Pass = await bcrypt.hash("user123", salt);
    const user2Pass = await bcrypt.hash("user223", salt);

    console.log("👥 Demo users reset ho rahe hain...");
    const admin = await User.create({
      name: "Admin",
      email: "admin@gmail.com",
      passwordHash: adminPass,
      phone: "03001234567",
      role: "Admin",
    });
    const owner1 = await User.create({
      name: "Owner1",
      email: "owner1@gmail.com",
      passwordHash: owner1Pass,
      phone: "03111234567",
      role: "Owner",
    });
    const owner2 = await User.create({
      name: "Owner2",
      email: "owner2@gmail.com",
      passwordHash: owner2Pass,
      phone: "03221234567",
      role: "Owner",
    });
    const owner3 = await User.create({
      name: "Owner3",
      email: "owner3@gmail.com",
      passwordHash: owner3Pass,
      phone: "03331234567",
      role: "Owner",
    });
    const owner4 = await User.create({
      name: "Owner4",
      email: "owner4@gmail.com",
      passwordHash: owner1Pass,
      phone: "03421234567",
      role: "Owner",
    });
    const owner5 = await User.create({
      name: "Owner5",
      email: "owner5@gmail.com",
      passwordHash: owner2Pass,
      phone: "03431234567",
      role: "Owner",
    });
    const owner6 = await User.create({
      name: "Owner6",
      email: "owner6@gmail.com",
      passwordHash: owner3Pass,
      phone: "03441234567",
      role: "Owner",
    });
    const owner7 = await User.create({
      name: "Owner7",
      email: "owner7@gmail.com",
      passwordHash: owner1Pass,
      phone: "03451234567",
      role: "Owner",
    });
    const owner8 = await User.create({
      name: "Owner8",
      email: "owner8@gmail.com",
      passwordHash: owner2Pass,
      phone: "03461234567",
      role: "Owner",
    });
    const owner9 = await User.create({
      name: "Owner9",
      email: "owner9@gmail.com",
      passwordHash: owner3Pass,
      phone: "03471234567",
      role: "Owner",
    });
    const owner10 = await User.create({
      name: "Owner10",
      email: "owner10@gmail.com",
      passwordHash: owner1Pass,
      phone: "03481234567",
      role: "Owner",
    });
    const owner11 = await User.create({
      name: "Owner11",
      email: "owner11@gmail.com",
      passwordHash: owner2Pass,
      phone: "03491234567",
      role: "Owner",
    });
    const user1 = await User.create({
      name: "Customer1",
      email: "user1@gmail.com",
      passwordHash: user1Pass,
      phone: "03441234567",
      role: "Customer",
    });
    const user2 = await User.create({
      name: "Customer2",
      email: "user2@gmail.com",
      passwordHash: user2Pass,
      phone: "03551234567",
      role: "Customer",
    });

    console.log("🏪 Certified partner restaurants link ho rahe hain...");
    // Note: Yeh Unsplash premium web images hain jo aapke Cloudinary URLs ki tarah directly load ho jayengi
    const resto1 = await Restaurant.create({
      ownerId: owner1._id,
      name: "Bella Italia Ambiance",
      cuisine: "Italian",
      description:
        "Experience authentic wood-fired pizzas, handmade pasta artisan layers, and a luxury vintage interior perfect for corporate meetings and family dinners.",
      address: "Plot 45-B, Sector C, Lahore Cantt",
      phone: "03001112223",
      openingTime: "12:00 PM",
      closingTime: "11:30 PM",
      imageUrl:
        "https://res.cloudinary.com/x1dwchxh/image/upload/v1788890364/italian_nhi1xk.jpg",
      status: "approved", // Direct testing ke liye approved kar diya hai
    });

    const resto2 = await Restaurant.create({
      ownerId: owner2._id,
      name: "ZenSushii Pan-Asian Bistro",
      cuisine: "Pan-Asian",
      description:
        "Premium sushi platters, live teppanyaki counters, and steaming dim sums served in a modern minimalist neo-tokyo theme environment.",
      address: "M-Block, Commercial Area, Phase 5 DHA, Lahore",
      phone: "03219998887",
      openingTime: "01:00 PM",
      closingTime: "12:00 AM",
      imageUrl:
        "https://res.cloudinary.com/x1dwchxh/image/upload/v1788890389/sushii_fqjqqk.jpg",
      status: "approved",
    });

    const resto3 = await Restaurant.create({
      ownerId: owner3._id,
      name: "Khyber Traditional Shinwari",
      cuisine: "Desi",
      description:
        "Authentic clay-oven mutton shinwari karahi, charcoal BBQ platters, and traditional floor carpet seating arrangement for large gatherings.",
      address: "Main Autobahn Road, Cantonment, Hyderabad",
      phone: "03335554443",
      openingTime: "04:00 PM",
      closingTime: "02:00 AM",
      imageUrl:
        "https://res.cloudinary.com/x1dwchxh/image/upload/v1788890380/shinwari_yzjxwy.jpg",
      status: "pending",
    });
    const resto4 = await Restaurant.create({
      ownerId: owner4._id,
      name: "KFC - Auto-Bahn Branch",
      cuisine: "Fast Food",
      description:
        "Finger-lickin' good fried chicken, crispy fries, and signature sauces served in a modern fast-food environment with family-friendly seating.",
      address: "Main Autobahn Road, Cantonment, Hyderabad",
      phone: "03335554443",
      openingTime: "04:00 PM",
      closingTime: "02:00 AM",
      imageUrl:
        "https://res.cloudinary.com/x1dwchxh/image/upload/v1788895780/kfc_tbazs4.jpg",
      status: "approved",
    });
    const resto5 = await Restaurant.create({
      ownerId: owner5._id,
      name: "Cheezious - The Ultimate Cheese Haven",
      cuisine: "Fast Food",
      description:
        "Indulge in gourmet grilled cheese sandwiches, cheesy fries, and decadent cheese platters in a cozy, cheese-themed ambiance perfect for cheese lovers.",
      address: " Cantonment,Lahore",
      phone: "03335554443",
      openingTime: "04:00 PM",
      closingTime: "02:00 AM",
      imageUrl:
        "https://res.cloudinary.com/x1dwchxh/image/upload/v1788895741/cheezious_lr3dub.jpg",
      status: "approved",
    });
    const resto6 = await Restaurant.create({
      ownerId: owner6._id,
      name: "Kurtos Bistro - European Delights",
      cuisine: "Italian Cuisine",
      description:
        "Savor authentic European pastries, gourmet coffee, and artisanal desserts in a chic bistro setting with a warm and inviting atmosphere.",
      address: "Main Autobahn Road, Cantonment, Hyderabad",
      phone: "03335554443",
      openingTime: "04:00 PM",
      closingTime: "02:00 AM",
      imageUrl:
        "https://res.cloudinary.com/x1dwchxh/image/upload/v1788895781/kurtos-bistro_ppln6m.jpg",
      status: "pending",
    });
    const resto7 = await Restaurant.create({
      ownerId: owner7._id,
      name: "sicilian - Authentic Italian Cuisine",
      cuisine: "Italian Cuisine",
      description:
        "Experience the rich flavors of Sicily with our traditional Italian dishes, including wood-fired pizzas, fresh pasta, and classic Sicilian desserts, all served in a rustic yet elegant ambiance.",
      address: "Main Autobahn Road, Cantonment, Hyderabad",
      phone: "03335554443",
      openingTime: "04:00 PM",
      closingTime: "12:00 AM",
      imageUrl:
        "https://res.cloudinary.com/x1dwchxh/image/upload/v1788895801/sicialian_r9j6ox.jpg",
      status: "pending",
    });
    const resto8 = await Restaurant.create({
      ownerId: owner8._id,
      name: "Butt Karahi - Traditional Desi Cuisine",
      cuisine: "Desi",
      description:
        "Authentic clay-oven mutton butt karahi, charcoal BBQ platters, and traditional floor carpet seating arrangement for large gatherings.",
      address: ", Lahore Cantt, Lahore",
      phone: "03335554443",
      openingTime: "04:00 PM",
      closingTime: "02:00 AM",
      imageUrl:
        "https://res.cloudinary.com/x1dwchxh/image/upload/v1788895740/butt-karahi_wj5010.jpg",
      status: "approved",
    });
    const resto9 = await Restaurant.create({
      ownerId: owner9._id,
      name: "Kababjee's - Authentic BBQ & Grill",
      cuisine: "Desi",
      description:
        "Authentic clay-oven mutton mutton karahi, charcoal BBQ platters, and traditional floor carpet seating arrangement for large gatherings.",
      address: "Main Autobahn Road, Cantonment, Hyderabad",
      phone: "03335554443",
      openingTime: "04:00 PM",
      closingTime: "02:00 AM",
      imageUrl:
        "https://res.cloudinary.com/x1dwchxh/image/upload/v1788895779/kababjees-karachi_vxburf.jpg",
      status: "pending",
    });
    const resto10 = await Restaurant.create({
      ownerId: owner10._id,
      name: "MacDonald's - Auto-Bahn Branch",
      cuisine: "Fast Food",
      description:
        "Authentic clay-oven mutton shinwari karahi, charcoal BBQ platters, and traditional floor carpet seating arrangement for large gatherings.",
      address: "Main Autobahn Road, Hyderabad",
      phone: "03335554443",
      openingTime: "04:00 PM",
      closingTime: "02:00 AM",
      imageUrl:
        "https://res.cloudinary.com/x1dwchxh/image/upload/v1788895782/macdonalds_wk4udl.jpg",
      status: "pending",
    });
    const resto11 = await Restaurant.create({
      ownerId: owner11._id,
      name: "Lal Qila - Buffet-Style Desi Dining",
      cuisine: "Desi",
      description:
        "Authentic Buffet-style desi cuisine, traditional floor carpet seating arrangement, and live tandoor stations for an immersive dining experience.",
      address: " Karachi",
      phone: "03335554443",
      openingTime: "04:00 PM",
      closingTime: "02:00 AM",
      imageUrl:
        "https://res.cloudinary.com/x1dwchxh/image/upload/v1788899354/lal-qila_vlfhaa.jpg",
      status: "approved",
    });

    console.log("⚙️ Configuration tables systems coordinate ho rahe hain...");
    // Restaurant 1 ki tables
    await Table.create({
      restaurantId: resto1._id,
      tableNumber: "101",
      capacity: 2,
    });
    await Table.create({
      restaurantId: resto1._id,
      tableNumber: "102",
      capacity: 4,
    });
    await Table.create({
      restaurantId: resto1._id,
      tableNumber: "103",
      capacity: 8,
    });

    // Restaurant 2 ki tables
    await Table.create({
      restaurantId: resto2._id,
      tableNumber: "201",
      capacity: 2,
    });
    await Table.create({
      restaurantId: resto2._id,
      tableNumber: "202",
      capacity: 4,
    });

    // Restaurant 3 ki tables
    await Table.create({
      restaurantId: resto3._id,
      tableNumber: "301",
      capacity: 6,
    });

    // Restaurant 4 ki tables
    await Table.create({
      restaurantId: resto4._id,
      tableNumber: "401",
      capacity: 4,
    });
    await Table.create({
      restaurantId: resto4._id,
      tableNumber: "402",
      capacity: 6,
    });

    // Restaurant 5 ki tables
    await Table.create({
      restaurantId: resto5._id,
      tableNumber: "501",
      capacity: 2,
    });
    await Table.create({
      restaurantId: resto5._id,
      tableNumber: "502",
      capacity: 4,
    });
    await Table.create({
      restaurantId: resto5._id,
      tableNumber: "503",
      capacity: 8,
    });

    // Restaurant 6 ki tables
    await Table.create({
      restaurantId: resto6._id,
      tableNumber: "601",
      capacity: 2,
    });
    await Table.create({
      restaurantId: resto6._id,
      tableNumber: "602",
      capacity: 4,
    });

    // Restaurant 7 ki tables
    await Table.create({
      restaurantId: resto7._id,
      tableNumber: "701",
      capacity: 2,
    });
    await Table.create({
      restaurantId: resto7._id,
      tableNumber: "702",
      capacity: 6,
    });

    // Restaurant 8 ki tables
    await Table.create({
      restaurantId: resto8._id,
      tableNumber: "801",
      capacity: 4,
    });
    await Table.create({
      restaurantId: resto8._id,
      tableNumber: "802",
      capacity: 6,
    });

    // Restaurant 9 ki tables
    await Table.create({
      restaurantId: resto9._id,
      tableNumber: "901",
      capacity: 2,
    });
    await Table.create({
      restaurantId: resto9._id,
      tableNumber: "902",
      capacity: 4,
    });

    // Restaurant 10 ki tables
    await Table.create({
      restaurantId: resto10._id,
      tableNumber: "1001",
      capacity: 2,
    });
    await Table.create({
      restaurantId: resto10._id,
      tableNumber: "1002",
      capacity: 4,
    });

    // Restaurant 11 ki tables
    await Table.create({
      restaurantId: resto11._id,
      tableNumber: "1101",
      capacity: 4,
    });
    await Table.create({
      restaurantId: resto11._id,
      tableNumber: "1102",
      capacity: 6,
    });
    await Table.create({
      restaurantId: resto11._id,
      tableNumber: "1103",
      capacity: 8,
    });

    console.log("✨ DATABASE SEEDING COMPLETED SUCCESSFULLY!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error.message);
    process.exit(1);
  }
};

seedDatabase();
