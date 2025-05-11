
import {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useMemes, Meme } from "@/hooks/useMemes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MemeCard from "@/components/meme/MemeCard";
import MainLayout from "@/components/layout/MainLayout";

const TrendingPage = () => {
  const { memes, loading, error } = useMemes();
  const [topMeme, setTopMeme] = useState<Meme | null>(null);
  const [weeklyWinners, setWeeklyWinners] = useState<Meme[]>([]);
  const [trendingTags, setTrendingTags] = useState<{tag: string, count: number}[]>([]);
  const [topCreators, setTopCreators] = useState<{id: string, username: string, avatar?: string, memeCount: number}[]>([]);
  
  useEffect(() => {
    if (memes.length) {
      // Find meme with highest votes in the last 24 hours
      const now = new Date().getTime();
      const last24Hours = now - 24 * 60 * 60 * 1000;
      
      const recentMemes = memes.filter(meme => {
        const memeDate = new Date(meme.createdAt).getTime();
        return memeDate >= last24Hours;
      });
      
      if (recentMemes.length) {
        const sorted = [...recentMemes].sort((a, b) => {
          const aScore = a.upvotes - a.downvotes;
          const bScore = b.upvotes - b.downvotes;
          return bScore - aScore;
        });
        
        setTopMeme(sorted[0]);
      }
      
      // Weekly winners (top 3 from the past week)
      const lastWeek = now - 7 * 24 * 60 * 60 * 1000;
      const weekMemes = memes.filter(meme => {
        const memeDate = new Date(meme.createdAt).getTime();
        return memeDate >= lastWeek;
      });
      
      const sortedWeekMemes = [...weekMemes].sort((a, b) => {
        const aScore = a.upvotes - a.downvotes;
        const bScore = b.upvotes - b.downvotes;
        return bScore - aScore;
      });
      
      setWeeklyWinners(sortedWeekMemes.slice(0, 3));
      
      // Find trending tags
      const tagsMap: Record<string, number> = {};
      memes.forEach(meme => {
        meme.tags.forEach(tag => {
          tagsMap[tag] = (tagsMap[tag] || 0) + 1;
        });
      });
      
      const sortedTags = Object.entries(tagsMap)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
      
      setTrendingTags(sortedTags);
      
      // Find top creators
      const creatorsMap: Record<string, {id: string, username: string, avatar?: string, memeCount: number}> = {};
      memes.forEach(meme => {
        const { id, username, avatar } = meme.creator;
        if (creatorsMap[id]) {
          creatorsMap[id].memeCount += 1;
        } else {
          creatorsMap[id] = { id, username, avatar, memeCount: 1 };
        }
      });
      
      const sortedCreators = Object.values(creatorsMap)
        .sort((a, b) => b.memeCount - a.memeCount)
        .slice(0, 5);
      
      setTopCreators(sortedCreators);
    }
  }, [memes]);

  if (loading) {
    return (
      <MainLayout>
        <div className="container max-w-5xl px-4 py-20 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container max-w-5xl px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-12"
        >
          <div>
            <h1 className="text-4xl font-bold mb-2">Trending</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Discover the most popular memes and creators on the platform
            </p>
          </div>
          
          {/* Meme of the Day */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Meme of the Day</h2>
              <Badge 
                className="bg-gradient-to-r from-brand-purple to-brand-indigo text-white"
              >
                Today's Winner
              </Badge>
            </div>
            
            {topMeme ? (
              <Link to={`/meme/${topMeme.id}`}>
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-lg"
                >
                  <div className="relative">
                    <img 
                      src={topMeme.imageUrl} 
                      alt="Meme of the Day" 
                      className="w-full object-cover max-h-[500px]"
                    />
                    
                    {/* Meme text overlay */}
                    {topMeme.topText && (
                      <div className="absolute top-4 left-0 right-0 text-center meme-text px-4 text-3xl md:text-4xl">
                        {topMeme.topText}
                      </div>
                    )}
                    
                    {topMeme.bottomText && (
                      <div className="absolute bottom-4 left-0 right-0 text-center meme-text px-4 text-3xl md:text-4xl">
                        {topMeme.bottomText}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 bg-white dark:bg-gray-800 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={topMeme.creator.avatar} alt={topMeme.creator.username} />
                        <AvatarFallback>
                          {topMeme.creator.username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{topMeme.creator.username}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-5 w-5 mr-1 text-green-500" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M5 15l7-7 7 7" 
                          />
                        </svg>
                        <span className="font-medium">{topMeme.upvotes}</span>
                      </div>
                      <div className="flex items-center">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-5 w-5 mr-1 text-gray-500" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                          />
                        </svg>
                        <span>{topMeme.commentCount}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">No memes found in the last 24 hours</p>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Weekly Winners */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Weekly Champions</h2>
            
            {weeklyWinners.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {weeklyWinners.map((meme, index) => (
                  <motion.div
                    key={meme.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="relative"
                  >
                    {index === 0 && (
                      <div className="absolute -top-3 -left-3 z-10">
                        <svg className="w-10 h-10 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      </div>
                    )}
                    <Link to={`/meme/${meme.id}`}>
                      <Card className="overflow-hidden h-full hover:shadow-md transition-shadow card-hover">
                        <div className="aspect-square overflow-hidden">
                          <img 
                            src={meme.imageUrl} 
                            alt={`Weekly winner ${index + 1}`}
                            className="w-full h-full object-cover object-center"
                          />
                        </div>
                        <CardHeader className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={meme.creator.avatar} alt={meme.creator.username} />
                                <AvatarFallback>
                                  {meme.creator.username.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <p className="text-sm font-medium">{meme.creator.username}</p>
                            </div>
                            <Badge variant="outline" className="ml-2">
                              +{meme.upvotes}
                            </Badge>
                          </div>
                        </CardHeader>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">No memes found for this week</p>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Trending Tags */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Trending Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {trendingTags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {trendingTags.map(({ tag, count }) => (
                      <Link to={`/tag/${tag}`} key={tag}>
                        <Badge 
                          variant="secondary" 
                          className="cursor-pointer hover:bg-secondary/80"
                        >
                          #{tag} <span className="ml-1 text-gray-500">({count})</span>
                        </Badge>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">No tags found</p>
                )}
              </CardContent>
            </Card>
            
            {/* Top Creators */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Top Creators</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {topCreators.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {topCreators.map((creator, index) => (
                      <Link to={`/user/${creator.id}`} key={creator.id}>
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={creator.avatar} alt={creator.username} />
                                <AvatarFallback>
                                  {creator.username.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              {index === 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{creator.username}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {creator.memeCount} meme{creator.memeCount > 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          <Badge variant={index === 0 ? "default" : "outline"} className="ml-2">
                            #{index + 1}
                          </Badge>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">No creators found</p>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Recent Trending Memes */}
          {memes.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Recent Trending</h2>
              <div className="grid grid-cols-1 gap-6">
                {memes.slice(0, 3).map((meme) => (
                  <MemeCard key={meme.id} meme={meme} />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default TrendingPage;
