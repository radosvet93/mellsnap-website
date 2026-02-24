import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { type ReviewStats } from '../src/data/googleReviews.js';

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

function getFallbackReviews(): ReviewStats {
  return {
    reviews: [
      {
        "quote": "Gaby took photos at our friends' civil wedding ceremony. She was amazing from start to finish - very easy to contact, flexible with what we needed, super friendly and incredible photos! Turnaround with photos was also very quick - very impressive for such good quality work. Reasonably priced compared with competitors too. Thanks again Gaby!",
        "name": "Charlotte Mills",
        "rating": 5
      },
      {
        "quote": "We cannot recommend Gabi enough! She was the photographer for our wedding. Gabi captured every moment from entering the registry office to the end of our reception. She is a very talented and work driven young person with an eye for the details.\nGabi, you were amazing, and we can't thank you enough for the beautiful photos!",
        "name": "p “peteto” pencheva",
        "rating": 5
      },
      {
        "quote": "Thank you very much Miss Gaby ❤️ It was  my son's first ever photo shoot and you did a great job!Photos are amazing and  so natural, you have caught every little moments of my little one in a very creative and unique way\nAnd specifically thank you very much for being very calm and friendly with us and made the session run so smoothly and effectively. You are so talented and we are glad that we have met you ❤️ I highly recommend Mellsnap to everyone\nThank you very much Miss Gaby ❤️\nAll the best 👍",
        "name": "Hasitha Gunarathne",
        "rating": 5
      },
      {
        "quote": "It was really great working with you Gabby. Myself and my hubby highly recommend Mellsnap. She made the mini session clam and relaxing.\nWe really enjoyed working with you.  Gabby, I should say that you have the ability to capture and make the small moments to great arts of  📸 .",
        "name": "dona samson",
        "rating": 5
      },
      {
        "quote": "My wife had realised 7 months into her pregnancy that we didn't have any pictures together with 'the bump'. So  naturally, she started looking for a maternity shoot and we are SO glad she found Gaby!\n\nGaby picked a great spot for us, knew exactly where to go, and gave us some great ideas to pose in. But more importantly, she made us feel so relaxed - it didn't even feel like a shoot.\n\nI would strongly recommend hiring Mellsnap, Gaby is just as professional as she is kind-hearted 🙏🏽🙂",
        "name": "Anil Jhali",
        "rating": 5
      },
      {
        "quote": "I can't recommend MellSnap enough to all photo lovers! Gabi was extremely kind and professional during our special occasion-our son's 3rd birthday party 🎈 She was detailed and precise in her job, she captured lovely moments of the day and made them even more memorable for us through her look❤️ thank you so much, Gabi, you are amazing 💯",
        "name": "Nikoletа Gyurova",
        "rating": 5
      }
    ],
    totalReviews: 34,
    averageRating: 5.0,
  };
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
