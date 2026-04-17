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

const PropertyCard = ({ property }: { property: PropertyCardData }) => (
  <Link to={`/property/${property.id}`} className="group block">
    <div className="overflow-hidden rounded-lg border border-border bg-background shadow-card transition-shadow hover:shadow-hover">
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
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

export default PropertyCard;
