import { connectToDatabase } from '@/lib/mongodb';
import mongoose from 'mongoose';

const NytSchema = new mongoose.Schema({
  content: Object,
  timestamp: { type: Date, default: Date.now }
});

const NytData = mongoose.models.NytData || mongoose.model('NytData', NytSchema);

export async function GET() {
  try {
    await connectToDatabase();

    // Check MongoDB for the latest entry
    const latestEntry = await NytData.findOne().sort({ timestamp: -1 });

    // If data is less than 24 hours old, return from MongoDB
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    if (latestEntry && latestEntry.timestamp > twentyFourHoursAgo) {
      console.log("✅ Returning cached NYT data from MongoDB");
      return new Response(JSON.stringify(latestEntry.content), { status: 200 });
    }

    // Otherwise, fetch fresh data from the NYT API
    console.log("🔄 Fetching fresh NYT data...");
    const response = await fetch(
      `https://api.nytimes.com/svc/books/v3/lists/full-overview.json?api-key=${process.env.NYT_API_KEY}`
    );

    if (!response.ok) {
      console.error("❌ NYT API fetch failed:", response.statusText);
      return new Response(JSON.stringify({ error: "Failed to fetch NYT data" }), { status: 500 });
    }

    const data = await response.json();

    // Store fresh data in MongoDB
    await NytData.create({ content: data });
    console.log("✅ Stored new NYT data in MongoDB");

    return new Response(JSON.stringify(data), { status: 200 });

  } catch (error) {
    console.error("❌ Server error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
