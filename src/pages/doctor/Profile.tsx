import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { User, Mail, Phone, MapPin, Building, Stethoscope } from "lucide-react";

export default function Profile() {
  const [formData, setFormData] = useState({
    name: "Dr. Rajesh Sharma",
    email: "dr.sharma@cityhospital.com",
    phone: "+91 9876543210",
    specialization: "Cardiology",
    licenseNumber: "MC123456",
    hospital: "City Medical Center",
    department: "Cardiology Department",
    address: "123 Medical Street, Healthcare City, HC 12345",
    experience: "15 years",
    qualifications: "MBBS, MD Cardiology, FACC",
    bio: "Experienced cardiologist with 15+ years in cardiovascular care. Specializes in interventional cardiology, heart failure management, and preventive cardiology.",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Here you would typically save to backend
    toast.success("Profile updated successfully!");
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset to original data
    setIsEditing(false);
    toast.info("Changes cancelled");
  };

  return (
    <DashboardLayout role="doctor">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Doctor Profile</h1>
          <p className="text-muted-foreground mt-2">Manage your professional information and settings</p>
        </div>

        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <Stethoscope className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{formData.name}</h2>
                <p className="text-muted-foreground">{formData.specialization} • {formData.hospital}</p>
                <p className="text-sm text-muted-foreground">{formData.experience} experience</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>Update your basic information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">Medical License Number</Label>
                <Input
                  id="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={(e) => handleChange("licenseNumber", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Professional Information
            </CardTitle>
            <CardDescription>Your medical practice details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Select value={formData.specialization} onValueChange={(value) => handleChange("specialization", value)} disabled={!isEditing}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cardiology">Cardiology</SelectItem>
                    <SelectItem value="Neurology">Neurology</SelectItem>
                    <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                    <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                    <SelectItem value="Dermatology">Dermatology</SelectItem>
                    <SelectItem value="General Medicine">General Medicine</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => handleChange("experience", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hospital">Hospital</Label>
                <Input
                  id="hospital"
                  value={formData.hospital}
                  onChange={(e) => handleChange("hospital", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => handleChange("department", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="qualifications">Qualifications</Label>
              <Input
                id="qualifications"
                value={formData.qualifications}
                onChange={(e) => handleChange("qualifications", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Hospital Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                disabled={!isEditing}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Bio */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Bio</CardTitle>
            <CardDescription>A brief description of your expertise and experience</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              disabled={!isEditing}
              rows={4}
              placeholder="Tell patients about your experience and areas of expertise..."
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          ) : (
            <>
              <Button onClick={handleSave}>
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}