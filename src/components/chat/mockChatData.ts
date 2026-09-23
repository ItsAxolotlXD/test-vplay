import { ChatChannel, ChatMessage, Member, VoiceParticipant } from './types';

export const CHAT_CHANNELS: ChatChannel[] = [
  // Text channels
  {
    id: 'general',
    name: 'thảo-luận-chung',
    type: 'text',
    topic: 'Kênh trò chuyện tự do, chia sẻ mọi chủ đề về VNRT Online, giải trí và công nghệ.',
    category: 'text',
    unreadCount: 0
  },
  {
    id: 'tv-share',
    name: 'chia-sẻ-kênh-tv',
    type: 'text',
    topic: 'Gợi ý các kênh truyền hình hot nhất, lịch phát sóng bóng đá và phim truyện.',
    category: 'text',
    unreadCount: 2
  },
  {
    id: 'gaming',
    name: 'góc-game-minecraft',
    type: 'text',
    topic: 'Giao lưu Kho game Arcade, thảo luận rương Minecraft 1.19 và sàn cược Orbs.',
    category: 'text',
    unreadCount: 0
  },
  {
    id: 'announcements',
    name: 'thông-báo-sự-kiện',
    type: 'text',
    topic: 'Kênh tin tức chính thức cập nhật tính năng mới từ Đội ngũ VNRT Online.',
    category: 'text',
    isLocked: true,
    unreadCount: 1
  },
  {
    id: 'bot-commands',
    name: 'lệnh-bot-copilot',
    type: 'text',
    topic: 'Thử nghiệm các lệnh slash: /copilot, /roll, /flip, /tv, /clear.',
    category: 'text',
    unreadCount: 0
  },

  // Voice channels
  {
    id: 'voice-general',
    name: 'Phòng Thoại Chung 1',
    type: 'voice',
    topic: 'Trò chuyện thoại tự do âm thanh Opus 128kbps stereo.',
    category: 'voice'
  },
  {
    id: 'voice-watchparty',
    name: 'Cùng Xem TV & Live',
    type: 'voice',
    topic: 'Watch Party voice room - Cùng xem trực tiếp trận cầu đỉnh cao và phim truyện.',
    category: 'voice'
  },
  {
    id: 'voice-gaming',
    name: 'Chém Gió Gaming',
    type: 'voice',
    topic: 'Đàm thoại giao lưu khi chơi game Minigame, Caro & Minecraft.',
    category: 'voice'
  },
  {
    id: 'voice-vip',
    name: 'Phòng Họp VIP Orbs',
    type: 'voice',
    topic: 'Phòng thoại riêng dành cho VIP và Quản trị viên.',
    category: 'voice'
  }
];

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'mem_admin_1',
    name: 'VNRT Online Admin',
    tag: '#0001',
    avatar: 'https://mc-heads.net/avatar/Notch/64',
    role: 'owner',
    roleName: 'Chủ Phòng',
    roleColor: '#E6005A',
    status: 'online',
    activity: 'Quản trị hệ thống VNRT Online Hub',
    customStatus: '⚡ Luôn lắng nghe ý kiến cộng đồng'
  },
  {
    id: 'mem_bot_copilot',
    name: 'Copilot AI Bot',
    tag: '#BOT',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=vnrt-bot&backgroundColor=1e1b24',
    role: 'bot',
    roleName: 'BOT HỖ TRỢ',
    roleColor: '#06B6D4',
    status: 'online',
    activity: 'Sẵn sàng trả lời lệnh /copilot',
    customStatus: '🤖 Trợ lý AI thế hệ mới'
  },
  {
    id: 'mem_mod_1',
    name: 'Hoàng Long',
    tag: '#1024',
    avatar: 'https://mc-heads.net/avatar/Steve/64',
    role: 'mod',
    roleName: 'Điều Hành Viên',
    roleColor: '#10B981',
    status: 'online',
    activity: 'Đang xem VTV3 HD',
    customStatus: '📺 Đang hóng trận bóng 20h00'
  },
  {
    id: 'mem_vip_1',
    name: 'Trần Mai Anh',
    tag: '#2048',
    avatar: 'https://mc-heads.net/avatar/Alex/64',
    role: 'vip',
    roleName: 'VNRT Online VIP Diamond',
    roleColor: '#F59E0B',
    status: 'online',
    activity: 'Chơi Sàn cược Orbs',
    customStatus: '✨ Orbs balance: 25,000'
  },
  {
    id: 'mem_user_1',
    name: 'Lê Minh Tuấn',
    tag: '#3312',
    avatar: 'https://mc-heads.net/avatar/MHO/64',
    role: 'member',
    roleName: 'Thành Viên',
    roleColor: '#9CA3AF',
    status: 'idle',
    activity: 'Đang nghe VOV3 Music'
  },
  {
    id: 'mem_user_2',
    name: 'Phạm Quốc Bảo',
    tag: '#4490',
    avatar: 'https://mc-heads.net/avatar/Jeb_/64',
    role: 'member',
    roleName: 'Thành Viên',
    roleColor: '#9CA3AF',
    status: 'dnd',
    activity: 'Đang học V-Study Pomodoro',
    customStatus: '📚 Không làm phiền khi đang học'
  },
  {
    id: 'mem_user_3',
    name: 'Khánh Linh',
    tag: '#5110',
    avatar: 'https://mc-heads.net/avatar/Grumm/64',
    role: 'member',
    roleName: 'Thành Viên',
    roleColor: '#9CA3AF',
    status: 'offline',
    activity: 'Ngoại tuyến'
  },
  {
    id: 'mem_user_4',
    name: 'Đức Hùng',
    tag: '#6022',
    avatar: 'https://mc-heads.net/avatar/Dinnerbone/64',
    role: 'member',
    roleName: 'Thành Viên',
    roleColor: '#9CA3AF',
    status: 'offline',
    activity: 'Ngoại tuyến'
  }
];

export const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  general: [
    {
      id: 'msg_1',
      channelId: 'general',
      author: {
        id: 'mem_admin_1',
        name: 'VNRT Online Admin',
        tag: '#0001',
        avatar: 'https://mc-heads.net/avatar/Notch/64',
        role: 'owner',
        roleColor: '#E6005A',
        roleName: 'Chủ Phòng'
      },
      content: 'Chào mừng tất cả các bạn đến với **Phòng Chat VNRT Online**! 🎉 Hệ thống được thiết kế theo phong cách Discord với đầy đủ các kênh thảo luận văn bản và kênh thoại trực tiếp.',
      timestamp: 'Hôm nay lúc 10:00',
      reactions: [
        { emoji: '🎉', count: 12, users: ['user_you', 'mem_mod_1', 'mem_vip_1'] },
        { emoji: '🔥', count: 8, users: ['mem_mod_1'] },
        { emoji: '❤️', count: 6, users: ['user_you'] }
      ]
    },
    {
      id: 'msg_2',
      channelId: 'general',
      author: {
        id: 'mem_mod_1',
        name: 'Hoàng Long',
        tag: '#1024',
        avatar: 'https://mc-heads.net/avatar/Steve/64',
        role: 'mod',
        roleColor: '#10B981',
        roleName: 'Điều Hành Viên'
      },
      content: 'Giao diện mượt mà quá! Anh em có thể nhấp vào các kênh thoại ở bên trái (như `🔊 Phòng Thoại Chung 1` hoặc `🔊 Cùng Xem TV & Live`) để đàm thoại với nhau nhé 🎧.',
      timestamp: 'Hôm nay lúc 10:05',
      reactions: [
        { emoji: '👏', count: 5, users: ['mem_vip_1'] }
      ]
    },
    {
      id: 'msg_3',
      channelId: 'general',
      author: {
        id: 'mem_vip_1',
        name: 'Trần Mai Anh',
        tag: '#2048',
        avatar: 'https://mc-heads.net/avatar/Alex/64',
        role: 'vip',
        roleColor: '#F59E0B',
        roleName: 'VNRT Online VIP Diamond'
      },
      content: 'Tối nay ai qua phòng thoại xem VTV3 cùng mình không? Có phim mới hay lắm á!',
      timestamp: 'Hôm nay lúc 10:15',
      reactions: [
        { emoji: '🍿', count: 4, users: ['user_you'] }
      ]
    },
    {
      id: 'msg_4',
      channelId: 'general',
      author: {
        id: 'mem_bot_copilot',
        name: 'Copilot AI Bot',
        tag: '#BOT',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=vnrt-bot&backgroundColor=1e1b24',
        role: 'bot',
        roleColor: '#06B6D4',
        roleName: 'BOT HỖ TRỢ'
      },
      content: '🤖 *Mẹo hữu ích:* Bạn có thể gõ lệnh `/copilot [câu hỏi]` để trò chuyện với mình ngay trong phòng chat, hoặc dùng `/roll` để tung xúc xắc may mắn!',
      timestamp: 'Hôm nay lúc 10:16'
    }
  ],
  'tv-share': [
    {
      id: 'msg_tv_1',
      channelId: 'tv-share',
      author: {
        id: 'mem_mod_1',
        name: 'Hoàng Long',
        tag: '#1024',
        avatar: 'https://mc-heads.net/avatar/Steve/64',
        role: 'mod',
        roleColor: '#10B981',
        roleName: 'Điều Hành Viên'
      },
      content: 'Kênh VTV3 HD đang phát sóng tập tiếp theo phim truyền hình giờ vàng cực cuốn!',
      timestamp: 'Hôm qua lúc 20:30',
      reactions: [
        { emoji: '📺', count: 7, users: ['user_you'] }
      ]
    },
    {
      id: 'msg_tv_2',
      channelId: 'tv-share',
      author: {
        id: 'mem_vip_1',
        name: 'Trần Mai Anh',
        tag: '#2048',
        avatar: 'https://mc-heads.net/avatar/Alex/64',
        role: 'vip',
        roleColor: '#F59E0B',
        roleName: 'VNRT Online VIP Diamond'
      },
      content: 'Chất lượng stream 1080p 60fps mượt không giật lag tí nào luôn.',
      timestamp: 'Hôm qua lúc 20:45'
    }
  ],
  gaming: [
    {
      id: 'msg_game_1',
      channelId: 'gaming',
      author: {
        id: 'mem_user_1',
        name: 'Lê Minh Tuấn',
        tag: '#3312',
        avatar: 'https://mc-heads.net/avatar/MHO/64',
        role: 'member',
        roleColor: '#9CA3AF',
        roleName: 'Thành Viên'
      },
      content: 'Vừa trúng 5,000 Orbs bên Sàn cược Bầu Cua xong anh em ơi 🦀🐟🎲!',
      timestamp: 'Hôm nay lúc 09:12',
      reactions: [
        { emoji: '🔥', count: 9, users: ['user_you', 'mem_admin_1'] }
      ]
    }
  ],
  announcements: [
    {
      id: 'msg_anno_1',
      channelId: 'announcements',
      author: {
        id: 'mem_admin_1',
        name: 'VNRT Online Admin',
        tag: '#0001',
        avatar: 'https://mc-heads.net/avatar/Notch/64',
        role: 'owner',
        roleColor: '#E6005A',
        roleName: 'Chủ Phòng'
      },
      content: '📢 **THÔNG BÁO CHÍNH THỨC:**\n\n1. Ra mắt tính năng **Phòng Chat Discord** tích hợp đầy đủ phân kênh Văn bản & Kênh thoại chất lượng cao.\n2. Cho phép người dùng bật/tắt mic, tai nghe, chia sẻ màn hình mô phỏng và trò chuyện thời gian thực.\n3. Hỗ trợ hệ thống bot Copilot và lệnh slash tương tác.\n\nCảm ơn các bạn đã đồng hành cùng VNRT Online!',
      timestamp: 'Hôm nay lúc 08:00',
      reactions: [
        { emoji: '🚀', count: 18, users: ['user_you', 'mem_mod_1'] },
        { emoji: '❤️', count: 15, users: ['mem_vip_1'] }
      ]
    }
  ],
  'bot-commands': [
    {
      id: 'msg_bot_1',
      channelId: 'bot-commands',
      author: {
        id: 'mem_bot_copilot',
        name: 'Copilot AI Bot',
        tag: '#BOT',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=vnrt-bot&backgroundColor=1e1b24',
        role: 'bot',
        roleColor: '#06B6D4',
        roleName: 'BOT HỖ TRỢ'
      },
      content: 'Chào mừng bạn đến với kênh điều khiển Bot! Hãy gõ một trong các lệnh sau:\n- `/copilot [câu hỏi]`: Hỏi đáp AI thông minh\n- `/roll`: Tung xúc xắc ngẫu nhiên (1 - 100)\n- `/flip`: Tung đồng xu may mắn\n- `/tv [tên kênh]`: Xem thông tin kênh truyền hình\n- `/clear`: Xóa tin nhắn tạm thời trong kênh này',
      timestamp: 'Hôm nay lúc 00:00'
    }
  ]
};

export const INITIAL_VOICE_PARTICIPANTS: Record<string, VoiceParticipant[]> = {
  'voice-general': [
    {
      id: 'mem_mod_1',
      name: 'Hoàng Long',
      tag: '#1024',
      avatar: 'https://mc-heads.net/avatar/Steve/64',
      role: 'Điều Hành Viên',
      isMuted: false,
      isDeafened: false,
      isSpeaking: true,
      joinedAt: '10:00'
    },
    {
      id: 'mem_vip_1',
      name: 'Trần Mai Anh',
      tag: '#2048',
      avatar: 'https://mc-heads.net/avatar/Alex/64',
      role: 'VNRT Online VIP',
      isMuted: false,
      isDeafened: false,
      isSpeaking: false,
      joinedAt: '10:12'
    }
  ],
  'voice-watchparty': [
    {
      id: 'mem_user_1',
      name: 'Lê Minh Tuấn',
      tag: '#3312',
      avatar: 'https://mc-heads.net/avatar/MHO/64',
      role: 'Thành Viên',
      isMuted: true,
      isDeafened: false,
      isSpeaking: false,
      isScreenSharing: true,
      joinedAt: '09:40'
    }
  ],
  'voice-gaming': [],
  'voice-vip': []
};
