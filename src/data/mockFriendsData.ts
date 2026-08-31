export interface VplayUser {
  id: string;
  name: string;
  tag: string;
  avatar: string;
  status: 'joinable' | 'online' | 'offline';
  activity: string;
  channelPlaying?: string;
  isYou?: boolean;
  mutualFriends?: number;
  level?: number;
  orbs?: number;
  badge?: string;
  badgeColor?: string;
  bio?: string;
  favoriteChannel?: string;
  joinDate?: string;
}

// Helper to generate Minecraft-style pixel avatars or custom skins
const getAvatarUrl = (seed: string, index: number): string => {
  const mcSkins = ['Steve', 'Alex', 'Notch', 'Jeb_', 'MHO', 'Grumm', 'Dinnerbone'];
  const skinName = mcSkins[index % mcSkins.length];
  return `https://mc-heads.net/avatar/${skinName}/64`;
};

const USER_BADGES = [
  { name: 'Cư dân VIP Kim Cương', color: 'from-amber-400 to-amber-600 border-amber-400/50 text-amber-200' },
  { name: 'Chiến thần Minigame', color: 'from-purple-500 to-indigo-600 border-purple-400/50 text-purple-200' },
  { name: 'Thần đồng VStudy', color: 'from-cyan-500 to-blue-600 border-cyan-400/50 text-cyan-200' },
  { name: 'Mọt Phim HD', color: 'from-rose-500 to-pink-600 border-rose-400/50 text-rose-200' },
  { name: 'Nhà phát triển Vplay', color: 'from-emerald-500 to-teal-600 border-emerald-400/50 text-emerald-200' },
  { name: 'Tay cược Huyền thoại', color: 'from-fuchsia-500 to-purple-700 border-fuchsia-400/50 text-fuchsia-200' },
  { name: 'Cư dân thân thiện', color: 'from-blue-500 to-indigo-500 border-blue-400/50 text-blue-200' }
];

const USER_BIOS = [
  "Đam mê xem truyền hình trực tuyến độ nét cao & thi đấu VStudy!",
  "Thợ săn Orbs cấp vũ trụ • Sẵn sàng giao lưu PvP Caro & Bầu cua",
  "Yêu thích các chương trình thời sự VTV1 & VTV3 giải trí cuối tuần",
  "Ore UI Minecraft fan chính hiệu • Thích tùy biến giao diện Vplay",
  "Luôn online trải nghiệm phim chiếu rạp và nghe VOV Music thư giãn",
  "Xin chào! Kết bạn để cùng xem phim và chia sẻ phòng live TV nhé!",
  "Thành viên tích cực của cộng đồng Vplay Media Hub Việt Nam."
];

// 100 Unique Everyday Vietnamese Names (No celebrities or football players)
const VIETNAMESE_NAMES: string[] = [
  "Nguyễn Hoàng Long", "Trần Thị Mai Anh", "Lê Minh Tuấn", "Phạm Quốc Bảo", "Hoàng Khánh Linh",
  "Huỳnh Đức Hùng", "Vũ Phương Thảo", "Đặng Gia Huy", "Bùi Thanh Trúc", "Đỗ Văn Sang",
  "Hồ Mỹ Linh", "Ngô Hoài Thương", "Dương Thái Sơn", "Lý Ngọc Hà", "Đào Tuấn Anh",
  "Đinh Bích Ngân", "Trịnh Văn Dũng", "Đoàn Thu Trang", "Mai Quốc Cường", "Lâm Tiến Dũng",
  "Nguyễn Mai Chi", "Đỗ Quốc Anh", "Trần Bảo Trâm", "Phan Hoàng Nam", "Vũ Thị Hồng",
  "Trương Công Thành", "Đặng Thu Hà", "Cao Minh Triết", "Nguyễn Thanh Hà", "Phạm Ngọc Bích",
  "Lê Quang Khải", "Trần Mỹ Duyên", "Hoàng Đức Trọng", "Huỳnh Bảo Ngọc", "Võ Thanh Bình",
  "Nguyễn Nhật Minh", "Trần Hoài An", "Lê Hữu Phước", "Phạm Đức Phát", "Hoàng Thảo Nguyên",
  "Huỳnh Anh Khoa", "Vũ Minh Triết", "Đặng Xuân Hòa", "Bùi Hải Đăng", "Đỗ Gia Linh",
  "Hồ Bảo Nam", "Ngô Kim Ngân", "Dương Anh Tuấn", "Lý Hữu Minh", "Đào Ngọc Lan",
  "Trịnh Minh Trí", "Đoàn Văn Việt", "Mai Khánh An", "Lâm Văn Hải", "Nguyễn Phương Nghi",
  "Trần Văn Hòa", "Lê Thị Bích", "Phạm Minh Nhật", "Hoàng Thanh Tùng", "Huỳnh Như Ngọc",
  "Vũ Anh Dũng", "Đặng Kim Liên", "Bùi Quang Huy", "Đỗ Thị Thu", "Hồ Minh Tâm",
  "Ngô Bảo Khánh", "Dương Tấn Phát", "Lý Thanh Trinh", "Đào Minh Nhật", "Trịnh Công Minh",
  "Đoàn Thị Ngọc", "Mai Hữu Nghị", "Lâm Hoài Nam", "Nguyễn Bảo Khánh", "Trần Thị Hương",
  "Lê Văn Thành", "Phạm Thị Yến", "Hoàng Quốc Huy", "Huỳnh Tấn Đạt", "Vũ Hoàng Yến",
  "Đặng Minh Quân", "Bùi Hữu Tài", "Đỗ Thị Phương", "Hồ Văn Kiệt", "Ngô Thị Bích",
  "Dương Văn Toàn", "Lý Quốc Đạt", "Đào Thị Hồng", "Trịnh Văn Phong", "Đoàn Minh Trí",
  "Mai Thanh Hải", "Lâm Ngọc Như", "Nguyễn Tuấn Kiệt", "Trần Đăng Khoa", "Lê Thị Hoài",
  "Phạm Hoàng Nam", "Hoàng Văn Thắng", "Huỳnh Mỹ Duyên", "Vũ Đức Anh", "Đặng Hoài Phong"
];

const ACTIVITIES_JOINABLE = [
  "Đang xem VTV3 HD", "Đang xem VTV1 HD", "Đang xem THVL1 4K", "Đang xem HTV7 HD",
  "Đang xem VTV6 - Thể Thao", "Đang xem K+ SPORT 1", "Đang phát kênh tùy chỉnh (M3U8)",
  "Playing in Creative Mode", "Playing in Survival Mode", "Playing Minecraft Launcher",
  "Đang nghe VOV1 - Thời Sự", "Đang xem Phim Chiếu Rạp Vplay", "Đang thi đấu VStudy Quiz"
];

const ACTIVITIES_ONLINE = [
  "Đang ở Trang chủ Vplay", "In the Menus", "Đang lướt VFlow Shorts", "Đang nghe VOV3 Music",
  "Đang đọc tin tức Vplay", "Đang xem danh sách kênh HD", "Đang thiết lập Cài đặt Vplay",
  "Online - Sẵn sàng trò chuyện", "Đang trải nghiệm Ore UI Minecraft"
];

const ACTIVITIES_OFFLINE = [
  "Ngoại tuyến (10 phút trước)", "Ngoại tuyến (45 phút trước)", "Ngoại tuyến (2 giờ trước)",
  "Ngoại tuyến (5 giờ trước)", "Ngoại tuyến (1 ngày trước)", "Ngoại tuyến (3 ngày trước)"
];

export const CURRENT_USER: VplayUser = {
  id: "user_you",
  name: "Nguyễn Văn Vplay",
  tag: "#0001",
  avatar: "https://mc-heads.net/avatar/Steve/64",
  status: "online",
  activity: "In the Menus",
  isYou: true,
  mutualFriends: 100,
  level: 42,
  orbs: 15400,
  badge: "Nhà phát triển Vplay",
  badgeColor: "from-emerald-500 to-teal-600 border-emerald-400/50 text-emerald-200",
  bio: "Tài khoản của bạn trên Vplay Platform • Luôn sẵn sàng hỗ trợ và giao lưu!",
  favoriteChannel: "VTV3 HD",
  joinDate: "01/01/2026"
};

// Generate exactly 100 friends with distinct names
export const MOCK_100_FRIENDS: VplayUser[] = VIETNAMESE_NAMES.map((name, index) => {
  let status: 'joinable' | 'online' | 'offline';
  let activity: string;
  let channelPlaying: string | undefined = undefined;

  if (index < 20) {
    status = 'joinable';
    activity = ACTIVITIES_JOINABLE[index % ACTIVITIES_JOINABLE.length];
    if (activity.includes("VTV3")) channelPlaying = "vtv3";
    else if (activity.includes("VTV1")) channelPlaying = "vtv1";
    else if (activity.includes("THVL1")) channelPlaying = "thvl1";
    else if (activity.includes("HTV7")) channelPlaying = "htv7";
    else if (activity.includes("K+")) channelPlaying = "kplus-sport1";
  } else if (index < 55) {
    status = 'online';
    activity = ACTIVITIES_ONLINE[index % ACTIVITIES_ONLINE.length];
  } else {
    status = 'offline';
    activity = ACTIVITIES_OFFLINE[index % ACTIVITIES_OFFLINE.length];
  }

  const tagNumber = String(1000 + index).padStart(4, '0');
  const badgeObj = USER_BADGES[index % USER_BADGES.length];

  return {
    id: `vplay_user_${index + 1}`,
    name,
    tag: `#${tagNumber}`,
    avatar: getAvatarUrl(name, index),
    status,
    activity,
    channelPlaying,
    mutualFriends: Math.floor(Math.random() * 25) + 1,
    level: Math.floor(Math.random() * 50) + 1,
    orbs: (Math.floor(Math.random() * 40) + 2) * 500,
    badge: badgeObj.name,
    badgeColor: badgeObj.color,
    bio: USER_BIOS[index % USER_BIOS.length],
    favoriteChannel: index % 2 === 0 ? "VTV3 HD" : "VTV1 HD",
    joinDate: `${(index % 28) + 1}/${((index % 12) + 1).toString().padStart(2, '0')}/2026`
  };
});

export interface FriendRequest {
  id: string;
  user: VplayUser;
  timestamp: string;
}

export const MOCK_FRIEND_REQUESTS: FriendRequest[] = [
  {
    id: "req_1",
    user: {
      id: "req_user_1",
      name: "Trần Đăng Khoa",
      tag: "#9988",
      avatar: "https://mc-heads.net/avatar/Alex/64",
      status: "online",
      activity: "Mời bạn cùng xem VTV3 HD",
      mutualFriends: 12,
      level: 28,
      orbs: 4500,
      badge: "Cư dân VIP Kim Cương",
      badgeColor: "from-amber-400 to-amber-600 border-amber-400/50 text-amber-200",
      bio: "Rất vui được làm quen với mọi người trên hệ sinh thái Vplay!",
      favoriteChannel: "VTV3 HD",
      joinDate: "15/05/2026"
    },
    timestamp: "10 phút trước"
  },
  {
    id: "req_2",
    user: {
      id: "req_user_2",
      name: "Phan Hoàng Nam",
      tag: "#3421",
      avatar: "https://mc-heads.net/avatar/Notch/64",
      status: "joinable",
      activity: "Đang xem K+ SPORT 1",
      channelPlaying: "kplus-sport1",
      mutualFriends: 8,
      level: 35,
      orbs: 8900,
      badge: "Chiến thần Minigame",
      badgeColor: "from-purple-500 to-indigo-600 border-purple-400/50 text-purple-200",
      bio: "Thích thể thao và các trận cầu Ngoại hạng Anh cuối tuần!",
      favoriteChannel: "K+ SPORT 1",
      joinDate: "02/03/2026"
    },
    timestamp: "1 giờ trước"
  }
];
