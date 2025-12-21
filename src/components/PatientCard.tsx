import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { User, Calendar, MapPin, Phone } from "lucide-react";

interface PatientCardProps {
  name: string;
  age: number;
  gender: string;
  location: string;
  phone: string;
  registrationDate: string;
  onClick?: () => void;
}

export function PatientCard({
  name,
  age,
  gender,
  location,
  phone,
  registrationDate,
  onClick,
}: PatientCardProps) {
  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer border-border"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
            <User className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground">{name}</h3>
            <p className="text-sm text-muted-foreground">
              {age} years • {gender}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="h-4 w-4" />
          <span>{phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Registered: {registrationDate}</span>
        </div>
      </CardContent>
    </Card>
  );
}
