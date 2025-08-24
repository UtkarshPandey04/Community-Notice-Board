import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Plus, ShoppingCart, Tag, User, Clock, Search } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Posting } from '@/types';

export default function Marketplace() {
  const [postings, setPostings] = useLocalStorage<Posting[]>('postings', [
    {
      id: '1',
      title: 'Bike - Excellent Condition',
      description: 'Selling my bike as I\'m moving to a new city. Great for trails and city riding. Well maintained with recent tune-up.',
      category: 'sell',
      price: 'Rs.35000',
      contact: 'amit1990@gmail.com',
      author: 'Amit Tiwari',
      createdAt: '2025-01-14T12:00:00Z'
    },
    {
      id: '2',
      title: 'Looking for Study Table',
      description: 'Need a sturdy study table for my home office. Preferably with drawers. Good condition required.',
      category: 'buy',
      contact: '9589874521',
      author: 'Vinayak',
      createdAt: '2024-01-13T15:30:00Z'
    },
    {
      id: '3',
      title: '2BHK Apartment Available',
      description: 'Spacious 2-bedroom apartment available for rent. Includes parking spot and access to community amenities.',
      category: 'rent',
      price: 'Rs.12000/month',
      contact: 'Krishna123@gmail.com',
      author: 'Property Manager',
      createdAt: '2024-01-12T09:15:00Z'
    }
  ]);

  const [newPosting, setNewPosting] = useState({
    title: '',
    description: '',
    category: 'sell' as 'buy' | 'sell' | 'rent',
    price: '',
    contact: ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { user } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const posting: Posting = {
      id: Date.now().toString(),
      title: newPosting.title,
      description: newPosting.description,
      category: newPosting.category,
      price: newPosting.price || undefined,
      contact: newPosting.contact,
      author: user.name,
      createdAt: new Date().toISOString()
    };

    setPostings([posting, ...postings]);
    setNewPosting({ title: '', description: '', category: 'sell', price: '', contact: '' });
    setIsDialogOpen(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'sell': return 'bg-green-100 text-green-800';
      case 'buy': return 'bg-blue-100 text-blue-800';
      case 'rent': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sell': return <Tag className="h-4 w-4" />;
      case 'buy': return <ShoppingCart className="h-4 w-4" />;
      case 'rent': return <User className="h-4 w-4" />;
      default: return <Tag className="h-4 w-4" />;
    }
  };

  const filteredPostings = postings.filter(posting => {
    const matchesSearch = posting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         posting.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || posting.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categoryCounts = {
    all: postings.length,
    sell: postings.filter(p => p.category === 'sell').length,
    buy: postings.filter(p => p.category === 'buy').length,
    rent: postings.filter(p => p.category === 'rent').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Community Marketplace</h1>
            <p className="text-gray-600 mt-2">Buy, sell, and rent within your community</p>
          </div>
          
          {user && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Posting
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Posting</DialogTitle>
                  <DialogDescription>
                    Share what you want to buy, sell, or rent
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={newPosting.category} onValueChange={(value: 'buy' | 'sell' | 'rent') => 
                      setNewPosting({ ...newPosting, category: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sell">For Sale</SelectItem>
                        <SelectItem value="buy">Looking to Buy</SelectItem>
                        <SelectItem value="rent">For Rent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newPosting.title}
                      onChange={(e) => setNewPosting({ ...newPosting, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price (optional)</Label>
                    <Input
                      id="price"
                      value={newPosting.price}
                      onChange={(e) => setNewPosting({ ...newPosting, price: e.target.value })}
                      placeholder="e.g., $100 or $50/month"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact">Contact Information</Label>
                    <Input
                      id="contact"
                      value={newPosting.contact}
                      onChange={(e) => setNewPosting({ ...newPosting, contact: e.target.value })}
                      placeholder="Email or phone number"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newPosting.description}
                      onChange={(e) => setNewPosting({ ...newPosting, description: e.target.value })}
                      rows={4}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Create Posting
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search postings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({categoryCounts.all})</TabsTrigger>
              <TabsTrigger value="sell">For Sale ({categoryCounts.sell})</TabsTrigger>
              <TabsTrigger value="buy">Wanted ({categoryCounts.buy})</TabsTrigger>
              <TabsTrigger value="rent">For Rent ({categoryCounts.rent})</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Postings Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPostings.map((posting) => (
            <Card key={posting.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge className={`${getCategoryColor(posting.category)} flex items-center gap-1`}>
                    {getCategoryIcon(posting.category)}
                    {posting.category.toUpperCase()}
                  </Badge>
                  {posting.price && (
                    <span className="text-lg font-bold text-green-600">{posting.price}</span>
                  )}
                </div>
                <CardTitle className="text-lg">{posting.title}</CardTitle>
                <div className="flex items-center text-sm text-gray-500">
                  <User className="h-4 w-4 mr-1" />
                  {posting.author}
                  <Clock className="h-4 w-4 ml-4 mr-1" />
                  {formatDate(posting.createdAt)}
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-700 mb-4">
                  {posting.description}
                </CardDescription>
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Contact:</span> {posting.contact}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPostings.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || selectedCategory !== 'all' ? 'No postings found' : 'No postings yet'}
              </h3>
              <p className="text-gray-500">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'Be the first to post something in the marketplace!'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}