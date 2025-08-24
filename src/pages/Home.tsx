import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Calendar, ShoppingCart, Phone, Users, Megaphone } from 'lucide-react';

interface HomeProps {
  onPageChange: (page: string) => void;
}

export default function Home({ onPageChange }: HomeProps) {
  const features = [
    {
      icon: <Megaphone className="h-8 w-8 text-blue-500" />,
      title: 'Announcements',
      description: 'Stay updated with important community notices and updates',
      action: () => onPageChange('announcements')
    },
    {
      icon: <Calendar className="h-8 w-8 text-green-500" />,
      title: 'Local Events',
      description: 'Discover and participate in community events and activities',
      action: () => onPageChange('events')
    },
    {
      icon: <ShoppingCart className="h-8 w-8 text-purple-500" />,
      title: 'Marketplace',
      description: 'Buy, sell, or rent items within the community',
      action: () => onPageChange('marketplace')
    },
    {
      icon: <Phone className="h-8 w-8 text-red-500" />,
      title: 'Important Contacts',
      description: 'Quick access to essential community contacts and services',
      action: () => onPageChange('contacts')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Users className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Your Community Board
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your digital hub for community announcements, local events, marketplace, and important contacts. 
            Stay connected and engaged with your neighbors.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={feature.action}>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center mb-4">
                  {feature.description}
                </CardDescription>
                <Button className="w-full" variant="outline">
                  Explore
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Bell className="h-6 w-6 mr-2 text-blue-600" />
            Recent Activity
          </h2>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="font-medium">New Community Guidelines Posted</p>
              <p className="text-sm text-gray-600">Important updates to community rules and regulations</p>
              <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <p className="font-medium">Monthly Community Meeting</p>
              <p className="text-sm text-gray-600">Join us for the monthly community discussion</p>
              <p className="text-xs text-gray-500 mt-1">Tomorrow at 7:00 PM</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <p className="font-medium">Bicycle for Sale</p>
              <p className="text-sm text-gray-600">Bike in excellent condition available</p>
              <p className="text-xs text-gray-500 mt-1">3 days ago</p>
            </div>
          </div>
          <Button className="mt-6" variant="outline" onClick={() => onPageChange('announcements')}>
            View All Updates
          </Button>
        </div>
      </div>
    </div>
  );
}