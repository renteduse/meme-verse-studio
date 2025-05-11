
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMemes, Meme } from "@/hooks/useMemes";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import MemeCard from "@/components/meme/MemeCard";
import MainLayout from "@/components/layout/MainLayout";

// Time periods in milliseconds
const TIME_PERIODS = {
  "24h": 24 * 60 * 60 * 1000, // 24 hours
  "week": 7 * 24 * 60 * 60 * 1000, // 7 days
};

type SortPeriod = "new" | "24h" | "week" | "all";

const Feed = () => {
  const { memes, loading, error } = useMemes();
  const [sortPeriod, setSortPeriod] = useState<SortPeriod>("new");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMemes, setFilteredMemes] = useState<Meme[]>([]);
  
  useEffect(() => {
    if (!memes.length) return;
    
    const now = new Date().getTime();
    
    // First apply search filter
    let filtered = memes.filter(meme => {
      const searchText = searchQuery.toLowerCase().trim();
      if (!searchText) return true;
      
      return (
        meme.topText.toLowerCase().includes(searchText) ||
        meme.bottomText.toLowerCase().includes(searchText) ||
        meme.creator.username.toLowerCase().includes(searchText) ||
        meme.tags.some(tag => tag.includes(searchText))
      );
    });
    
    // Then apply time filter and sort
    switch (sortPeriod) {
      case "new":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
        
      case "24h":
        filtered = filtered.filter(meme => {
          const memeDate = new Date(meme.createdAt).getTime();
          return now - memeDate <= TIME_PERIODS["24h"];
        });
        filtered.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
        break;
        
      case "week":
        filtered = filtered.filter(meme => {
          const memeDate = new Date(meme.createdAt).getTime();
          return now - memeDate <= TIME_PERIODS["week"];
        });
        filtered.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
        break;
        
      case "all":
        filtered.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
        break;
    }
    
    setFilteredMemes(filtered);
  }, [memes, sortPeriod, searchQuery]);

  const handleSortChange = (newSortPeriod: SortPeriod) => {
    setSortPeriod(newSortPeriod);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <MainLayout>
      <div className="container max-w-4xl px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-3xl font-bold">Meme Feed</h1>
            <div className="w-full sm:w-auto">
              <Input 
                placeholder="Search memes..." 
                value={searchQuery}
                onChange={handleSearch}
                className="w-full sm:w-64"
              />
            </div>
          </div>

          <Tabs value={sortPeriod} onValueChange={(v) => handleSortChange(v as SortPeriod)}>
            <TabsList className="mb-6">
              <TabsTrigger value="new">New</TabsTrigger>
              <TabsTrigger value="24h">Top Today</TabsTrigger>
              <TabsTrigger value="week">Top This Week</TabsTrigger>
              <TabsTrigger value="all">All Time</TabsTrigger>
            </TabsList>

            <TabsContent value={sortPeriod} className="space-y-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                  <p className="text-gray-500">Loading memes...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <p className="text-red-500 mb-4">{error}</p>
                  <Button>Retry</Button>
                </div>
              ) : filteredMemes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  {searchQuery ? (
                    <>
                      <p className="text-gray-500 mb-4">No memes found matching "{searchQuery}"</p>
                      <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-500 mb-4">No memes in this category yet</p>
                      <Button onClick={() => handleSortChange("new")}>See New Memes</Button>
                    </>
                  )}
                </div>
              ) : (
                <AnimatePresence>
                  <div className="grid grid-cols-1 gap-8">
                    {filteredMemes.map(meme => (
                      <MemeCard key={meme.id} meme={meme} />
                    ))}
                  </div>
                </AnimatePresence>
              )}
            </TabsContent>
          </Tabs>

          {filteredMemes.length > 0 && (
            <div className="flex justify-center">
              <Button variant="outline">Load More</Button>
            </div>
          )}
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Feed;
