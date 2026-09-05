export type ChannelType = 'text' | 'voice';

export interface ChatChannel {
  id: string;
  name: string;
  type: ChannelType;
  topic?: string;
  category: 'text' | 'voice';
  unreadCount?: number;
  isLocked?: boolean;
}

export interface ChatReaction {
  emoji: string;
  count: number;
  users: string[]; // user ids
}

export interface ChatMessage {
  id: string;
  channelId: string;
  author: {
    id: string;
    name: string;
    tag: string;
    avatar: string;
    role: 'owner' | 'admin' | 'mod' | 'vip' | 'bot' | 'member';
    roleColor?: string;
    roleName?: string;
  };
  content: string;
  timestamp: string;
  reactions?: ChatReaction[];
  replyTo?: {
    authorName: string;
    content: string;
  };
  attachment?: {
    type: 'image' | 'video' | 'embed';
    url: string;
    title?: string;
  };
  isPinned?: boolean;
}

export interface VoiceParticipant {
  id: string;
  name: string;
  tag: string;
  avatar: string;
  role: string;
  isMuted: boolean;
  isDeafened: boolean;
  isSpeaking: boolean;
  isScreenSharing?: boolean;
  joinedAt: string;
}

export interface Member {
  id: string;
  name: string;
  tag: string;
  avatar: string;
  role: 'owner' | 'admin' | 'mod' | 'vip' | 'bot' | 'member';
  roleName: string;
  roleColor: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  activity?: string;
  customStatus?: string;
}
