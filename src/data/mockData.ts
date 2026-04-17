export interface User {
  id: string;
  name: string;
  role: "tenant" | "owner";
  email: string;
  phone: string;
  avatar: string;
  trustScore: number;
  averageRating: number;
  totalReviews: number;
  memberSince: string;
  bio: string;
}

export interface Property {
  id: string;
  title: string;
  image: string;
  images: string[];
  price: number;
  location: string;
  city: string;
  furnishing: "Furnished" | "Semi-Furnished" | "Unfurnished";
  bedrooms: number;
  bathrooms: number;
  area: number;
  description: string;
  amenities: string[];
  ownerId: string;
  ownerName: string;
  ownerRating: number;
  ownerTrustScore: number;
  type: "Apartment" | "House" | "Villa" | "Studio";
}

export interface Review {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewerRole: "tenant" | "owner";
  reviewedUserId: string;
  behavior: number;
  communication: number;
  cleanliness: number;
  paymentTimeliness: number;
  maintenance: number;
  overallRating: number;
  comment: string;
  date: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export const users: User[] = [
  {
    id: "u1",
    name: "Arjun Mehta",
    role: "owner",
    email: "arjun@email.com",
    phone: "+91 98765 43210",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    trustScore: 9.2,
    averageRating: 4.6,
    totalReviews: 28,
    memberSince: "Jan 2023",
    bio: "Experienced property owner with 5+ years in residential rentals. I believe in maintaining properties to the highest standards.",
  },
  {
    id: "u2",
    name: "Priya Sharma",
    role: "tenant",
    email: "priya@email.com",
    phone: "+91 87654 32109",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    trustScore: 8.7,
    averageRating: 4.4,
    totalReviews: 15,
    memberSince: "Mar 2023",
    bio: "Working professional looking for clean, well-maintained spaces. I take great care of the properties I rent.",
  },
  {
    id: "u3",
    name: "Rohan Kapoor",
    role: "owner",
    email: "rohan@email.com",
    phone: "+91 76543 21098",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    trustScore: 7.8,
    averageRating: 3.9,
    totalReviews: 12,
    memberSince: "Jun 2023",
    bio: "Property investor managing multiple apartments across the city.",
  },
  {
    id: "u4",
    name: "Sneha Reddy",
    role: "tenant",
    email: "sneha@email.com",
    phone: "+91 65432 10987",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    trustScore: 9.5,
    averageRating: 4.8,
    totalReviews: 22,
    memberSince: "Feb 2023",
    bio: "Graduate student and responsible tenant. I value clean living spaces and open communication with landlords.",
  },
  {
    id: "u5",
    name: "Vikram Singh",
    role: "owner",
    email: "vikram@email.com",
    phone: "+91 54321 09876",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    trustScore: 8.4,
    averageRating: 4.2,
    totalReviews: 19,
    memberSince: "Apr 2023",
    bio: "Dedicated landlord who prioritizes tenant satisfaction and property maintenance.",
  },
];

export const properties: Property[] = [
  {
    id: "p1",
    title: "Modern 2BHK Apartment in Koramangala",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
    ],
    price: 25000,
    location: "Koramangala, Bangalore",
    city: "Bangalore",
    furnishing: "Furnished",
    bedrooms: 2,
    bathrooms: 2,
    area: 1100,
    description: "Beautifully furnished 2BHK apartment in the heart of Koramangala. Walking distance to restaurants, cafes, and tech parks. The apartment features modern interiors, a fully equipped kitchen, and a spacious balcony with a city view.",
    amenities: ["WiFi", "Parking", "Gym", "Swimming Pool", "24/7 Security", "Power Backup"],
    ownerId: "u1",
    ownerName: "Arjun Mehta",
    ownerRating: 4.6,
    ownerTrustScore: 9.2,
    type: "Apartment",
  },
  {
    id: "p2",
    title: "Spacious 3BHK Villa in Whitefield",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
    ],
    price: 55000,
    location: "Whitefield, Bangalore",
    city: "Bangalore",
    furnishing: "Semi-Furnished",
    bedrooms: 3,
    bathrooms: 3,
    area: 2200,
    description: "A luxurious 3BHK villa with a private garden and parking. Located in a premium gated community with access to world-class amenities. Perfect for families seeking comfort and space.",
    amenities: ["Garden", "Parking", "Club House", "Children's Play Area", "24/7 Security", "Intercom"],
    ownerId: "u3",
    ownerName: "Rohan Kapoor",
    ownerRating: 3.9,
    ownerTrustScore: 7.8,
    type: "Villa",
  },
  {
    id: "p3",
    title: "Cozy Studio Apartment in Indiranagar",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
    ],
    price: 15000,
    location: "Indiranagar, Bangalore",
    city: "Bangalore",
    furnishing: "Furnished",
    bedrooms: 1,
    bathrooms: 1,
    area: 550,
    description: "A charming studio apartment perfect for young professionals. Fully furnished with modern amenities, located in the vibrant Indiranagar neighborhood with easy access to metro and nightlife.",
    amenities: ["WiFi", "Laundry", "Security", "Power Backup", "Water Purifier"],
    ownerId: "u1",
    ownerName: "Arjun Mehta",
    ownerRating: 4.6,
    ownerTrustScore: 9.2,
    type: "Studio",
  },
  {
    id: "p4",
    title: "Premium 2BHK in HSR Layout",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
    ],
    price: 30000,
    location: "HSR Layout, Bangalore",
    city: "Bangalore",
    furnishing: "Furnished",
    bedrooms: 2,
    bathrooms: 2,
    area: 1250,
    description: "A premium apartment in one of Bangalore's most sought-after neighborhoods. Features high-end fixtures, modular kitchen, and excellent connectivity to major tech hubs.",
    amenities: ["WiFi", "Gym", "Parking", "CCTV", "Lift", "Rain Water Harvesting"],
    ownerId: "u5",
    ownerName: "Vikram Singh",
    ownerRating: 4.2,
    ownerTrustScore: 8.4,
    type: "Apartment",
  },
  {
    id: "p5",
    title: "Elegant 3BHK House in JP Nagar",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
    ],
    price: 40000,
    location: "JP Nagar, Bangalore",
    city: "Bangalore",
    furnishing: "Unfurnished",
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    description: "An elegant independent house with a spacious layout, natural lighting, and a peaceful neighborhood. Ideal for families looking for a long-term rental with ample space.",
    amenities: ["Parking", "Garden", "Water Tank", "Power Backup", "Terrace"],
    ownerId: "u3",
    ownerName: "Rohan Kapoor",
    ownerRating: 3.9,
    ownerTrustScore: 7.8,
    type: "House",
  },
  {
    id: "p6",
    title: "Luxury 1BHK in MG Road",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
    ],
    price: 22000,
    location: "MG Road, Bangalore",
    city: "Bangalore",
    furnishing: "Furnished",
    bedrooms: 1,
    bathrooms: 1,
    area: 750,
    description: "A luxury 1BHK apartment located on MG Road with stunning city views. Walking distance to metro station, malls, and entertainment hubs. Perfect for working professionals.",
    amenities: ["WiFi", "Gym", "Swimming Pool", "Concierge", "Parking", "Lift"],
    ownerId: "u5",
    ownerName: "Vikram Singh",
    ownerRating: 4.2,
    ownerTrustScore: 8.4,
    type: "Apartment",
  },
];

export const reviews: Review[] = [
  {
    id: "r1",
    reviewerId: "u2",
    reviewerName: "Priya Sharma",
    reviewerRole: "tenant",
    reviewedUserId: "u1",
    behavior: 5,
    communication: 4,
    cleanliness: 5,
    paymentTimeliness: 5,
    maintenance: 4,
    overallRating: 4.6,
    comment: "Arjun is an excellent landlord. He responded to all maintenance requests within 24 hours and the apartment was in pristine condition when I moved in. Highly recommended!",
    date: "2024-12-15",
  },
  {
    id: "r2",
    reviewerId: "u4",
    reviewerName: "Sneha Reddy",
    reviewerRole: "tenant",
    reviewedUserId: "u1",
    behavior: 5,
    communication: 5,
    cleanliness: 4,
    paymentTimeliness: 5,
    maintenance: 5,
    overallRating: 4.8,
    comment: "One of the best landlords I've had. Very professional, transparent about all charges, and genuinely cares about tenant comfort. The property was exactly as described.",
    date: "2024-11-20",
  },
  {
    id: "r3",
    reviewerId: "u1",
    reviewerName: "Arjun Mehta",
    reviewerRole: "owner",
    reviewedUserId: "u2",
    behavior: 4,
    communication: 5,
    cleanliness: 4,
    paymentTimeliness: 5,
    maintenance: 4,
    overallRating: 4.4,
    comment: "Priya was a wonderful tenant. Always paid rent on time, kept the apartment clean, and communicated any issues promptly. Would happily rent to her again.",
    date: "2024-12-20",
  },
  {
    id: "r4",
    reviewerId: "u1",
    reviewerName: "Arjun Mehta",
    reviewerRole: "owner",
    reviewedUserId: "u4",
    behavior: 5,
    communication: 5,
    cleanliness: 5,
    paymentTimeliness: 5,
    maintenance: 4,
    overallRating: 4.8,
    comment: "Sneha is the ideal tenant. Respectful, responsible, and took excellent care of the property. Her communication was outstanding throughout the lease period.",
    date: "2024-11-25",
  },
  {
    id: "r5",
    reviewerId: "u2",
    reviewerName: "Priya Sharma",
    reviewerRole: "tenant",
    reviewedUserId: "u3",
    behavior: 4,
    communication: 3,
    cleanliness: 4,
    paymentTimeliness: 4,
    maintenance: 3,
    overallRating: 3.6,
    comment: "Rohan is a decent landlord but could improve on communication. Sometimes took a while to respond to maintenance requests, but the property itself was good.",
    date: "2024-10-10",
  },
  {
    id: "r6",
    reviewerId: "u3",
    reviewerName: "Rohan Kapoor",
    reviewerRole: "owner",
    reviewedUserId: "u2",
    behavior: 5,
    communication: 4,
    cleanliness: 5,
    paymentTimeliness: 4,
    maintenance: 4,
    overallRating: 4.4,
    comment: "Priya maintained the property very well. She was courteous and respectful. Rent was almost always on time with good communication if there was ever a delay.",
    date: "2024-10-15",
  },
];

export const messages: Message[] = [
  { id: "m1", senderId: "u2", senderName: "Priya Sharma", receiverId: "u1", receiverName: "Arjun Mehta", content: "Hi Arjun, I'm interested in your 2BHK in Koramangala. Is it still available?", timestamp: "2025-01-10T10:00:00", read: true },
  { id: "m2", senderId: "u1", senderName: "Arjun Mehta", receiverId: "u2", receiverName: "Priya Sharma", content: "Hi Priya! Yes, it's still available. Would you like to schedule a visit?", timestamp: "2025-01-10T10:15:00", read: true },
  { id: "m3", senderId: "u2", senderName: "Priya Sharma", receiverId: "u1", receiverName: "Arjun Mehta", content: "That would be great! How about this Saturday at 11 AM?", timestamp: "2025-01-10T10:30:00", read: true },
  { id: "m4", senderId: "u1", senderName: "Arjun Mehta", receiverId: "u2", receiverName: "Priya Sharma", content: "Saturday works perfectly. I'll share the exact location on WhatsApp. Looking forward to it!", timestamp: "2025-01-10T11:00:00", read: false },
  { id: "m5", senderId: "u4", senderName: "Sneha Reddy", receiverId: "u5", receiverName: "Vikram Singh", content: "Hello Vikram, I saw your listing in HSR Layout. Can you tell me more about the parking facilities?", timestamp: "2025-01-09T14:00:00", read: true },
  { id: "m6", senderId: "u5", senderName: "Vikram Singh", receiverId: "u4", receiverName: "Sneha Reddy", content: "Hi Sneha! The apartment comes with one dedicated covered parking spot. There's also visitor parking available.", timestamp: "2025-01-09T14:30:00", read: true },
];
