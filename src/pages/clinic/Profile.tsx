import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

export default function Profile() {
  const [formData, setFormData] = useState({
    clinicName: "Rural Health Center, Village A",
    contactPerson: "Dr. Ravi Kumar",
    email: "clinic@example.com",
    phone: "+91 98765 43210",
    address: "Village A, District XYZ, State ABC - 123456",
    registrationNumber: "RHC-VA-2023-001",
    specializations: "General Medicine, Pediatrics, Basic Emergency Care",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated successfully!");
  };

  return (
    <DashboardLayout role="clinic">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your clinic information and settings</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-border md:col-span-2">
            <CardHeader>
              <CardTitle>Clinic Information</CardTitle>
              <CardDescription>Update your clinic details and contact information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="clinicName">Clinic Name</Label>
                    <Input
                      id="clinicName"
                      value={formData.clinicName}
                      onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Contact Person</Label>
                    <Input
                      id="contactPerson"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registrationNumber">Registration Number</Label>
                  <Input
                    id="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specializations">Specializations</Label>
                  <Textarea
                    id="specializations"
                    value={formData.specializations}
                    onChange={(e) => setFormData({ ...formData, specializations: e.target.value })}
                    rows={2}
                  />
                </div>

                <Button type="submit">Save Changes</Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-border md:col-span-2">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Update your password and security preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" placeholder="••••••••" />
                </div>
                <Button variant="secondary">Update Password</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
