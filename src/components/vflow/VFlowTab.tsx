import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Flame,
  Radio,
  Send,
  Image as ImageIcon,
  Tv,
  BarChart2,
  Smile,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Coins,
  Sparkles,
  CheckCircle2,
  Search,
  MoreHorizontal,
  X,
  Plus,
  Play,
  TrendingUp,
  UserCheck,
  UserPlus,
  Compass,
  Tag,
  Clock,
  Trash2,
  ExternalLink,
  Volume2,
  Users,
  Filter,
  ArrowRight
} from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { useOrbs } from '../../hooks/useOrbs';
import { playPopSound, playWinSound } from '../../utils/sound';
import { CHANNELS_DATA } from '../../data/channels';
import { Channel } from '../../types';
import {
  generateAllFriendsPosts,
  generateFriendsStories,
  getPostsByUserId,
  getPostsByAuthor
} from '../../data/vflowFriendsPosts';
import { MOCK_100_FRIENDS, CURRENT_USER, VplayUser } from '../../data/mockFriendsData';

export interface VFlowPost {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  authorBadge?: string;
  authorUserId?: string;
  authorTag?: string;
  isVerified?: boolean;
  timestamp: string;
  createdAt: number;
  content: string;
  hashtags?: string[];
  imageUrl?: string;
  feeling?: string;
  channelAttachment?: {
    id: string;
    name: string;
    slug: string;
    category?: string;
  };
  poll?: {
    question: string;
    options: { id: string; text: string; votes: number }[];
    totalVotes: number;
    userVotedOptionId?: string;
  };
  likes: number;
  isLiked?: boolean;
  shares: number;
  isShared?: boolean;
  isSaved?: boolean;
  tippedOrbs: number;
  comments: {
    id: string;
    authorName: string;
    authorAvatar: string;
    text: string;
    time: string;
  }[];
  isUserCreated?: boolean;
}

export interface VFlowStory {
  id: string;
  authorName: string;
  authorAvatar: string;
  isVerified?: boolean;
  hasUnread: boolean;
  storyImage: string;
  caption: string;
  time: string;
}

const INITIAL_STORIES: VFlowStory[] = [
  {
    id: 's-vtv',
    authorName: 'VTV Digital',
    authorAvatar: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=120&auto=format&fit=crop&q=80',
    isVerified: true,
    hasUnread: true,
    storyImage: 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=800&auto=format&fit=crop&q=80',
    caption: 'Tiêu điểm Thời sự 19h: Đột phá công nghệ số truyền hình Việt Nam 2026',
    time: '20 phút trước'
  },
  {
    id: 's-vplay',
    authorName: 'VNRT Online Studio',
    authorAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    isVerified: true,
    hasUnread: true,
    storyImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    caption: 'Chính thức ra mắt mạng xã hội V-Flow kết nối cộng đồng VNRT Online!',
    time: '45 phút trước'
  },
  {
    id: 's-gamer',
    authorName: 'Cris Gamer',
    authorAvatar: 'https://mc-heads.net/avatar/Steve/64',
    isVerified: true,
    hasUnread: true,
    storyImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    caption: 'Chiến dịch khám phá Deep Dark & Warden Minecraft 1.19 vừa lên sóng!',
    time: '1 giờ trước'
  },
  {
    id: 's-mixi',
    authorName: 'Độ Phùng',
    authorAvatar: 'https://mc-heads.net/avatar/Alex/64',
    isVerified: true,
    hasUnread: false,
    storyImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
    caption: 'Chào anh em, hôm nay V-Arcade có ai dám solo Caro XO với tôi không?',
    time: '2 giờ trước'
  },
  {
    id: 's-khanhvy',
    authorName: 'Khánh Vy',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    isVerified: true,
    hasUnread: false,
    storyImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80',
    caption: 'Hoàn thành 4 chu kỳ Pomodoro trên V-Study, cực kỳ tập trung luôn!',
    time: '3 giờ trước'
  }
];

const INITIAL_POSTS: VFlowPost[] = [
  {
    id: 'post-1',
    authorName: 'VTV Truyền Hình Số',
    authorHandle: 'vtvdigital_official',
    authorAvatar: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=120&auto=format&fit=crop&q=80',
    authorBadge: 'Đài Truyền Hình',
    isVerified: true,
    timestamp: '15 phút trước',
    createdAt: Date.now() - 15 * 60 * 1000,
    content: '🔥 Trực tiếp VIETNAM TODAY & Tiêu điểm công nghệ số quốc gia. Toàn cảnh sự chuyển mình mạnh mẽ của truyền thông số và nền tảng xem truyền hình thế hệ mới trên VNRT Online.',
    hashtags: ['#VTV1', '#VietnamToday', '#ChuyenDoiSo', '#VNRT Online'],
    imageUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1000&auto=format&fit=crop&q=80',
    feeling: 'đang phát trực tiếp 📺',
    channelAttachment: {
      id: 'vtv1',
      name: 'VTV1 HD - Thời sự & Tin tức',
      slug: 'vtv1',
      category: 'Thời sự'
    },
    likes: 342,
    shares: 48,
    tippedOrbs: 250,
    comments: [
      {
        id: 'c-1',
        authorName: 'Nguyễn Văn Minh',
        authorAvatar: 'https://mc-heads.net/avatar/Steve/64',
        text: 'Chất lượng hình ảnh 1080p sắc nét, âm thanh rất chuẩn!',
        time: '10 phút trước'
      },
      {
        id: 'c-2',
        authorName: 'Thu Hà',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        text: 'Theo dõi thời sự trên VNRT Online tiện lợi thật sự.',
        time: '5 phút trước'
      }
    ]
  },
  {
    id: 'post-2',
    authorName: 'VNRT Online Studio & Community',
    authorHandle: 'vnrt_community',
    authorAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    authorBadge: 'Nhà Phát Triển',
    isVerified: true,
    timestamp: '42 phút trước',
    createdAt: Date.now() - 42 * 60 * 1000,
    content: '🎉 Chào mừng toàn bộ cư dân đến với V-Flow — Mạng xã hội chuyên biệt cho fan truyền hình, game thủ V-Arcade và người dùng VNRT Online! Mời cả nhà bình chọn tính năng bạn đang hào hứng trải nghiệm nhất:',
    hashtags: ['#VFlow', '#NewFeature', '#VNRT Online', '#Community'],
    poll: {
      question: 'Bạn thích trải nghiệm nào nhất trong bản cập nhật hôm nay?',
      options: [
        { id: 'opt-1', text: 'Mạng xã hội V-Flow & Thảo luận', votes: 184 },
        { id: 'opt-2', text: 'Minecraft Container GUI (Rương 1.19)', votes: 142 },
        { id: 'opt-3', text: 'Tab Search tối giản & tập trung', votes: 98 },
        { id: 'opt-4', text: 'Sàn cược Orbs & Minigame', votes: 76 }
      ],
      totalVotes: 500
    },
    likes: 512,
    shares: 89,
    tippedOrbs: 450,
    comments: [
      {
        id: 'c-3',
        authorName: 'Trần Long',
        authorAvatar: 'https://mc-heads.net/avatar/Alex/64',
        text: 'Giao diện mượt mà và hiện đại quá admin ơi! Tặng 50 Orbs ủng hộ nhé!',
        time: '30 phút trước'
      }
    ]
  },
  {
    id: 'post-3',
    authorName: 'Hoàng Bách (Minecrafter VN)',
    authorHandle: 'bach_minecraft',
    authorAvatar: 'https://mc-heads.net/avatar/Notch/64',
    authorBadge: 'Chiến Thần Sandbox',
    isVerified: false,
    timestamp: '1 giờ trước',
    createdAt: Date.now() - 60 * 60 * 1000,
    content: 'Vừa test bộ rương Minecraft The Wild Update 1.19 xong, từ Sculk Shrieker, La bàn hồi sinh, bùn nén đến thuyền có rương đều hoạt động chuẩn xác! Có ai biết cách chế tạo Swift Sneak III không nhỉ?',
    hashtags: ['#Minecraft', '#TheWildUpdate', '#DeepDark', '#Sculk'],
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1000&auto=format&fit=crop&q=80',
    feeling: 'cảm thấy hào hứng 🎮',
    likes: 188,
    shares: 24,
    tippedOrbs: 120,
    comments: [
      {
        id: 'c-4',
        authorName: 'Vũ Nam',
        authorAvatar: 'https://mc-heads.net/avatar/Grumm/64',
        text: 'Swift Sneak chỉ tìm thấy trong rương Ancient City thôi bạn ơi!',
        time: '45 phút trước'
      }
    ]
  },
  {
    id: 'post-4',
    authorName: 'VTV3 Giải Trí & Show',
    authorHandle: 'vtv3_giaitri',
    authorAvatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=120&auto=format&fit=crop&q=80',
    authorBadge: 'Showbiz & Nhạc',
    isVerified: true,
    timestamp: '2 giờ trước',
    createdAt: Date.now() - 120 * 60 * 1000,
    content: 'Cuối tuần này cùng đón xem chương trình âm nhạc và gameshow đặc biệt quy tụ dàn nghệ sĩ được yêu thích nhất. Bật VTV3 HD trên VNRT Online để theo dõi trực tiếp với âm thanh sống động!',
    hashtags: ['#VTV3', '#GiaiTriCuoiTuan', '#LiveShow', '#AmNhac'],
    channelAttachment: {
      id: 'vtv3',
      name: 'VTV3 HD - Giải trí & Thể thao',
      slug: 'vtv3',
      category: 'Giải trí'
    },
    likes: 276,
    shares: 37,
    tippedOrbs: 80,
    comments: []
  }
];

const TRENDING_HASHTAGS = [
  { tag: '#VFlow', count: '12.4K bài' },
  { tag: '#VTV1Thoisu', count: '8.9K bài' },
  { tag: '#Minecraft119', count: '6.2K bài' },
  { tag: '#OrbsArena', count: '5.1K bài' },
  { tag: '#SaoNhapNgu2026', count: '4.3K bài' },
  { tag: '#KhamPhaVietNam', count: '3.8K bài' }
];

const SUGGESTED_CREATORS = [
  {
    name: 'VTV News Official',
    handle: '@vtv_news',
    avatar: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=120&auto=format&fit=crop&q=80',
    badge: 'Tin Tức 24/7',
    isVerified: true,
    followers: '1.2M'
  },
  {
    name: 'V-Arcade Gaming Hub',
    handle: '@varcade_hub',
    avatar: 'https://mc-heads.net/avatar/Steve/64',
    badge: 'Cộng Đồng Game',
    isVerified: true,
    followers: '450K'
  },
  {
    name: 'Vietnam Discovery 360',
    handle: '@vietnam_360',
    avatar: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=120&auto=format&fit=crop&q=80',
    badge: 'Du Lịch & Văn Hóa',
    isVerified: false,
    followers: '280K'
  }
];

const PRESET_IMAGE_OPTIONS = [
  { label: 'Studio VNRT Online', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80' },
  { label: 'Tin tức & Thời sự', url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1000&auto=format&fit=crop&q=80' },
  { label: 'Gaming & Minecraft', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1000&auto=format&fit=crop&q=80' },
  { label: 'Việt Nam Đẹp', url: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=1000&auto=format&fit=crop&q=80' },
  { label: 'Âm nhạc & Show', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1000&auto=format&fit=crop&q=80' }
];

interface VFlowTabProps {
  navigate: (route: string, state?: any) => void;
  onSelectChannel?: (channel: Channel) => void;
  routeState?: any;
}

export const VFlowTab: React.FC<VFlowTabProps> = ({
  navigate,
  onSelectChannel,
  routeState
}) => {
  const { settings } = useSettings();
  const { orbs, spendOrbs, addOrbs } = useOrbs();

  // Local storage key for persistent posts
  const LOCAL_STORAGE_KEY = 'vplay_vflow_posts_v2_all_friends';

  // State: Posts - initialized with official posts + all 100 friends' posts
  const [posts, setPosts] = useState<VFlowPost[]>(() => {
    const friendPosts = generateAllFriendsPosts();
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 80) return parsed;
      }
    } catch {}
    return [...INITIAL_POSTS, ...friendPosts];
  });

  // Save posts to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(posts));
    } catch {}
  }, [posts]);

  // Feed Filter Tab
  const [activeTab, setActiveTab] = useState<'for_you' | 'friends' | 'trending' | 'tv' | 'following' | 'saved'>('for_you');
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Selected friend filter (e.g. when navigated from Friends & People or clicking an author)
  const [friendFilter, setFriendFilter] = useState<VplayUser | null>(() => {
    return routeState?.authorUser || routeState?.filterUser || null;
  });

  // React to incoming routeState navigation changes
  useEffect(() => {
    if (routeState?.authorUser || routeState?.filterUser) {
      setFriendFilter(routeState?.authorUser || routeState?.filterUser);
      setActiveTab('friends');
    }
  }, [routeState]);

  // Stories generated from online & joinable friends in MOCK_100_FRIENDS
  const [stories, setStories] = useState<VFlowStory[]>(() => {
    return generateFriendsStories();
  });

  // Post Creator State
  const [composerText, setComposerText] = useState('');
  const [selectedFeeling, setSelectedFeeling] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [showImagePicker, setShowImagePicker] = useState<boolean>(false);
  const [customImageUrl, setCustomImageUrl] = useState<string>('');
  const [selectedChannelSlug, setSelectedChannelSlug] = useState<string>('');
  const [showChannelPicker, setShowChannelPicker] = useState<boolean>(false);
  const [showPollCreator, setShowPollCreator] = useState<boolean>(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [composerOpen, setComposerOpen] = useState(false);

  // Active Story Viewer Modal
  const [activeStory, setActiveStory] = useState<VFlowStory | null>(null);

  // Tip Orbs Modal
  const [tipTargetPost, setTipTargetPost] = useState<VFlowPost | null>(null);
  const [tipAmount, setTipAmount] = useState<number>(50);
  const [tipToast, setTipToast] = useState<string | null>(null);

  // Comment input state per post
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

  // Followed creators map
  const [followedCreators, setFollowedCreators] = useState<Record<string, boolean>>({});

  const toggleFollow = (handle: string) => {
    playPopSound();
    setFollowedCreators((prev) => ({
      ...prev,
      [handle]: !prev[handle]
    }));
  };

  // Trigger Toast
  const triggerToast = (msg: string) => {
    setTipToast(msg);
    setTimeout(() => setTipToast(null), 3000);
  };

  // Submit new post
  const handlePublishPost = () => {
    if (!composerText.trim() && !selectedImage && !selectedChannelSlug && !pollQuestion) {
      return;
    }

    playPopSound();

    let channelAttachment: VFlowPost['channelAttachment'] | undefined = undefined;
    if (selectedChannelSlug) {
      const found = CHANNELS_DATA.find((c) => c.slug === selectedChannelSlug);
      if (found) {
        channelAttachment = {
          id: found.id,
          name: found.name,
          slug: found.slug,
          category: found.category
        };
      }
    }

    let pollData: VFlowPost['poll'] | undefined = undefined;
    if (showPollCreator && pollQuestion.trim()) {
      const validOptions = pollOptions.filter((o) => o.trim().length > 0);
      if (validOptions.length >= 2) {
        pollData = {
          question: pollQuestion.trim(),
          options: validOptions.map((text, idx) => ({
            id: `opt-${idx + 1}`,
            text: text.trim(),
            votes: 0
          })),
          totalVotes: 0
        };
      }
    }

    // Extract hashtags
    const hashtagsFound = (composerText.match(/#[a-zA-Z0-9_À-ỹ]+/g) || []) as string[];

    const newPost: VFlowPost = {
      id: `post-user-${Date.now()}`,
      authorName: settings.userName || 'User',
      authorHandle: (settings.userName || 'user').toLowerCase().replace(/\s+/g, '_'),
      authorAvatar: 'https://mc-heads.net/avatar/Steve/64',
      authorBadge: 'Cư Dân VNRT Online',
      isVerified: false,
      timestamp: 'Vừa xong',
      createdAt: Date.now(),
      content: composerText.trim(),
      hashtags: hashtagsFound.length > 0 ? hashtagsFound : undefined,
      imageUrl: selectedImage || undefined,
      feeling: selectedFeeling || undefined,
      channelAttachment,
      poll: pollData,
      likes: 0,
      shares: 0,
      tippedOrbs: 0,
      comments: [],
      isUserCreated: true
    };

    setPosts((prev) => [newPost, ...prev]);

    // Reset composer
    setComposerText('');
    setSelectedFeeling('');
    setSelectedImage('');
    setCustomImageUrl('');
    setShowImagePicker(false);
    setSelectedChannelSlug('');
    setShowChannelPicker(false);
    setShowPollCreator(false);
    setPollQuestion('');
    setPollOptions(['', '']);
    setComposerOpen(false);

    triggerToast('Đã đăng bài viết lên dòng chảy V-Flow! 🎉');
  };

  // Handle Like
  const handleToggleLike = (postId: string) => {
    playPopSound();
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const wasLiked = p.isLiked;
          return {
            ...p,
            isLiked: !wasLiked,
            likes: wasLiked ? Math.max(0, p.likes - 1) : p.likes + 1
          };
        }
        return p;
      })
    );
  };

  // Handle Save / Bookmark
  const handleToggleSave = (postId: string) => {
    playPopSound();
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isSaved = !p.isSaved;
          triggerToast(isSaved ? 'Đã lưu bài viết vào mục Đã lưu 🔖' : 'Đã bỏ lưu bài viết');
          return { ...p, isSaved };
        }
        return p;
      })
    );
  };

  // Handle Share
  const handleShare = (post: VFlowPost) => {
    playPopSound();
    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, shares: p.shares + 1, isShared: true } : p))
    );
    navigator.clipboard?.writeText(window.location.href);
    triggerToast('Đã sao chép liên kết bài viết vào bộ nhớ tạm! 🔗');
  };

  // Handle Vote in Poll
  const handleVotePoll = (postId: string, optionId: string) => {
    playPopSound();
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId && p.poll && !p.poll.userVotedOptionId) {
          const updatedOptions = p.poll.options.map((opt) => {
            if (opt.id === optionId) {
              return { ...opt, votes: opt.votes + 1 };
            }
            return opt;
          });
          return {
            ...p,
            poll: {
              ...p.poll,
              options: updatedOptions,
              totalVotes: p.poll.totalVotes + 1,
              userVotedOptionId: optionId
            }
          };
        }
        return p;
      })
    );
  };

  // Handle Add Comment
  const handleAddComment = (postId: string) => {
    const text = (commentInputs[postId] || '').trim();
    if (!text) return;

    playPopSound();
    const newComment = {
      id: `comm-${Date.now()}`,
      authorName: settings.userName || 'User',
      authorAvatar: 'https://mc-heads.net/avatar/Steve/64',
      text,
      time: 'Vừa xong'
    };

    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p))
    );

    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  // Handle Tip Orbs
  const handleExecuteTip = () => {
    if (!tipTargetPost) return;
    if (orbs < tipAmount) {
      triggerToast('Bạn không đủ số dư Orbs để tặng!');
      return;
    }

    const success = spendOrbs(tipAmount);
    if (!success) {
      triggerToast('Giao dịch Orbs thất bại!');
      return;
    }

    playWinSound();
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === tipTargetPost.id) {
          return { ...p, tippedOrbs: p.tippedOrbs + tipAmount };
        }
        return p;
      })
    );

    triggerToast(`Đã tặng thành công +${tipAmount} Orbs cho ${tipTargetPost.authorName}! ✨`);
    setTipTargetPost(null);
  };

  // Delete User's Own Post
  const handleDeletePost = (postId: string) => {
    playPopSound();
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    triggerToast('Đã xóa bài viết thành công');
  };

  // Play Attached Channel
  const handlePlayAttachedChannel = (slug: string) => {
    const channel = CHANNELS_DATA.find((c) => c.slug === slug);
    if (channel) {
      if (onSelectChannel) onSelectChannel(channel);
      navigate(`/live-tv?channel=${slug}`);
    }
  };

  // Filtered Posts
  const filteredPosts = useMemo(() => {
    let list = [...posts];

    // Priority filter by specific friend (e.g. from Friends & People or clicking an author)
    if (friendFilter) {
      return list.filter(
        (p) =>
          p.authorUserId === friendFilter.id ||
          (p.authorTag && p.authorTag.toLowerCase() === friendFilter.tag.toLowerCase()) ||
          p.authorName.toLowerCase() === friendFilter.name.toLowerCase()
      );
    }

    // Search filter
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.content.toLowerCase().includes(q) ||
          p.authorName.toLowerCase().includes(q) ||
          p.authorHandle.toLowerCase().includes(q) ||
          (p.authorTag && p.authorTag.toLowerCase().includes(q)) ||
          (p.hashtags && p.hashtags.some((h) => h.toLowerCase().includes(q))) ||
          (p.feeling && p.feeling.toLowerCase().includes(q)) ||
          (p.channelAttachment && p.channelAttachment.name.toLowerCase().includes(q))
      );
    }

    // Tabs
    if (activeTab === 'friends') {
      // Show posts authored by all 100 friends in Friends & People + current user
      list = list.filter((p) => !!p.authorUserId || p.isUserCreated);
    } else if (activeTab === 'trending') {
      list.sort((a, b) => b.likes + b.shares * 2 - (a.likes + a.shares * 2));
    } else if (activeTab === 'tv') {
      list = list.filter((p) => !!p.channelAttachment);
    } else if (activeTab === 'following') {
      list = list.filter((p) => followedCreators[p.authorHandle] || p.isUserCreated || followedCreators[p.authorName]);
    } else if (activeTab === 'saved') {
      list = list.filter((p) => p.isSaved);
    }

    return list;
  }, [posts, activeTab, searchFilter, followedCreators, friendFilter]);

  return (
    <div className="w-full min-h-screen text-white select-none pb-24">
      {/* Toast Alert */}
      <AnimatePresence>
        {tipToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-[#1E1D24]/95 border border-purple-500/40 text-purple-200 text-xs sm:text-sm font-semibold shadow-2xl backdrop-blur-md flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
            <span>{tipToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-3 sm:px-6 pt-4 sm:pt-6">
        {/* TOP HEADER: BRANDING & LIVE STATS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#2D2D38]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E6005A] to-rose-400 flex items-center justify-center shadow-lg shadow-rose-500/25">
              <Radio className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  V-Flow
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-[#E6005A]/20 text-[#FF4D8B] border border-[#E6005A]/30">
                    MẠNG XÃ HỘI
                  </span>
                </h1>
              </div>
              <p className="text-xs text-[#9CA3AF] mt-0.5">
                Dòng chảy tin tức, khoảnh khắc & thảo luận truyền hình VNRT Online
              </p>
            </div>
          </div>

          {/* Quick Stats & Orbs Balance */}
          <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1F1E24] border border-[#343440] text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[#A1A1AA]">
                <strong className="text-white font-mono">124.8K</strong> đang online
              </span>
            </div>
            <button
              onClick={() => navigate('/v-premium')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-950/50 hover:bg-purple-900/50 border border-purple-500/30 text-purple-200 text-xs font-mono font-bold transition-all cursor-pointer"
              title="Ví Orbs của bạn"
            >
              <Coins className="w-3.5 h-3.5 text-amber-300" />
              <span>{orbs.toLocaleString()}</span>
              <span className="text-[10px] text-purple-400">ORBS</span>
            </button>
          </div>
        </div>

        {/* 1. STORIES / KHOẢNH KHẮC CAROUSEL */}
        <div className="py-4 overflow-x-auto no-scrollbar flex items-center gap-3.5 border-b border-[#2D2D38]">
          {/* Add user story button */}
          <div
            onClick={() => setComposerOpen(true)}
            className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
          >
            <div className="relative w-15 h-15 rounded-full p-0.5 bg-[#2A2A33] border-2 border-dashed border-[#52525E] group-hover:border-[#E6005A] transition-colors flex items-center justify-center">
              <img
                src={CURRENT_USER.avatar}
                alt="Your Avatar"
                className="w-full h-full rounded-full object-cover [image-rendering:pixelated]"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#E6005A] text-white flex items-center justify-center shadow-md">
                <Plus className="w-3.5 h-3.5" />
              </div>
            </div>
            <span className="text-[11px] font-medium text-zinc-300 truncate max-w-[70px]">
              Tạo tin mới
            </span>
          </div>

          {/* Creators & Friends Stories */}
          {stories.map((story) => (
            <div
              key={story.id}
              onClick={() => setActiveStory(story)}
              className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
            >
              <div
                className={`relative w-15 h-15 rounded-full p-0.5 transition-transform group-hover:scale-105 ${
                  story.hasUnread
                    ? 'bg-gradient-to-tr from-[#E6005A] via-rose-500 to-amber-400'
                    : 'bg-[#3F3F48]'
                }`}
              >
                <img
                  src={story.authorAvatar}
                  alt={story.authorName}
                  className="w-full h-full rounded-full object-cover border-2 border-[#18181C]"
                />
              </div>
              <span className="text-[11px] font-medium text-zinc-300 truncate max-w-[72px] text-center">
                {story.authorName}
              </span>
            </div>
          ))}
        </div>

        {/* 2. MAIN FEED LAYOUT (2 COLUMNS ON DESKTOP) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-5">
          {/* LEFT/CENTER: FEED STREAM (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            {/* POST COMPOSER BOX */}
            <div className="p-4 rounded-2xl bg-[#1F1E24] border border-[#2D2D38] shadow-lg">
              <div className="flex items-start gap-3">
                <img
                  src={CURRENT_USER.avatar}
                  alt={CURRENT_USER.name}
                  className="w-10 h-10 rounded-full object-cover border border-purple-400/50 shrink-0 [image-rendering:pixelated]"
                />
                <div className="flex-1 min-w-0">
                  <textarea
                    value={composerText}
                    onChange={(e) => setComposerText(e.target.value)}
                    onFocus={() => setComposerOpen(true)}
                    placeholder="Bạn đang nghĩ gì? Chia sẻ video, kênh TV hoặc khoảnh khắc lên V-Flow..."
                    rows={composerOpen ? 3 : 2}
                    className="w-full bg-transparent text-sm text-white placeholder-[#71717A] resize-none focus:outline-none leading-relaxed"
                  />

                  {/* Attached Media Previews */}
                  {selectedImage && (
                    <div className="relative mt-2 rounded-xl overflow-hidden max-h-48 border border-[#3E3E48] group">
                      <img src={selectedImage} alt="Attached" className="w-full h-48 object-cover" />
                      <button
                        onClick={() => setSelectedImage('')}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-rose-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {selectedChannelSlug && (
                    <div className="mt-2 p-2.5 rounded-xl bg-[#2A2932] border border-cyan-500/30 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <Tv className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span className="font-semibold text-white truncate">
                          Đính kèm kênh:{' '}
                          {CHANNELS_DATA.find((c) => c.slug === selectedChannelSlug)?.name || selectedChannelSlug}
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedChannelSlug('')}
                        className="text-zinc-400 hover:text-rose-400 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Poll Creator Box */}
                  {showPollCreator && (
                    <div className="mt-2.5 p-3 rounded-xl bg-[#24232C] border border-purple-500/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                          <BarChart2 className="w-3.5 h-3.5 text-purple-400" />
                          Tạo cuộc bình chọn
                        </span>
                        <button
                          onClick={() => setShowPollCreator(false)}
                          className="text-zinc-400 hover:text-rose-400 p-0.5"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={pollQuestion}
                        onChange={(e) => setPollQuestion(e.target.value)}
                        placeholder="Câu hỏi bình chọn..."
                        className="w-full px-3 py-1.5 rounded-lg bg-[#18181E] border border-[#3E3E48] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-400"
                      />
                      {pollOptions.map((opt, idx) => (
                        <input
                          key={idx}
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const updated = [...pollOptions];
                            updated[idx] = e.target.value;
                            setPollOptions(updated);
                          }}
                          placeholder={`Lựa chọn ${idx + 1}`}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#18181E] border border-[#3E3E48] text-xs text-white placeholder-zinc-500 focus:outline-none"
                        />
                      ))}
                    </div>
                  )}

                  {/* Feeling badge preview */}
                  {selectedFeeling && (
                    <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs border border-amber-500/30">
                      <span>{selectedFeeling}</span>
                      <button onClick={() => setSelectedFeeling('')} className="hover:text-white ml-1">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {/* Attachment Actions Toolbar */}
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#2D2D38]">
                    <div className="flex items-center gap-1">
                      {/* Image Picker Button */}
                      <button
                        onClick={() => setShowImagePicker(!showImagePicker)}
                        className="p-2 rounded-xl text-zinc-400 hover:text-emerald-400 hover:bg-white/5 transition-colors cursor-pointer"
                        title="Đính kèm hình ảnh"
                      >
                        <ImageIcon className="w-4.5 h-4.5" />
                      </button>

                      {/* TV Channel Attach Button */}
                      <button
                        onClick={() => setShowChannelPicker(!showChannelPicker)}
                        className="p-2 rounded-xl text-zinc-400 hover:text-cyan-400 hover:bg-white/5 transition-colors cursor-pointer"
                        title="Đính kèm kênh truyền hình VNRT Online"
                      >
                        <Tv className="w-4.5 h-4.5" />
                      </button>

                      {/* Poll Button */}
                      <button
                        onClick={() => setShowPollCreator(!showPollCreator)}
                        className="p-2 rounded-xl text-zinc-400 hover:text-purple-400 hover:bg-white/5 transition-colors cursor-pointer"
                        title="Tạo cuộc bình chọn"
                      >
                        <BarChart2 className="w-4.5 h-4.5" />
                      </button>

                      {/* Feeling Button */}
                      <button
                        onClick={() => {
                          const feelings = [
                            'đang xem Live TV 📺',
                            'cảm thấy hào hứng 🚀',
                            'đang săn Orbs 💎',
                            'cực kỳ thư giãn ☕',
                            'đang xem thời sự 📰'
                          ];
                          const random = feelings[Math.floor(Math.random() * feelings.length)];
                          setSelectedFeeling(random);
                        }}
                        className="p-2 rounded-xl text-zinc-400 hover:text-amber-400 hover:bg-white/5 transition-colors cursor-pointer"
                        title="Thêm cảm xúc / hoạt động"
                      >
                        <Smile className="w-4.5 h-4.5" />
                      </button>
                    </div>

                    <button
                      onClick={handlePublishPost}
                      disabled={!composerText.trim() && !selectedImage && !selectedChannelSlug && !pollQuestion}
                      className="px-4 py-2 rounded-xl bg-[#E6005A] hover:bg-[#FF1A75] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow-md shadow-[#E6005A]/20 cursor-pointer flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Đăng bài</span>
                    </button>
                  </div>

                  {/* Image Picker Dropdown */}
                  {showImagePicker && (
                    <div className="mt-3 p-3 rounded-xl bg-[#25242C] border border-[#3E3E4A] space-y-2">
                      <span className="text-xs font-bold text-zinc-300">Chọn ảnh mẫu hoặc nhập URL:</span>
                      <div className="grid grid-cols-5 gap-2">
                        {PRESET_IMAGE_OPTIONS.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setSelectedImage(item.url);
                              setShowImagePicker(false);
                            }}
                            className="text-[11px] p-1.5 rounded-lg bg-[#18181E] hover:bg-[#E6005A]/20 border border-[#3E3E48] text-zinc-300 truncate"
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          value={customImageUrl}
                          onChange={(e) => setCustomImageUrl(e.target.value)}
                          placeholder="Dán liên kết ảnh (https://...)"
                          className="flex-1 px-3 py-1.5 rounded-lg bg-[#18181E] border border-[#3E3E48] text-xs text-white placeholder-zinc-500 focus:outline-none"
                        />
                        <button
                          onClick={() => {
                            if (customImageUrl.trim()) {
                              setSelectedImage(customImageUrl.trim());
                              setCustomImageUrl('');
                              setShowImagePicker(false);
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                        >
                          Dùng ảnh
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Channel Picker Dropdown */}
                  {showChannelPicker && (
                    <div className="mt-3 p-3 rounded-xl bg-[#25242C] border border-[#3E3E4A] space-y-2 max-h-48 overflow-y-auto no-scrollbar">
                      <span className="text-xs font-bold text-zinc-300">Chọn kênh truyền hình gắn kèm:</span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                        {CHANNELS_DATA.slice(0, 12).map((ch) => (
                          <button
                            key={ch.id}
                            onClick={() => {
                              setSelectedChannelSlug(ch.slug);
                              setShowChannelPicker(false);
                            }}
                            className="flex items-center gap-2 p-2 rounded-lg bg-[#18181E] hover:bg-cyan-950/60 border border-[#3E3E48] text-left text-xs text-zinc-200 truncate cursor-pointer"
                          >
                            <Tv className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span className="truncate">{ch.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ACTIVE FRIEND FILTER BANNER (when filtered by a specific friend) */}
            {friendFilter && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/70 via-[#231F2E] to-[#1E1D24] border border-purple-500/40 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={friendFilter.avatar}
                    alt={friendFilter.name}
                    className="w-11 h-11 rounded-xl border border-purple-400/60 object-cover [image-rendering:pixelated] shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white truncate">
                        Đang xem bài viết của: {friendFilter.name}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-purple-300">
                        {friendFilter.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 truncate">
                      Cấp độ {friendFilter.level || 1} • {friendFilter.activity}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => navigate('/friends')}
                    className="px-3 py-1.5 rounded-xl bg-[#2D2B38] hover:bg-white/10 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5 text-purple-300" />
                    <span className="hidden sm:inline">Xem trong Friends</span>
                  </button>
                  <button
                    onClick={() => {
                      playPopSound();
                      setFriendFilter(null);
                      setActiveTab('for_you');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 text-xs font-bold flex items-center gap-1.5 border border-rose-500/30 transition-all cursor-pointer"
                    title="Xem lại tất cả bài viết"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Xóa lọc</span>
                  </button>
                </div>
              </div>
            )}

            {/* FEED FILTER TABS & SEARCH */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {[
                  { id: 'for_you', label: 'Dành cho bạn' },
                  { id: 'friends', label: 'Bạn bè (100 cư dân) 👥' },
                  { id: 'trending', label: 'Xu hướng 🔥' },
                  { id: 'tv', label: 'Truyền hình 📺' },
                  { id: 'following', label: 'Đang theo dõi' },
                  { id: 'saved', label: 'Đã lưu 🔖' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      playPopSound();
                      setActiveTab(tab.id as any);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-[#E6005A] text-white shadow-sm'
                        : 'bg-[#1F1E24] hover:bg-[#2A2A33] text-[#A1A1AA] hover:text-white border border-[#2D2D38]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Feed search bar */}
              <div className="relative w-full sm:w-56 shrink-0">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Lọc bài viết, hashtag..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-full bg-[#1F1E24] border border-[#2D2D38] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#E6005A] transition-all"
                />
              </div>
            </div>

            {/* POSTS LIST */}
            {filteredPosts.length > 0 ? (
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 sm:p-5 rounded-2xl bg-[#1F1E24] border border-[#2D2D38] shadow-md hover:border-[#3E3E4A] transition-colors"
                  >
                    {/* Header: Author + Timestamp + Actions */}
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3 truncate">
                        <img
                          src={post.authorAvatar}
                          alt={post.authorName}
                          onClick={() => {
                            if (post.authorUserId) {
                              const f = MOCK_100_FRIENDS.find((u) => u.id === post.authorUserId);
                              if (f) {
                                playPopSound();
                                setFriendFilter(f);
                                setActiveTab('friends');
                              }
                            }
                          }}
                          className={`w-10 h-10 rounded-full object-cover border border-[#3E3E48] shrink-0 ${
                            post.authorAvatar.includes('mc-heads') ? '[image-rendering:pixelated]' : ''
                          } ${post.authorUserId ? 'cursor-pointer hover:border-purple-400 transition-colors' : ''}`}
                          title={post.authorUserId ? 'Xem các bài viết của người này' : undefined}
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              onClick={() => {
                                if (post.authorUserId) {
                                  const f = MOCK_100_FRIENDS.find((u) => u.id === post.authorUserId);
                                  if (f) {
                                    playPopSound();
                                    setFriendFilter(f);
                                    setActiveTab('friends');
                                  }
                                }
                              }}
                              className="font-bold text-sm text-white truncate hover:underline cursor-pointer"
                            >
                              {post.authorName}
                            </span>
                            {post.isVerified && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                            )}
                            {post.authorTag && (
                              <span className="text-[10.5px] font-mono text-purple-300 font-bold">
                                {post.authorTag}
                              </span>
                            )}
                            {post.authorBadge && (
                              <span className="px-1.5 py-0.2 rounded text-[9.5px] font-bold bg-[#E6005A]/20 text-[#FF4D8B] border border-[#E6005A]/30">
                                {post.authorBadge}
                              </span>
                            )}
                            {post.authorUserId && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                Cư dân Bạn bè
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-[#71717A]">
                            <span>@{post.authorHandle}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {post.timestamp}
                            </span>
                            {post.feeling && (
                              <>
                                <span>•</span>
                                <span className="text-amber-300 font-medium">{post.feeling}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {post.isUserCreated && (
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="p-1.5 text-zinc-500 hover:text-rose-400 transition-colors"
                            title="Xóa bài viết của bạn"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleToggleSave(post.id)}
                          className={`p-1.5 transition-colors ${
                            post.isSaved ? 'text-amber-400' : 'text-zinc-500 hover:text-zinc-200'
                          }`}
                          title="Lưu bài viết"
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="text-sm text-[#E4E4E7] leading-relaxed whitespace-pre-wrap break-words">
                      {post.content}
                    </div>

                    {/* Hashtags */}
                    {post.hashtags && post.hashtags.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-2">
                        {post.hashtags.map((ht, idx) => (
                          <span
                            key={idx}
                            onClick={() => setSearchFilter(ht)}
                            className="text-xs font-semibold text-[#E6005A] hover:underline cursor-pointer"
                          >
                            {ht}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Attached Image */}
                    {post.imageUrl && (
                      <div className="mt-3 rounded-xl overflow-hidden border border-[#2D2D38]">
                        <img
                          src={post.imageUrl}
                          alt="Post attachment"
                          className="w-full max-h-96 object-cover hover:scale-[1.01] transition-transform duration-300"
                        />
                      </div>
                    )}

                    {/* Attached TV Channel Streaming Card */}
                    {post.channelAttachment && (
                      <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-[#201c2b] to-[#1a1924] border border-cyan-500/40 flex items-center justify-between gap-3 shadow-md">
                        <div className="flex items-center gap-3 truncate">
                          <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/50 flex items-center justify-center shrink-0">
                            <Tv className="w-5 h-5 text-cyan-400" />
                          </div>
                          <div className="truncate">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-white truncate">
                                {post.channelAttachment.name}
                              </span>
                              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-rose-600 text-white animate-pulse">
                                LIVE
                              </span>
                            </div>
                            <span className="text-[11px] text-zinc-400">
                              Thể loại: {post.channelAttachment.category || 'Thời sự'}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handlePlayAttachedChannel(post.channelAttachment!.slug)}
                          className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Xem ngay</span>
                        </button>
                      </div>
                    )}

                    {/* Interactive Poll */}
                    {post.poll && (
                      <div className="mt-3 p-3.5 rounded-xl bg-[#25242C] border border-purple-500/30 space-y-2">
                        <div className="flex items-center justify-between text-xs text-purple-300 font-bold mb-1">
                          <span className="flex items-center gap-1.5">
                            <BarChart2 className="w-3.5 h-3.5" />
                            {post.poll.question}
                          </span>
                          <span className="font-mono text-[11px] text-zinc-400">
                            {post.poll.totalVotes} lượt bình chọn
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          {post.poll.options.map((opt) => {
                            const percent =
                              post.poll!.totalVotes > 0
                                ? Math.round((opt.votes / post.poll!.totalVotes) * 100)
                                : 0;
                            const isVoted = post.poll!.userVotedOptionId === opt.id;

                            return (
                              <button
                                key={opt.id}
                                onClick={() => handleVotePoll(post.id, opt.id)}
                                disabled={!!post.poll!.userVotedOptionId}
                                className={`relative w-full text-left p-2.5 rounded-lg border text-xs font-semibold overflow-hidden transition-all cursor-pointer ${
                                  isVoted
                                    ? 'border-purple-400 bg-purple-950/40 text-purple-200'
                                    : 'border-[#3E3E48] bg-[#18181E] hover:border-purple-500/50 text-zinc-200'
                                }`}
                              >
                                {/* Progress background */}
                                <div
                                  className="absolute top-0 left-0 bottom-0 bg-purple-600/25 transition-all duration-500"
                                  style={{ width: `${percent}%` }}
                                />
                                <div className="relative z-10 flex items-center justify-between">
                                  <span>{opt.text}</span>
                                  <span className="font-mono text-[11px] text-purple-300">
                                    {percent}% ({opt.votes})
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Post Interactions Bar */}
                    <div className="flex items-center justify-between pt-3.5 mt-3.5 border-t border-[#2D2D38] text-xs text-[#9CA3AF]">
                      <div className="flex items-center gap-1 sm:gap-4">
                        {/* Like Button */}
                        <button
                          onClick={() => handleToggleLike(post.id)}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                            post.isLiked
                              ? 'text-rose-500 bg-rose-500/15 font-bold'
                              : 'hover:text-rose-400 hover:bg-white/5'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                          <span>{post.likes}</span>
                        </button>

                        {/* Comment Toggle Button */}
                        <button
                          onClick={() =>
                            setExpandedComments((prev) => ({
                              ...prev,
                              [post.id]: !prev[post.id]
                            }))
                          }
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:text-cyan-400 hover:bg-white/5 transition-all cursor-pointer"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.comments.length}</span>
                        </button>

                        {/* Share Button */}
                        <button
                          onClick={() => handleShare(post)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:text-emerald-400 hover:bg-white/5 transition-all cursor-pointer"
                        >
                          <Share2 className="w-4 h-4" />
                          <span>{post.shares}</span>
                        </button>
                      </div>

                      {/* Tip Orbs Button */}
                      <button
                        onClick={() => setTipTargetPost(post)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/30 text-purple-200 font-mono font-bold transition-all cursor-pointer shadow-xs"
                        title="Tặng Orbs ủng hộ tác giả bài viết"
                      >
                        <Coins className="w-3.5 h-3.5 text-amber-300" />
                        <span>Tặng Orbs</span>
                        {post.tippedOrbs > 0 && (
                          <span className="text-[10px] text-amber-300">+{post.tippedOrbs}</span>
                        )}
                      </button>
                    </div>

                    {/* Expandable Comments Drawer */}
                    {expandedComments[post.id] && (
                      <div className="mt-3.5 pt-3 border-t border-[#2D2D38] space-y-2.5">
                        {post.comments.length > 0 ? (
                          post.comments.map((comm) => (
                            <div key={comm.id} className="flex items-start gap-2.5 text-xs">
                              <img
                                src={comm.authorAvatar}
                                alt={comm.authorName}
                                className="w-7 h-7 rounded-full object-cover border border-[#3E3E48] shrink-0 mt-0.5"
                              />
                              <div className="flex-1 bg-[#25242C] p-2.5 rounded-xl border border-[#343440]">
                                <div className="flex items-center justify-between mb-0.5">
                                  <span className="font-bold text-white">{comm.authorName}</span>
                                  <span className="text-[10px] text-zinc-500">{comm.time}</span>
                                </div>
                                <p className="text-zinc-300 leading-relaxed">{comm.text}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-2 text-xs text-zinc-500 italic">
                            Chưa có bình luận nào. Hãy là người đầu tiên để lại ý kiến!
                          </div>
                        )}

                        {/* Add Comment Field */}
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="text"
                            value={commentInputs[post.id] || ''}
                            onChange={(e) =>
                              setCommentInputs((prev) => ({
                                ...prev,
                                [post.id]: e.target.value
                              }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleAddComment(post.id);
                              }
                            }}
                            placeholder="Viết bình luận văn minh..."
                            className="flex-1 px-3.5 py-2 rounded-xl bg-[#18181E] border border-[#3E3E48] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors"
                          />
                          <button
                            onClick={() => handleAddComment(post.id)}
                            className="px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors cursor-pointer"
                          >
                            Gửi
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center rounded-2xl bg-[#1F1E24] border border-[#2D2D38] space-y-2">
                <Radio className="w-8 h-8 text-zinc-500 mx-auto" />
                <h3 className="text-sm font-bold text-zinc-300">Không tìm thấy bài viết phù hợp</h3>
                <p className="text-xs text-zinc-500">
                  Hãy thử tìm bằng từ khóa khác hoặc chuyển sang tab "Dành cho bạn".
                </p>
                <button
                  onClick={() => {
                    setActiveTab('for_you');
                    setSearchFilter('');
                  }}
                  className="mt-2 px-4 py-1.5 rounded-full bg-[#E6005A] text-white text-xs font-bold"
                >
                  Xem tất cả
                </button>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: TRENDING WIDGETS & SUGGESTIONS */}
          <div className="space-y-4">
            {/* WIDGET 0: 100 BẠN BÈ V-FLOW */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#241F2D] via-[#1E1D24] to-[#1A1922] border border-purple-500/30 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span>Cư Dân Bạn Bè ({MOCK_100_FRIENDS.length} Bạn)</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  100% HOẠT ĐỘNG
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Tất cả {MOCK_100_FRIENDS.length} bạn bè trong Friends & People đều đang sử dụng và đăng bài trên V-Flow!
              </p>

              {/* Quick Friend Filter Avatars */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {MOCK_100_FRIENDS.slice(0, 10).map((friend) => (
                  <button
                    key={friend.id}
                    onClick={() => {
                      playPopSound();
                      setFriendFilter(friend);
                      setActiveTab('friends');
                    }}
                    className={`relative p-0.5 rounded-xl transition-all cursor-pointer shrink-0 ${
                      friendFilter?.id === friend.id
                        ? 'ring-2 ring-purple-400 bg-purple-500/30 scale-105'
                        : 'hover:bg-white/10 opacity-80 hover:opacity-100'
                    }`}
                    title={`Lọc bài viết của ${friend.name} (${friend.tag})`}
                  >
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-8 h-8 rounded-lg [image-rendering:pixelated] border border-zinc-700 object-cover"
                    />
                  </button>
                ))}
              </div>

              <div className="pt-1 flex items-center gap-2">
                <button
                  onClick={() => {
                    playPopSound();
                    setActiveTab('friends');
                    setFriendFilter(null);
                  }}
                  className="flex-1 py-1.5 px-3 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white text-xs font-semibold border border-purple-500/40 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Xem tất cả bài bạn bè</span>
                </button>
                <button
                  onClick={() => navigate('/friends')}
                  className="py-1.5 px-3 rounded-xl bg-[#2A2933] hover:bg-white/10 text-zinc-300 text-xs font-semibold border border-[#3E3E48] transition-all cursor-pointer"
                  title="Đi tới trang Danh bạ 100 Friends & People"
                >
                  <span>Danh bạ</span>
                </button>
              </div>
            </div>

            {/* 1. CHỦ ĐỀ THỊNH HÀNH */}
            <div className="p-4 rounded-2xl bg-[#1F1E24] border border-[#2D2D38] shadow-md space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Flame className="w-4 h-4 text-rose-500" />
                <span>Chủ đề thịnh hành trên V-Flow</span>
              </div>
              <div className="space-y-2">
                {TRENDING_HASHTAGS.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSearchFilter(item.tag)}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-zinc-500">#{idx + 1}</span>
                      <span className="text-xs font-bold text-zinc-200 group-hover:text-[#E6005A] transition-colors">
                        {item.tag}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-500">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. GỢI Ý KẾT NỐI & THEO DÕI */}
            <div className="p-4 rounded-2xl bg-[#1F1E24] border border-[#2D2D38] shadow-md space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <UserCheck className="w-4 h-4 text-cyan-400" />
                <span>Gợi ý theo dõi</span>
              </div>
              <div className="space-y-2.5">
                {SUGGESTED_CREATORS.map((creator, idx) => {
                  const isFollowing = !!followedCreators[creator.handle];
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <img
                          src={creator.avatar}
                          alt={creator.name}
                          className="w-9 h-9 rounded-full object-cover border border-[#3E3E48] shrink-0"
                        />
                        <div className="truncate">
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-white truncate">{creator.name}</span>
                            {creator.isVerified && (
                              <CheckCircle2 className="w-3 h-3 text-sky-400 shrink-0" />
                            )}
                          </div>
                          <span className="text-[10.5px] text-zinc-500 truncate block">
                            {creator.handle} • {creator.followers}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleFollow(creator.handle)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                          isFollowing
                            ? 'bg-white/10 text-zinc-300 hover:bg-rose-600 hover:text-white'
                            : 'bg-[#E6005A] hover:bg-[#FF1A75] text-white shadow-xs'
                        }`}
                      >
                        {isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. V-FLOW GUIDELINES & PRIVACY */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1F1E24] to-[#18181F] border border-[#2D2D38] text-[11px] text-zinc-400 space-y-2">
              <div className="font-bold text-zinc-300 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-[#E6005A]" />
                <span>Không gian cộng đồng V-Flow</span>
              </div>
              <p className="leading-relaxed">
                Nơi thảo luận trực tiếp các chương trình truyền hình Việt Nam, giải đấu minigame V-Arcade và kết nối bạn bè mọi miền đất nước.
              </p>
              <div className="pt-1 flex items-center gap-3 text-zinc-500">
                <span>© 2026 VNRT Online Waves</span>
                <span>•</span>
                <span>Quy tắc cộng đồng</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. STORY VIEWER MODAL */}
      <AnimatePresence>
        {activeStory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md h-[550px] rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-700 shadow-2xl flex flex-col justify-between p-5"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(${activeStory.storyImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Story Timer Bar */}
              <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden mb-3">
                <div className="w-full h-full bg-[#E6005A] animate-[progress_5s_linear]" />
              </div>

              {/* Story Author Bar */}
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-2.5">
                  <img
                    src={activeStory.authorAvatar}
                    alt={activeStory.authorName}
                    className="w-9 h-9 rounded-full object-cover border-2 border-white"
                  />
                  <div>
                    <span className="font-bold text-sm block">{activeStory.authorName}</span>
                    <span className="text-[11px] text-zinc-300">{activeStory.time}</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveStory(null)}
                  className="p-1.5 rounded-full bg-black/50 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Caption & Quick Reaction */}
              <div className="space-y-3">
                <p className="text-sm sm:text-base font-semibold text-white bg-black/60 p-3 rounded-2xl backdrop-blur-sm">
                  {activeStory.caption}
                </p>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Gửi tin nhắn phản hồi..."
                    className="flex-1 px-4 py-2 rounded-full bg-black/60 border border-white/20 text-xs text-white placeholder-zinc-400 focus:outline-none"
                  />
                  {['❤️', '🔥', '👏', '😂'].map((emoji, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        playPopSound();
                        triggerToast(`Đã gửi phản hồi ${emoji}`);
                        setActiveStory(null);
                      }}
                      className="p-2 rounded-full bg-black/60 hover:bg-white/20 text-base cursor-pointer"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. TIP ORBS MODAL */}
      <AnimatePresence>
        {tipTargetPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl bg-[#1E1D24] border border-purple-500/40 p-5 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#2D2D38] pb-3">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-amber-300" />
                  <h3 className="font-bold text-sm text-white">Tặng Khoáng Vật Orbs</h3>
                </div>
                <button
                  onClick={() => setTipTargetPost(null)}
                  className="p-1 rounded-full text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs text-zinc-300">
                Tặng Orbs trực tiếp cho bài viết của{' '}
                <strong className="text-purple-300">{tipTargetPost.authorName}</strong> để khích lệ
                nhà sáng tạo:
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[20, 50, 100].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setTipAmount(amt)}
                    className={`py-2.5 rounded-xl font-mono font-bold text-xs border transition-all cursor-pointer ${
                      tipAmount === amt
                        ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                        : 'bg-[#282733] text-zinc-300 border-[#3E3E4A] hover:border-purple-500'
                    }`}
                  >
                    +{amt} Orbs
                  </button>
                ))}
              </div>

              <div className="text-[11px] text-zinc-400 flex items-center justify-between pt-1">
                <span>Số dư hiện tại của bạn:</span>
                <span className="font-mono font-bold text-amber-300">{orbs.toLocaleString()} Orbs</span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setTipTargetPost(null)}
                  className="flex-1 py-2.5 rounded-xl bg-[#282733] text-zinc-400 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  onClick={handleExecuteTip}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 cursor-pointer"
                >
                  Xác nhận tặng
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default VFlowTab;
