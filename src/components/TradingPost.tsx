import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Store, 
  Search, 
  Plus, 
  Coins, 
  Sword, 
  Shield, 
  Crown, 
  Gem,
  Package,
  User,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockListings = [
  {
    id: "1",
    title: "Enchanted Iron Sword",
    description: "A finely crafted iron sword with minor enchantments for increased durability.",
    price: 150,
    seller: "KnightBlade42",
    category: "weapons",
    rarity: "rare",
    timePosted: "2 hours ago"
  },
  {
    id: "2", 
    title: "Royal Ceremonial Crown",
    description: "Beautiful ceremonial crown, perfect for special occasions. Purely decorative.",
    price: 500,
    seller: "NobleCollector",
    category: "accessories",
    rarity: "legendary",
    timePosted: "1 day ago"
  },
  {
    id: "3",
    title: "Knight's Protection Amulet",
    description: "Protective charm said to bring good fortune in battle.",
    price: 75,
    seller: "MysticMerchant",
    category: "accessories",
    rarity: "uncommon",
    timePosted: "3 hours ago"
  },
  {
    id: "4",
    title: "Ancient Scroll Collection",
    description: "Collection of historical scrolls containing kingdom lore and stories.",
    price: 200,
    seller: "LoreKeeper",
    category: "collectibles",
    rarity: "rare",
    timePosted: "5 hours ago"
  }
];

const categories = [
  { value: "all", label: "All Categories", icon: Package },
  { value: "weapons", label: "Weapons", icon: Sword },
  { value: "armor", label: "Armor", icon: Shield },
  { value: "accessories", label: "Accessories", icon: Crown },
  { value: "collectibles", label: "Collectibles", icon: Gem }
];

const rarityColors = {
  common: "bg-gray-100 text-gray-800",
  uncommon: "bg-green-100 text-green-800", 
  rare: "bg-blue-100 text-blue-800",
  legendary: "bg-purple-100 text-purple-800"
};

export function TradingPost() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [newListing, setNewListing] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    rarity: "common"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const filteredListings = mockListings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || listing.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListing.title || !newListing.description || !newListing.price || !newListing.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate listing creation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Listing Created",
      description: "Your item has been listed in the trading post.",
    });
    
    setNewListing({ title: "", description: "", price: "", category: "", rarity: "common" });
    setIsSubmitting(false);
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.icon : Package;
  };

  return (
    <div className="h-full bg-background">
      <div className="h-full overflow-y-auto">
        {/* Header */}
        <div className="bg-throne-gradient border-b border-border p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Store className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-display font-bold text-primary">Trading Post</h1>
                <p className="text-muted-foreground">Buy, sell, and trade with fellow citizens</p>
              </div>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Listing
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Listing</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateListing} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="listing-title">Item Title</Label>
                    <Input
                      id="listing-title"
                      placeholder="Enter item name..."
                      value={newListing.title}
                      onChange={(e) => setNewListing(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="listing-description">Description</Label>
                    <Textarea
                      id="listing-description"
                      placeholder="Describe your item..."
                      value={newListing.description}
                      onChange={(e) => setNewListing(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="listing-price">Price (Gold)</Label>
                      <Input
                        id="listing-price"
                        type="number"
                        placeholder="0"
                        value={newListing.price}
                        onChange={(e) => setNewListing(prev => ({ ...prev, price: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="listing-category">Category</Label>
                      <Select 
                        value={newListing.category} 
                        onValueChange={(value) => setNewListing(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.slice(1).map(category => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="listing-rarity">Rarity</Label>
                    <Select 
                      value={newListing.rarity} 
                      onValueChange={(value) => setNewListing(prev => ({ ...prev, rarity: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="common">Common</SelectItem>
                        <SelectItem value="uncommon">Uncommon</SelectItem>
                        <SelectItem value="rare">Rare</SelectItem>
                        <SelectItem value="legendary">Legendary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex gap-2 justify-end pt-4">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Creating..." : "Create Listing"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="p-6">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2 flex-1">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              
              <TabsList className="grid grid-cols-5 w-auto">
                {categories.map(category => {
                  const Icon = category.icon;
                  return (
                    <TabsTrigger key={category.value} value={category.value} className="flex items-center gap-1">
                      <Icon className="w-3 h-3" />
                      <span className="hidden sm:inline">{category.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            {categories.map(category => (
              <TabsContent key={category.value} value={category.value}>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredListings.map(listing => {
                    const CategoryIcon = getCategoryIcon(listing.category);
                    return (
                      <Card key={listing.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <CategoryIcon className="w-4 h-4 text-primary" />
                              <CardTitle className="text-lg">{listing.title}</CardTitle>
                            </div>
                            <Badge className={rarityColors[listing.rarity as keyof typeof rarityColors]}>
                              {listing.rarity}
                            </Badge>
                          </div>
                          <CardDescription className="line-clamp-2">
                            {listing.description}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-lg font-semibold text-primary">
                              <Coins className="w-4 h-4" />
                              {listing.price} Gold
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {listing.seller}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {listing.timePosted}
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1">
                              Buy Now
                            </Button>
                            <Button size="sm" variant="outline">
                              Message Seller
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                
                {filteredListings.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Store className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">No items found</p>
                    <p>Try adjusting your search or browse different categories.</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}