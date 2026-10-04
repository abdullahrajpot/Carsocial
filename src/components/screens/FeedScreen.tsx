import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Sparkles, 
  Plus, 
  Clock, 
  MapPin, 
  ShieldAlert, 
  CheckCircle2, 
  Send, 
  Image as ImageIcon,
  Eye,
  Sliders,
  X
} from 'lucide-react';
import { Post, Story, User, Vehicle, Language } from '../../types';
import { translations } from '../../i18n/translations';
import { formatPlateNumber } from '../../data/mockData';

interface FeedScreenProps {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  stories: Story[];
  currentUser: User;
  userVehicles: Vehicle[];
  lang: Language;
  onOpenGarage: (vehicleId?: string) => void;
  onFlagContent: (post: Post, reason: string) => void;
}

export const FeedScreen: React.FC<FeedScreenProps> = ({
  posts,
  setPosts,
  stories,
  currentUser,
  userVehicles,
  lang,
  onOpenGarage,
  onFlagContent,
}) => {
  const t = translations[lang];

  // Feed ordering toggle: AI Recommended vs Chronological
  const [feedMode, setFeedMode] = useState<'ai' | 'chronological'>('ai');

  // Active Story Viewer Modal
  const [activeStory, setActiveStory] = useState<Story | null>(null);

  // Create Post Modal
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [newPostText, setNewPostText] = useState('');
  const [newPostLocation, setNewPostLocation] = useState('Dubai Autodrome Paddock');
  const [selectedVehicleId, setSelectedVehicleId] = useState(userVehicles[0]?.id || '');
  const [autoBlurChecked, setAutoBlurChecked] = useState(currentUser.autoBlurFacesAndPlates);
  const [aiModerationStatus, setAiModerationStatus] = useState<string | null>(null);

  // Active comment input per post
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({ post_1: true });

  const toggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likesCount: isLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
          };
        }
        return p;
      })
    );
  };

  const toggleSave = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, isSaved: !p.isSaved } : p))
    );
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newComment = {
            id: `c_${Date.now()}`,
            authorName: lang === 'ar' && currentUser.nameAr ? currentUser.nameAr : currentUser.name,
            authorAvatar: currentUser.avatar,
            text,
            createdAt: 'Just now',
          };
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [...p.comments, newComment],
          };
        }
        return p;
      })
    );

    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    setOpenComments((prev) => ({ ...prev, [postId]: true }));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    // AI Moderation screening (AI-NLP-02 & AI-NN-05)
    const lower = newPostText.toLowerCase();
    const isDangerous = lower.includes('drift on highway') || lower.includes('racing police') || lower.includes('300km/h street');

    if (isDangerous) {
      setAiModerationStatus('Flagged by AI: Street racing or reckless public driving detected (Rule BR-3). Please revise.');
      return;
    }

    const primaryVeh = userVehicles.find((v) => v.id === selectedVehicleId) || userVehicles[0];

    const newPost: Post = {
      id: `post_${Date.now()}`,
      authorId: currentUser.id,
      authorName: lang === 'ar' && currentUser.nameAr ? currentUser.nameAr : currentUser.name,
      authorAvatar: currentUser.avatar,
      authorPlateMasked: formatPlateNumber(currentUser.primaryPlate, 'DXB', currentUser.plateDisplayMode),
      isVerified: currentUser.isVerified,
      taggedVehicle: primaryVeh
        ? {
            make: primaryVeh.make,
            model: primaryVeh.model,
            year: primaryVeh.year,
            plateMasked: formatPlateNumber(primaryVeh.plateNumber, primaryVeh.regionCode, currentUser.plateDisplayMode),
          }
        : undefined,
      content: newPostText,
      image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
      location: newPostLocation,
      createdAt: 'Just now',
      likesCount: 1,
      isLiked: true,
      commentsCount: 0,
      comments: [],
      sharesCount: 0,
      isSaved: false,
      isAiRecommended: true,
      aiRecommendationReason: 'AI Recommended: Newly shared verified enthusiast build',
      aiRecommendationReasonAr: 'توصية الذكاء الاصطناعي: تحديث جديد من مالك موثق',
      hashtags: ['CarSocial', 'TrackLife', 'VerifiedOwner'],
    };

    setPosts([newPost, ...posts]);
    setNewPostText('');
    setCreatePostOpen(false);
    setAiModerationStatus(null);
  };

  // Filter & sort posts according to toggle
  const displayedPosts = [...posts].sort((a, b) => {
    if (feedMode === 'ai') {
      if (a.isAiRecommended && !b.isAiRecommended) return -1;
      if (!a.isAiRecommended && b.isAiRecommended) return 1;
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      
      {/* 24-Hour Stories Carousel (FR-FEED-02) */}
      <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-4 transition-colors">
        <div className="flex items-center justify-between mb-3 px-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            {t.feed.stories}
          </span>
          <span className="text-[11px] font-semibold text-amber-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>24h Disappearing</span>
          </span>
        </div>

        <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
          {/* Add Story Button */}
          <div
            onClick={() => setActiveStory(stories[0])}
            className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 group"
          >
            <div className="relative w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 to-amber-400 group-hover:scale-105 transition-transform">
              <img
                src={currentUser.avatar}
                alt="My Story"
                className="w-full h-full rounded-full object-cover border-2 border-white dark:border-stone-900"
              />
              <div className="absolute bottom-0 end-0 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center border-2 border-white dark:border-stone-900">
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </div>
            <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              {t.feed.addStory}
            </span>
          </div>

          {/* Active Stories */}
          {stories.map((story) => (
            <div
              key={story.id}
              onClick={() => setActiveStory(story)}
              className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 group"
            >
              <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 group-hover:scale-105 transition-transform">
                <img
                  src={story.authorAvatar}
                  alt={story.authorName}
                  className="w-full h-full rounded-full object-cover border-2 border-white dark:border-stone-900"
                />
              </div>
              <span className="text-xs font-medium text-stone-700 dark:text-stone-300 max-w-[70px] truncate">
                {story.authorName.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Feed Controls: Share Box & Feed Ranking Mode */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Create Post Prompt Card */}
        <div 
          onClick={() => setCreatePostOpen(true)}
          className="w-full flex-1 flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 cursor-pointer hover:border-amber-500/50 transition-all shadow-sm"
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-9 h-9 rounded-full object-cover ring-1 ring-amber-500/30"
          />
          <span className="text-sm text-stone-400 dark:text-stone-500 select-none flex-1">
            {t.feed.createPost}
          </span>
          <button className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" />
            <span>Post</span>
          </button>
        </div>

        {/* Feed Sorting Switcher (AI Recommended vs Chronological FR-FEED-03) */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/60 shrink-0">
          <button
            onClick={() => setFeedMode('ai')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              feedMode === 'ai'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="flex items-center gap-1">
              <span className="font-bold">[AI]</span>
              <span>{t.feed.aiPersonalized}</span>
            </span>
          </button>
          <button
            onClick={() => setFeedMode('chronological')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              feedMode === 'chronological'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{t.feed.chronological}</span>
          </button>
        </div>
      </div>

      {/* Posts Stream */}
      <div className="space-y-6">
        {displayedPosts.map((post) => (
          <article
            key={post.id}
            className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden transition-colors"
          >
            {/* AI Recommendation Banner (Rule: Label every AI-generated item 'AI') */}
            {post.isAiRecommended && feedMode === 'ai' && (
              <div className="px-5 py-2 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-b border-amber-500/15 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold">
                  <span className="px-1.5 py-0.2 rounded bg-amber-500 text-white font-mono text-[10px] font-extrabold">
                    AI
                  </span>
                  <span>
                    {lang === 'ar' && post.aiRecommendationReasonAr
                      ? post.aiRecommendationReasonAr
                      : post.aiRecommendationReason}
                  </span>
                </div>
              </div>
            )}

            {/* Post Header: Author, Plate, Tagged Car */}
            <div className="p-5 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={post.authorAvatar}
                  alt={post.authorName}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-stone-200 dark:ring-stone-800"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-sm text-stone-900 dark:text-white">
                      {post.authorName}
                    </span>
                    {post.isVerified && (
                      <CheckCircle2 className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300">
                      {post.authorPlateMasked}
                    </span>
                    <span>• {post.createdAt}</span>
                  </div>
                </div>
              </div>

              {/* Tagged Vehicle Badge */}
              {post.taggedVehicle && (
                <button
                  onClick={() => onOpenGarage()}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-colors text-xs font-bold"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>
                    {post.taggedVehicle.year} {post.taggedVehicle.make} {post.taggedVehicle.model}
                  </span>
                </button>
              )}
            </div>

            {/* Post Caption & Location */}
            <div className="px-5 py-2 space-y-2">
              <p className="text-sm sm:text-base text-stone-800 dark:text-stone-200 leading-relaxed">
                {lang === 'ar' && post.contentAr ? post.contentAr : post.content}
              </p>

              {/* Hashtags */}
              <div className="flex flex-wrap gap-1.5">
                {post.hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {post.location && (
                <div className="flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>{post.location}</span>
                </div>
              )}
            </div>

            {/* Post Media */}
            {post.image && (
              <div className="relative mt-2 aspect-video w-full bg-stone-950 overflow-hidden">
                <img
                  src={post.image}
                  alt="Post automotive"
                  className="w-full h-full object-cover"
                />
                {/* Auto-blur privacy notice overlay badge */}
                <div className="absolute bottom-3 end-3 px-2 py-1 rounded-md bg-stone-900/80 backdrop-blur text-[10px] text-stone-300 font-mono flex items-center gap-1 border border-stone-700">
                  <span className="font-bold text-amber-400">[AI]</span>
                  <span>Plate & Face Privacy Protected (AI-NN-03)</span>
                </div>
              </div>
            )}

            {/* Post Actions: Like, Comment, Share, Save */}
            <div className="px-5 py-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-stone-600 dark:text-stone-400">
              <div className="flex items-center gap-4 sm:gap-6">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                    post.isLiked
                      ? 'text-red-500'
                      : 'hover:text-red-500 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${post.isLiked ? 'fill-red-500 stroke-red-500' : ''}`}
                  />
                  <span>{post.likesCount}</span>
                </button>

                <button
                  onClick={() =>
                    setOpenComments((prev) => ({
                      ...prev,
                      [post.id]: !prev[post.id],
                    }))
                  }
                  className="flex items-center gap-1.5 text-sm font-semibold hover:text-amber-500 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{post.commentsCount}</span>
                </button>

                <button
                  onClick={() => alert('Link copied to clipboard for WhatsApp & car club group!')}
                  className="flex items-center gap-1.5 text-sm font-semibold hover:text-amber-500 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="hidden sm:inline">{post.sharesCount}</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onFlagContent(post, 'User reported suspicious street racing')}
                  className="text-stone-400 hover:text-amber-500 p-1"
                  title="Report to Moderator"
                >
                  <ShieldAlert className="w-4 h-4" />
                </button>

                <button
                  onClick={() => toggleSave(post.id)}
                  className={`p-1 transition-colors ${
                    post.isSaved ? 'text-amber-500' : 'text-stone-400 hover:text-stone-600'
                  }`}
                  title={t.feed.save}
                >
                  <Bookmark
                    className={`w-5 h-5 ${post.isSaved ? 'fill-amber-500' : ''}`}
                  />
                </button>
              </div>
            </div>

            {/* Comments Drawer */}
            {openComments[post.id] && (
              <div className="px-5 py-4 bg-stone-50/70 dark:bg-stone-900/60 border-t border-stone-100 dark:border-stone-800 space-y-3">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-3 text-xs">
                    <img
                      src={comment.authorAvatar}
                      alt={comment.authorName}
                      className="w-7 h-7 rounded-full object-cover shrink-0"
                    />
                    <div className="flex-1 bg-white dark:bg-stone-800 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700/60">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-stone-900 dark:text-white">
                          {comment.authorName}
                        </span>
                        <span className="text-[10px] text-stone-400">
                          {comment.createdAt}
                        </span>
                      </div>
                      <p className="text-stone-700 dark:text-stone-300">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Add Comment Input */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={commentInputs[post.id] || ''}
                    onChange={(e) =>
                      setCommentInputs((prev) => ({
                        ...prev,
                        [post.id]: e.target.value,
                      }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddComment(post.id);
                    }}
                    placeholder={t.feed.writeCommentPlaceholder}
                    className="flex-1 px-4 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                  <button
                    onClick={() => handleAddComment(post.id)}
                    className="p-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white transition-colors"
                  >
                    <Send className="w-3.5 h-3.5 rtl:rotate-180" />
                  </button>
                </div>
              </div>
            )}
          </article>
        ))}
      </div>

      {/* Story Viewer Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <div className="relative w-full max-w-sm h-[600px] rounded-3xl overflow-hidden bg-stone-950 flex flex-col justify-between p-4 shadow-2xl">
            {/* Story Progress Bar */}
            <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden mb-3">
              <div className="w-2/3 h-full bg-amber-500" />
            </div>

            {/* Story Header */}
            <div className="flex items-center justify-between text-white z-10">
              <div className="flex items-center gap-2">
                <img
                  src={activeStory.authorAvatar}
                  alt={activeStory.authorName}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-amber-500"
                />
                <div>
                  <p className="text-xs font-bold leading-none">{activeStory.authorName}</p>
                  <p className="text-[10px] text-amber-400 font-mono mt-0.5">{activeStory.carTag}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveStory(null)}
                className="w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Story Background Image */}
            <img
              src={activeStory.mediaUrl}
              alt="Story media"
              className="absolute inset-0 w-full h-full object-cover -z-0"
            />

            {/* Story Caption */}
            <div className="relative z-10 p-4 rounded-2xl bg-black/60 backdrop-blur-md text-white border border-white/10 space-y-1">
              <p className="text-sm font-semibold">{activeStory.caption}</p>
              <div className="flex items-center justify-between text-[10px] text-stone-400">
                <span>{activeStory.createdAt}</span>
                <span className="font-mono text-amber-400">Expires in {activeStory.expiresInHours}h</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Post Modal with AI Moderation & Auto-Blur (FR-FEED-01 / AI-NN-03 / AI-NLP-02) */}
      {createPostOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <h3 className="font-extrabold text-base text-stone-900 dark:text-white">
                {t.feed.createPost}
              </h3>
              <button
                onClick={() => {
                  setCreatePostOpen(false);
                  setAiModerationStatus(null);
                }}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <textarea
                  rows={4}
                  required
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  placeholder="What's happening in your garage or track session? Mention mods, lap times or spot reviews..."
                  className="w-full p-3.5 rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>

              {/* Tag Vehicle from Garage */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-500 dark:text-stone-400 mb-1">
                    {t.feed.taggedVehicle}
                  </label>
                  <select
                    value={selectedVehicleId}
                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                  >
                    {userVehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.year} {v.make} {v.model} ({formatPlateNumber(v.plateNumber, v.regionCode, 'masked')})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-500 dark:text-stone-400 mb-1">
                    Location / Circuit
                  </label>
                  <input
                    type="text"
                    value={newPostLocation}
                    onChange={(e) => setNewPostLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                  />
                </div>
              </div>

              {/* AI Privacy & Moderation Controls (Rule BR-3 / AI-NN-03) */}
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-800 dark:text-stone-200">
                  <input
                    type="checkbox"
                    checked={autoBlurChecked}
                    onChange={(e) => setAutoBlurChecked(e.target.checked)}
                    className="rounded text-amber-500"
                  />
                  <span className="flex items-center gap-1">
                    <span className="font-bold text-amber-500">[AI]</span>
                    <span>{t.feed.autoBlurSensitiveMedia}</span>
                  </span>
                </label>

                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  {t.feed.aiModerationCheck}
                </p>
              </div>

              {aiModerationStatus && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{aiModerationStatus}</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreatePostOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20"
                >
                  {t.feed.postButton}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
