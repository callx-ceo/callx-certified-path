import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Award, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  // Mock stats - will be replaced with real data
  const stats = [
    {
      title: "Total Courses",
      value: "8",
      icon: BookOpen,
      description: "Active certification programs",
    },
    {
      title: "Total Users",
      value: "156",
      icon: Users,
      description: "Trainees and managers",
    },
    {
      title: "Certificates Issued",
      value: "89",
      icon: Award,
      description: "This month",
    },
    {
      title: "Completion Rate",
      value: "78%",
      icon: TrendingUp,
      description: "Average across all courses",
    },
  ];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your CallX certification platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Get started by creating a new course or inviting users to your platform.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
