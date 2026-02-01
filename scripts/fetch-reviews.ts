import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { getFallbackReviews, type ReviewStats } from '../src/data/googleReviews.js';

dotenv.config();

interface GoogleReview {
  authorAttribution: {
    displayName: string;
  };
  rating: number;
  text: {
    text: string;
  };
  publishTime: string;
}

interface PlaceDetailsResponse {
  reviews: GoogleReview[];
  rating: number;
  userRatingCount: number;
}

async function fetchGoogleReviews(): Promise<ReviewStats> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    console.warn(
      '⚠️  Google API credentials missing. Set GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID in .env'
    );
    console.warn('   Using fallback reviews instead.');
    return getFallbackReviews();
  }

  const url = `https://places.googleapis.com/v1/places/${placeId}?fields=reviews,rating,userRatingCount&key=${apiKey}`;

  try {
    console.log('📡 Fetching reviews from Google Places API...');
    const response = await fetch(url, {
      headers: {
        'X-Goog-FieldMask': 'reviews,rating,userRatingCount',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data: PlaceDetailsResponse = await response.json();

    if (!data.reviews || data.reviews.length === 0) {
      console.warn('⚠️  No reviews returned from Google API, using fallback');
      return getFallbackReviews();
    }

    // Sort by publish time descending (most recent first)
    const sortedReviews = data.reviews.sort((a, b) => {
      return (
        new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime()
      );
    });

    // Take top 6 reviews
    const topReviews = sortedReviews.slice(0, 6).map((review) => ({
      quote: review.text.text,
      name: review.authorAttribution.displayName,
      rating: review.rating,
    }));

    console.log(`✅ Fetched ${topReviews.length} reviews successfully`);
    console.log(`   Average rating: ${data.rating.toFixed(1)}/5.0`);
    console.log(`   Total reviews: ${data.userRatingCount}`);

    return {
      reviews: topReviews,
      totalReviews: data.userRatingCount,
      averageRating: data.rating,
    };
  } catch (error) {
    console.error('❌ Failed to fetch Google reviews:', error);
    console.warn('   Using fallback reviews instead.');
    return getFallbackReviews();
  }
}

async function main() {
  console.log('🔄 Fetching Google Reviews...\n');

  const reviewStats = await fetchGoogleReviews();

  // Write to src/data/reviews.json
  const outputPath = path.join(process.cwd(), 'src', 'data', 'reviews.json');
  const outputDir = path.dirname(outputPath);

  // Ensure directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(reviewStats, null, 2), 'utf-8');

  console.log(`\n💾 Saved reviews to: ${outputPath}`);
  console.log('✨ Reviews ready for build!\n');
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
