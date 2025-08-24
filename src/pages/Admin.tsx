import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Announcement, Event, Posting, Contact } from '@/types';
import { Shield, Users, Megaphone, Calendar, ShoppingCart, Phone, Trash2, BarChart3 } from 'lucide-react';

export default function Admin() {
  const { user } = useAuth();
  const [announcements] = useLocalStorage<Announcement[]>('announcements', []);
  const [events] = useLocalStorage<Event[]>('events', []);
  const [postings] = useLocalStorage<Posting[]>('postings', []);
  const [contacts] = useLocalStorage<Contact[]>('contacts', []);

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
            <p className="text-gray-500">You need admin privileges to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = {
    announcements: announcements.length,
    events: events.length,
    postings: postings.length,
    contacts: contacts.length,
    highPriorityAnnouncements: announcements.filter(a => a.priority === 'high').length,
    upcomingEvents: events.filter(e => new Date(e.date) >= new Date()).length,
    sellPostings: postings.filter(p => p.category === 'sell').length,
    emergencyContacts: contacts.filter(c => c.department.toLowerCase() === 'emergency').length
  };

  const recentActivity = [
    ...announcements.slice(0, 3).map(a => ({ type: 'announcement', title: a.title, date: a.createdAt })),
    ...events.slice(0, 3).map(e => ({ type: 'event', title: e.title, date: e.createdAt })),
    ...postings.slice(0, 3).map(p => ({ type: 'posting', title: p.title, date: p.createdAt }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all community data? This action cannot be undone.')) {
      localStorage.removeItem('announcements');
      localStorage.removeItem('events');
      localStorage.removeItem('postings');
      localStorage.removeItem('contacts');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Shield className="h-8 w-8 mr-3 text-blue-600" />
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Manage community content and monitor activity</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Announcements</CardTitle>
                  <Megaphone className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.announcements}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.highPriorityAnnouncements} high priority
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.events}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.upcomingEvents} upcoming
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Marketplace Posts</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.postings}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.sellPostings} for sale
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Important Contacts</CardTitle>
                  <Phone className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.contacts}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.emergencyContacts} emergency
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Platform Usage Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Community Engagement</span>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    Total community posts: {stats.announcements + stats.events + stats.postings}
                  </div>
                  <div className="text-sm text-gray-600">
                    Essential services listed: {stats.contacts}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Announcements</CardTitle>
                </CardHeader>
                <CardContent>
                  {announcements.slice(0, 5).length > 0 ? (
                    <div className="space-y-3">
                      {announcements.slice(0, 5).map((announcement) => (
                        <div key={announcement.id} className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{announcement.title}</p>
                            <p className="text-xs text-gray-500">by {announcement.author}</p>
                          </div>
                          <Badge variant={announcement.priority === 'high' ? 'destructive' : 'secondary'}>
                            {announcement.priority}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No announcements yet</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent>
                  {events.filter(e => new Date(e.date) >= new Date()).slice(0, 5).length > 0 ? (
                    <div className="space-y-3">
                      {events.filter(e => new Date(e.date) >= new Date()).slice(0, 5).map((event) => (
                        <div key={event.id} className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{event.title}</p>
                            <p className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                          </div>
                          <Badge variant="outline">{event.location}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No upcoming events</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest community posts and updates</CardDescription>
              </CardHeader>
              <CardContent>
                {recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          {activity.type === 'announcement' && <Megaphone className="h-5 w-5 text-blue-500" />}
                          {activity.type === 'event' && <Calendar className="h-5 w-5 text-green-500" />}
                          {activity.type === 'posting' && <ShoppingCart className="h-5 w-5 text-purple-500" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{activity.title}</p>
                          <p className="text-xs text-gray-500 capitalize">{activity.type}</p>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(activity.date).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No recent activity</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Management</CardTitle>
                  <CardDescription>Manage community board settings and data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg bg-red-50 border-red-200">
                    <h3 className="font-medium text-red-800 mb-2">Danger Zone</h3>
                    <p className="text-sm text-red-700 mb-4">
                      Clear all community data including announcements, events, marketplace posts, and contacts.
                      This action cannot be undone.
                    </p>
                    <Button variant="destructive" onClick={clearAllData}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear All Data
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Version:</span> 1.0.0</p>
                    <p><span className="font-medium">Created:</span> Community Board Platform</p>
                    <p><span className="font-medium">Storage:</span> Local Browser Storage</p>
                    <p><span className="font-medium">User Management:</span> Demo Authentication</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}