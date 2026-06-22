import { Link } from "react-router-dom";
import { BedDouble, Droplets, Heart, MapPin, Ruler, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { availabilityLabels, badgeVariant, damageLabels, propertyTypeLabels, statusLabels } from "@/lib/labels";
import { cn, formatCurrency } from "@/lib/utils";
import type { Property } from "@/types/api";

function propertyImage(property: Property) {
  return property.main_image?.url ?? property.mainImage?.url ?? property.images?.[0]?.url;
}

export function PropertyCard({
  property,
  showStatus = false,
  onFavorite,
}: {
  property: Property;
  showStatus?: boolean;
  onFavorite?: (property: Property) => void;
}) {
  const image = propertyImage(property);
  const location = property.location ?? [property.governorate?.name, property.city?.name, property.neighborhood?.name, property.street].filter(Boolean).join(" - ");

  return (
    <article className="group overflow-hidden rounded-lg border bg-card shadow-hima transition-all hover:-translate-y-1 hover:border-green-100 hover:shadow-hima-hover">
      <Link to={`/properties/${property.id}`} className="block">
        <div className={cn("relative h-44 w-full overflow-hidden", !image && "hima-gradient")}>
          {image && <img src={image} alt={property.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />}
          <Badge variant="warning" className="absolute right-3 top-3">
            {propertyTypeLabels[property.type] ?? property.type}
          </Badge>
          {onFavorite && (
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="absolute left-3 top-3 rounded-full"
              onClick={(event) => {
                event.preventDefault();
                onFavorite(property);
              }}
            >
              <Heart className="h-4 w-4" />
            </Button>
          )}
        </div>
      </Link>
      <div className="grid gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link to={`/properties/${property.id}`} className="line-clamp-1 text-lg font-extrabold text-foreground hover:text-primary">
              {property.title}
            </Link>
            <div className="mt-1 flex items-center gap-1 text-sm font-semibold text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="line-clamp-1">{location || "الموقع غير محدد"}</span>
            </div>
          </div>
          <div className="whitespace-nowrap text-lg font-black text-primary">{formatCurrency(property.price)} د.ل</div>
        </div>
        <div className="flex flex-wrap gap-2">
          {property.rooms !== undefined && property.rooms !== null && (
            <Badge variant="secondary">
              <BedDouble className="ml-1 h-3 w-3" />
              {property.rooms} غرف
            </Badge>
          )}
          {property.area_m2 && (
            <Badge variant="secondary">
              <Ruler className="ml-1 h-3 w-3" />
              {property.area_m2} م²
            </Badge>
          )}
          <Badge variant="secondary">{damageLabels[property.damage_status] ?? property.damage_status}</Badge>
          {property.has_water ? <Badge variant="success"><Droplets className="ml-1 h-3 w-3" />ماء</Badge> : null}
          {property.has_electricity ? <Badge variant="success"><Zap className="ml-1 h-3 w-3" />كهرباء</Badge> : null}
        </div>
        {showStatus && (
          <div className="flex flex-wrap gap-2">
            {property.status && <Badge variant={badgeVariant(property.status)}>{statusLabels[property.status] ?? property.status}</Badge>}
            {property.availability && <Badge variant={badgeVariant(property.availability)}>{availabilityLabels[property.availability] ?? property.availability}</Badge>}
          </div>
        )}
      </div>
    </article>
  );
}
