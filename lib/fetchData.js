import { connectToDatabase } from '@/lib/mongodb';
import mongoose from 'mongoose';

const NytSchema = new mongoose.Schema({
  content: Object,
  timestamp: { type: Date, default: Date.now }
});

const NytData = mongoose.models.NytData || mongoose.model('NytData', NytSchema);

async function fetchAndStoreData() {
  try {
    await connectToDatabase();

    const response = await fetch(
      `https://api.nytimes.com/svc/books/v3/lists/full-overview.json?api-key=${process.env.NYT_API_KEY}`
    );

    if (!response.ok) {
      console.error('Failed to fetch NYT data');
      return;
    }

    const data = await response.json();

    // Save the new data
    await NytData.create({ content: data });

    console.log('NYT data stored successfully');
  } catch (error) {
    console.error('Error fetching NYT data:', error);
  }
}

// Run every 24 hours
setInterval(fetchAndStoreData, 24 * 60 * 60 * 1000);
