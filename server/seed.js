// ============================================================
//  server/seed.js  —  Seeds MongoDB from backend/db.json
//  Run once: node seed.js
// ============================================================
const mongoose = require('mongoose');
const path     = require('path');
const fs       = require('fs');
require('dotenv').config();

const SiteContent = require('./models/SiteContent');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas');

    const dbPath = path.join(__dirname, '..', 'backend', 'db.json');
    if (!fs.existsSync(dbPath)) {
      console.error('❌ backend/db.json not found at:', dbPath);
      process.exit(1);
    }

    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    const keys   = ['courses', 'belts', 'achievements', 'schedules'];

    for (const key of keys) {
      if (dbData[key] !== undefined) {
        await SiteContent.findOneAndUpdate(
          { key },
          { key, data: dbData[key], updatedAt: new Date() },
          { upsert: true, new: true }
        );
        console.log(`   ✓ Seeded: ${key} (${Array.isArray(dbData[key]) ? dbData[key].length : 'object'} records)`);
      }
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log('   You can now start the server with: npm run dev\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
