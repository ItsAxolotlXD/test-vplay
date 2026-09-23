import { VplayUser, MOCK_100_FRIENDS, CURRENT_USER } from './mockFriendsData';
import { VFlowPost, VFlowStory } from '../components/vflow/VFlowTab';

// Diverse set of Unsplash image illustrations for posts
const POST_IMAGES = [
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1000&auto=format&fit=crop&q=80', // Gaming & Minecraft
  'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1000&auto=format&fit=crop&q=80', // Arcade esports
  'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1000&auto=format&fit=crop&q=80', // News TV
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1000&auto=format&fit=crop&q=80', // Music & Stage
  'https://images.unsplash.com/photo-1528127269322-539801943592?w=1000&auto=format&fit=crop&q=80', // Vietnam scenery
  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1000&auto=format&fit=crop&q=80', // Study & books
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&auto=format&fit=crop&q=80', // Technology & chips
  'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?w=1000&auto=format&fit=crop&q=80', // Pixel art vibes
  'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=1000&auto=format&fit=crop&q=80', // Coding setup
  'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=1000&auto=format&fit=crop&q=80'  // Cinema film
];

// Rich post templates mapped to user themes
interface PostTemplate {
  content: string;
  hashtags: string[];
  feeling?: string;
  channel?: { id: string; name: string; slug: string; category?: string };
  poll?: { question: string; options: string[] };
  hasImage?: boolean;
}

const TEMPLATES: PostTemplate[] = [
  {
    content: 'Đang cùng hội bạn cày gameshow cuối tuần trên VTV3 HD! Âm thanh sống động và hình ảnh 1080p mượt mà ghê.',
    hashtags: ['#VTV3', '#GiaiTriCuoiTuan', '#VNRTLive', '#TVShow'],
    feeling: 'đang xem VTV3 HD 📺',
    channel: { id: 'vtv3', name: 'VTV3 HD - Giải trí & Thể thao', slug: 'vtv3', category: 'Giải trí' }
  },
  {
    content: 'Vừa chế tạo thành công La Bàn Hồi Sinh (Recovery Compass) từ Mảnh Vỡ Vang Vọng (Echo Shard) ở Deep Dark 1.19! Bộ rương Container GUI Ore UI mô phỏng cực chuẩn.',
    hashtags: ['#Minecraft119', '#DeepDark', '#EchoShard', '#OreUI'],
    feeling: 'cảm thấy phấn khích 🎮',
    hasImage: true
  },
  {
    content: 'Sàn cược Orbs hôm nay đỏ quá cả nhà ơi! Lật xu thắng liên tiếp 4 ván ăn trọn 2,000 Orbs. Có ai muốn solo Bài cào 3 cây không?',
    hashtags: ['#OrbsArena', '#LatXu', '#SanCuocOrbs', '#MayMan'],
    feeling: 'cảm thấy may mắn 💎'
  },
  {
    content: 'Thời sự 19h trên VTV1 có phóng sự chuyển đổi số quốc gia và ứng dụng AI trong truyền thông. Rất nhiều thông tin bổ ích!',
    hashtags: ['#VTV1', '#ThoiSu19h', '#ChuyenDoiSo', '#TinTuc'],
    feeling: 'đang cập nhật tin tức 📰',
    channel: { id: 'vtv1', name: 'VTV1 HD - Thời sự & Tin tức', slug: 'vtv1', category: 'Thời sự' }
  },
  {
    content: 'Hoàn thành 4 chu kỳ Pomodoro 25 phút trên V-Study với nền nhạc Lofi mưa rơi. Tập trung tuyệt đối giải quyết xong task!',
    hashtags: ['#VStudy', '#Pomodoro', '#TapTrung', '#HocTap'],
    feeling: 'đang tập trung cao độ 📚',
    hasImage: true
  },
  {
    content: 'Vừa lướt Bản đồ 63 tỉnh thành Explore Vietnam 360, ngắm ruộng bậc thang Mù Cang Chải mùa lúa chín mà mê đắm lòng người.',
    hashtags: ['#ExploreVietnam', '#DuLich360', '#VietNamDep', '#MuCangChai'],
    feeling: 'cảm thấy thư thái 🌿',
    hasImage: true
  },
  {
    content: 'Trận cầu Ngoại Hạng Anh tối nay trên K+ SPORT 1 quá kịch tính! Anh em VNRT Online đang cổ vũ đội nào?',
    hashtags: ['#KPlusSport', '#NgoaiHangAnh', '#BongDa', '#CuoiTuan'],
    feeling: 'đang hò hét cổ vũ ⚽',
    channel: { id: 'kplus-sport1', name: 'K+ SPORT 1 HD', slug: 'kplus-sport1', category: 'Thể thao' },
    poll: {
      question: 'Dự đoán kết quả trận đại chiến đêm nay?',
      options: ['Đội nhà thắng cách biệt', 'Đội khách lội ngược dòng', 'Hai đội hòa kịch tính']
    }
  },
  {
    content: 'Thử thách Caro XO trên V-Arcade vừa leo lên chuỗi 8 trận bất bại! Ai tự tin phá chuỗi này thì gửi lời mời nhé.',
    hashtags: ['#VArcade', '#CaroXO', '#DoiKhang', '#TopServer'],
    feeling: 'cảm thấy tự tin ♟️'
  },
  {
    content: 'Phim truyền hình miền Tây trên THVL1 4K lúc nào cũng chân thực và giàu cảm xúc. Tối nào cả nhà mình cũng quây quần xem.',
    hashtags: ['#THVL1', '#PhimTruyenHinh', '#MienTay', '#GiaDinh'],
    feeling: 'đang xem THVL1 📺',
    channel: { id: 'thvl1', name: 'THVL1 HD - Truyền hình Vĩnh Long', slug: 'thvl1', category: 'Giải trí' }
  },
  {
    content: 'Bộ rương Minecraft The Wild Update 1.19 có thuyền có rương (Chest Boat) đi khám phá đầm lầy ngập mặn siêu tiện! Điểm 10 cho tính năng này.',
    hashtags: ['#Minecraft', '#ChestBoat', '#MangroveSwamp', '#Sandbox'],
    feeling: 'thích thú trải nghiệm 🛶',
    hasImage: true
  },
  {
    content: 'Bầu Cua Tôm Cá lắc ra 3 mặt Cua liên tiếp nhân 3 Orbs! Cảm giác đập bàn ăn mừng vui không tả nổi anh em ạ.',
    hashtags: ['#BauCua', '#OrbsVIP', '#Minigame', '#WinStreak'],
    feeling: 'hứng khởi tột cùng 🦀'
  },
  {
    content: 'Nghe VOV3 Âm Nhạc qua hệ thống âm thanh của VNRT Online chất âm rất trong trẻo. Thư giãn cuối ngày cực kỳ hợp lý.',
    hashtags: ['#VOV3', '#AmNhac', '#AcousticChill', '#ThuGian'],
    feeling: 'đang nghe nhạc 🎧',
    channel: { id: 'vov3', name: 'VOV3 - Âm nhạc & Thông tin Giải trí', slug: 'vov3', category: 'Radio' }
  },
  {
    content: 'Mạng xã hội V-Flow ra mắt hay quá, giao diện hiện đại kết nối cả 100 anh em trong danh sách Friends. Chúc cộng đồng VNRT Online ngày càng lớn mạnh!',
    hashtags: ['#VFlow', '#FriendsAndPeople', '#VNRTCommunity', '#KetNoi'],
    feeling: 'cảm thấy tự hào 💖'
  },
  {
    content: 'Tối nay HTV7 phát sóng 2 Ngày 1 Đêm, dàn cast hài hước cười mỏi cả quai hàm. Cả nhà cùng vào kênh xem chung nhé!',
    hashtags: ['#HTV7', '#2Ngay1Dem', '#ShowThucTe', '#HaiHuoc'],
    feeling: 'cười thả ga 🤣',
    channel: { id: 'htv7', name: 'HTV7 HD - Đài Truyền Hình TP.HCM', slug: 'htv7', category: 'Giải trí' }
  }
];

// Meaningful comment lines from friends
const FRIEND_COMMENTS = [
  'Đỉnh quá bạn ơi, chúc mừng nhé! 👏',
  'Kênh này xem sắc nét thật, tối nay mình cũng đang theo dõi nè.',
  'Tặng bạn 50 Orbs may mắn nhé! 💎',
  'Kèo này chuẩn bài luôn, đúng chuyên gia.',
  'Cho mình xin link phòng vào xem chung với!',
  'Ore UI của Minecraft mượt thật sự, bạn tìm được bao nhiêu Echo Shard rồi?',
  'Hôm nào giao lưu ván Caro nhé người anh em!',
  'Chu kỳ Pomodoro này công nhận tăng tập trung cao thật.',
  'Bầu cua đỏ vậy chia sẻ bí quyết cho anh em với nào!',
  'Bài viết rất hay và bổ ích, thả tim nhiệt tình ❤️'
];

/**
 * Generates a full array of posts authored by ALL 100 friends in MOCK_100_FRIENDS,
 * plus CURRENT_USER, ensuring every single person in Friends and People is active on V-Flow!
 */
export const generateAllFriendsPosts = (): VFlowPost[] => {
  const allPosts: VFlowPost[] = [];
  const baseTime = Date.now();

  // 1. Current user's introduction post
  allPosts.push({
    id: `post-you-intro`,
    authorName: CURRENT_USER.name,
    authorHandle: 'nguyenvanvplay',
    authorAvatar: CURRENT_USER.avatar,
    authorBadge: CURRENT_USER.badge,
    authorUserId: CURRENT_USER.id,
    authorTag: CURRENT_USER.tag,
    isVerified: true,
    timestamp: 'Vừa xong',
    createdAt: baseTime - 2 * 60 * 1000,
    content: '👋 Chào mừng toàn bộ 100 anh em trong danh sách Friends & People đến với V-Flow! Mọi người tha hồ đăng bài, chia sẻ kênh TV yêu thích, khoe khoảnh khắc Minecraft và giao lưu nhé.',
    hashtags: ['#VNRT Online', '#VFlow', '#FriendsAndPeople', '#Welcome'],
    feeling: 'cảm thấy hào hứng 🚀',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80',
    likes: 89,
    shares: 15,
    tippedOrbs: 100,
    comments: [
      {
        id: `c-you-1`,
        authorName: MOCK_100_FRIENDS[0]?.name || 'Nguyễn Hoàng Long',
        authorAvatar: MOCK_100_FRIENDS[0]?.avatar || 'https://mc-heads.net/avatar/Steve/64',
        text: 'Cộng đồng 100 bạn bè chúng ta đã có mặt đông đủ trên V-Flow rồi! 🔥',
        time: '1 phút trước'
      }
    ]
  });

  // 2. Generate posts for all 100 friends!
  MOCK_100_FRIENDS.forEach((friend, idx) => {
    // Determine template index
    const template = TEMPLATES[idx % TEMPLATES.length];
    const imageIdx = (idx * 3) % POST_IMAGES.length;
    
    // Realistic minutes ago: between 3 mins and 36 hours
    const minutesAgo = (idx * 17 + 5) % (36 * 60);
    const createdAt = baseTime - minutesAgo * 60 * 1000;

    let timeText = '';
    if (minutesAgo < 60) {
      timeText = `${Math.max(2, minutesAgo)} phút trước`;
    } else if (minutesAgo < 1440) {
      timeText = `${Math.floor(minutesAgo / 60)} giờ trước`;
    } else {
      timeText = `Hôm qua lúc ${String(10 + (idx % 12)).padStart(2, '0')}:${String((idx * 7) % 60).padStart(2, '0')}`;
    }

    // Friendly commentators (picking other 2 friends from the list)
    const commenter1 = MOCK_100_FRIENDS[(idx + 1) % MOCK_100_FRIENDS.length];
    const commenter2 = MOCK_100_FRIENDS[(idx + 5) % MOCK_100_FRIENDS.length];

    const comments = [
      {
        id: `c-${idx}-1`,
        authorName: commenter1.name,
        authorAvatar: commenter1.avatar,
        text: FRIEND_COMMENTS[(idx + 2) % FRIEND_COMMENTS.length],
        time: `${Math.max(1, Math.floor(minutesAgo * 0.4))} phút trước`
      }
    ];

    if (idx % 2 === 0) {
      comments.push({
        id: `c-${idx}-2`,
        authorName: commenter2.name,
        authorAvatar: commenter2.avatar,
        text: FRIEND_COMMENTS[(idx + 7) % FRIEND_COMMENTS.length],
        time: `${Math.max(1, Math.floor(minutesAgo * 0.2))} phút trước`
      });
    }

    // Poll structure if template specifies
    let pollData = undefined;
    if (template.poll) {
      const votesA = 40 + ((idx * 13) % 120);
      const votesB = 30 + ((idx * 9) % 80);
      const votesC = 20 + ((idx * 17) % 60);
      pollData = {
        question: template.poll.question,
        options: [
          { id: `p-${idx}-1`, text: template.poll.options[0], votes: votesA },
          { id: `p-${idx}-2`, text: template.poll.options[1], votes: votesB },
          ...(template.poll.options[2] ? [{ id: `p-${idx}-3`, text: template.poll.options[2], votes: votesC }] : [])
        ],
        totalVotes: votesA + votesB + (template.poll.options[2] ? votesC : 0)
      };
    }

    // Clean handle without spaces and accents
    const cleanHandle = friend.name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'd')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_');

    allPosts.push({
      id: `post-friend-${friend.id}`,
      authorName: friend.name,
      authorHandle: `${cleanHandle}_${friend.tag.replace('#', '')}`,
      authorAvatar: friend.avatar,
      authorBadge: friend.badge,
      authorUserId: friend.id,
      authorTag: friend.tag,
      isVerified: idx % 4 === 0, // top 25% have verified badge
      timestamp: timeText,
      createdAt,
      content: template.content,
      hashtags: template.hashtags,
      feeling: template.feeling,
      imageUrl: template.hasImage || idx % 3 === 0 ? POST_IMAGES[imageIdx] : undefined,
      channelAttachment: template.channel,
      poll: pollData,
      likes: 24 + ((idx * 19) % 380),
      shares: 3 + ((idx * 3) % 45),
      tippedOrbs: (idx % 2 === 0 ? ((idx * 25) % 300) + 50 : 0),
      comments
    });
  });

  // Sort chronologically (newest first)
  return allPosts.sort((a, b) => b.createdAt - a.createdAt);
};

/**
 * Generates active stories from online & joinable friends in MOCK_100_FRIENDS
 */
export const generateFriendsStories = (): VFlowStory[] => {
  const onlineFriends = MOCK_100_FRIENDS.filter((f) => f.status === 'online' || f.status === 'joinable');
  
  const stories: VFlowStory[] = [
    {
      id: 'story-you',
      authorName: CURRENT_USER.name,
      authorAvatar: CURRENT_USER.avatar,
      isVerified: true,
      hasUnread: false,
      storyImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      caption: 'Đang online trên VNRT Online & V-Flow 🌟',
      time: 'Vừa xong'
    }
  ];

  // Pick top 15 active friends for the story reel
  onlineFriends.slice(0, 14).forEach((friend, idx) => {
    const storyImg = POST_IMAGES[idx % POST_IMAGES.length];
    stories.push({
      id: `story-${friend.id}`,
      authorName: friend.name,
      authorAvatar: friend.avatar,
      isVerified: idx % 3 === 0,
      hasUnread: idx % 2 === 0,
      storyImage: storyImg,
      caption: `${friend.activity} • ${friend.bio.slice(0, 65)}...`,
      time: `${(idx + 1) * 7} phút trước`
    });
  });

  return stories;
};

/**
 * Helper to get all posts by a specific user ID
 */
export const getPostsByUserId = (posts: VFlowPost[], userId: string): VFlowPost[] => {
  return posts.filter((p) => p.authorUserId === userId || (userId === 'user_you' && p.authorUserId === 'user_you'));
};

/**
 * Helper to get all posts by a specific author name or tag
 */
export const getPostsByAuthor = (posts: VFlowPost[], nameOrTag: string): VFlowPost[] => {
  const q = nameOrTag.toLowerCase().trim();
  return posts.filter(
    (p) =>
      p.authorName.toLowerCase().includes(q) ||
      (p.authorTag && p.authorTag.toLowerCase().includes(q)) ||
      p.authorHandle.toLowerCase().includes(q)
  );
};
