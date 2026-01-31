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

export interface Review {
  quote: string;
  name: string;
  rating: number;
}

export interface ReviewStats {
  reviews: Review[];
  totalReviews: number;
  averageRating: number;
}

function getFallbackReviews(): ReviewStats {
  return {
    reviews: [
      {
        quote:
          "Gaby took photos at our friends' civil wedding ceremony. She was amazing from start to finish - very easy to contact, flexible with what we needed, super friendly and incredible photos! Turnaround with photos was also very quick - very impressive for such good quality work. Reasonably priced compared with competitors too. Thanks again Gaby!",
        name: "Charlotte Mills",
        rating: 5,
      },
      {
        quote:
          "We cannot recommend Gabi enough! She was the photographer for our wedding. Gabi captured every moment from entering the registry office to the end of our reception. She is a very talented and work driven young person with an eye for the details. Gabi, you were amazing, and we can't thank you enough for the beautiful photos!",
        name: "p 'peteto' pencheva",
        rating: 5,
      },
      {
        quote:
          "Thank you very much Miss Gaby ❤️ It was my son's first ever photo shoot and you did a great job!Photos are amazing and so natural, you have caught every little moments of my little one in a very creative and unique way And specifically thank you very much for being very calm and friendly with us and made the session run so smoothly and effectively. You are so talented and we are glad that we have met you ❤️ I highly recommend Mellsnap to everyone Thank you very much Miss Gaby ❤️ All the best 👍",
        name: "Hasitha Gunarathne",
        rating: 5,
      },
    ],
    totalReviews: 33,
    averageRating: 5.0,
  };
}

export async function fetchGoogleReviews(): Promise<ReviewStats> {
  const apiKey = import.meta.env.GOOGLE_PLACES_API_KEY;
  const placeId = import.meta.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    console.warn(
      "Google API credentials missing, using fallback reviews. Set GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID in .env"
    );
    return getFallbackReviews();
  }

  const url = `https://places.googleapis.com/v1/places/${placeId}?fields=reviews,rating,userRatingCount&key=${apiKey}`;

  try {
    const response = await fetch(url, {
      headers: {
        "X-Goog-FieldMask": "reviews,rating,userRatingCount",
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data: PlaceDetailsResponse = await response.json();

    if (!data.reviews || data.reviews.length === 0) {
      console.warn("No reviews returned from Google API, using fallback");
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

    return {
      reviews: topReviews,
      totalReviews: data.userRatingCount,
      averageRating: data.rating,
    };
  } catch (error) {
    console.error("Failed to fetch Google reviews:", error);
    console.warn("Using fallback reviews");
    return getFallbackReviews();
  }
}
