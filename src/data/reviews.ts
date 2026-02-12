import type { Review } from '../types';

export const sampleReviews: Review[] = [
  {
    id: '1',
    userName: 'Gregg Y.',
    userLocation: 'Fairfield, United States',
    badge: 'Elite 26',
    reviewsCount: 6,
    rating: 5,
    date: 'Dec 1, 2025',
    text:
      'Comptoir de la Gastronomie is indulgence distilled into three dishes: roasted bone marrow with sea salt, pan-seared duck foie gras, and roasted duck breast. Each plate is unapologetically rich and perfectly executed. ' +
      'Bone marrow and pan-seared foie gras are experiences that leave you speechless, and the duck breast is cooked to perfection and paired beautifully with potatoes.\n\n' +
      'A true embodiment of dining hedonism and an experience that reminds you why Paris still owns the word gastronomy.',
    photos: [
      'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=400&fit=crop',
    ],
    helpfulCount: 12,
    thanksCount: 3,
    loveThisCount: 5,
    ohNoCount: 0,
  },
];
