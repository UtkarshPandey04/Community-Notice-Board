import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Announcement } from '@/types';

export default function Announcements() {
  const [announcements, setAnnouncements] = useLocalStorage<Announcement[]>('announcements', [
    {
      id: '1',
      title: 'Community Guidelines Updated',
      content: 'We have updated our community guidelines to ensure a safe and pleasant environment for all residents. Please review the new policies regarding noise levels, parking, and common area usage.',
      author: 'Community Admin',
      createdAt: '2024-01-15T10:00:00Z',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Maintenance Schedule - Water Supply',
      content: 'Scheduled water supply maintenance on January 20th from 9 AM to 3 PM. Please store water in advance for your daily needs.',
      author: 'Maintenance Team',
      createdAt: '2024-01-14T14:30:00Z',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'New Recycling Program',
      content: 'We are implementing a new recycling program starting February 1st. Separate collection bins will be placed in each building. Guidelines for waste segregation are attached.',
      author: 'Environmental Committee',
      createdAt: '2024-01-13T09:15:00Z',
      priority: 'low'
    }
  ]);

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    priority: 'medium' as 'high' | 'medium' | 'low'
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { user } = useAuth();

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="h-4 w-4" />;
      case 'medium': return <Info className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const announcement: Announcement = {
      id: Date.now().toString(),
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      author: user.name,
      createdAt: new Date().toISOString(),
      priority: newAnnouncement.priority
    };

    setAnnouncements([announcement, ...announcements]);
    setNewAnnouncement({ title: '', content: '', priority: 'medium' });
    setIsDialogOpen(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Community Announcements</h1>
            <p className="text-gray-600 mt-2">Stay informed about important community updates</p>
          </div>
          
          {user?.role === 'admin' && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Announcement
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Announcement</DialogTitle>
                  <DialogDescription>
                    Share important information with the community
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newAnnouncement.title}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={newAnnouncement.priority} onValueChange={(value: 'high' | 'medium' | 'low') => 
                      setNewAnnouncement({ ...newAnnouncement, priority: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={newAnnouncement.content}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                      rows={5}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Post Announcement
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="space-y-6">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{announcement.title}</CardTitle>
                    <div className="flex items-center space-x-4">
                      <Badge variant={getPriorityColor(announcement.priority)} className="flex items-center gap-1">
                        {getPriorityIcon(announcement.priority)}
                        {announcement.priority.toUpperCase()}
                      </Badge>
                      <span className="text-sm text-gray-500">by {announcement.author}</span>
                      <span className="text-sm text-gray-500">{formatDate(announcement.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-700 whitespace-pre-wrap">
                  {announcement.content}
                </CardDescription>
              </CardContent>
            </Card>
          ))}

          {announcements.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements yet</h3>
                <p className="text-gray-500">Check back later for community updates and important notices.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}