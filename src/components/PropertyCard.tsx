import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Bed, Bath, Maximize } from "lucide-react";
import StarRating from "./StarRating";

export interface PropertyCardData {
  id: string;
  title: string;
  image: string;
  furnishing: string;
  type: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  price: number;
  ownerRating: number;
}

const defaultImages = [
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
];

const PropertyCard = ({ property }: { property: PropertyCardData }) => {
  // Pick a unique fallback image based on property id hash if image is missing
  const getFallbackImage = () => {
    if (property.image && property.image.trim() !== "") return property.image;
    // Use a hash of the id to pick a default image
    let hash = 0;
    for (let i = 0; i < property.id.length; i++) {
      hash = property.id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const idx = Math.abs(hash) % defaultImages.length;
    return defaultImages[idx];
  };
  const [imgSrc, setImgSrc] = React.useState(getFallbackImage());
  return (
    <Link to={`/property/${property.id}`} className="group block">
      <div className="overflow-hidden rounded-lg border border-border bg-background shadow-card transition-shadow hover:shadow-hover">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={imgSrc}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={() => setImgSrc(defaultImages[Math.abs(property.id.length) % defaultImages.length])}
          />
        </div>
      <div className="p-4">
        <div className="mb-1 flex items-center justify-between">
          <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">{property.furnishing}</span>
          <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">{property.type}</span>
        </div>
        <h3 className="mt-2 font-heading text-base font-semibold text-foreground line-clamp-1">{property.title}</h3>
        <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span>{property.location}</span>
        </div>
        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Bed className="h-3.5 w-3.5" />{property.bedrooms} Bed</span>
          <span className="flex items-center gap-1"><Bath className="h-3.5 w-3.5" />{property.bathrooms} Bath</span>
          <span className="flex items-center gap-1"><Maximize className="h-3.5 w-3.5" />{property.area} sqft</span>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <span className="font-heading text-lg font-bold text-foreground">₹{property.price.toLocaleString()}<span className="text-xs font-normal text-muted-foreground">/mo</span></span>
          <div className="flex items-center gap-1">
            <StarRating rating={property.ownerRating} size={12} showValue={false} />
            <span className="text-xs text-muted-foreground">{property.ownerRating}</span>
          </div>
        </div>
      </div>
    </div>
    </Link>
  );
};

export default PropertyCard;
