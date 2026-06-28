import rawChannels from "./channels.json";

export interface Channel {
  id: string;
  name: string;
  url: string;
  group: string;
  logoText: string;
  logoBg: string; // Tailwind class, e.g. "bg-red-600"
  userAgent?: string;
  isRadio?: boolean;
  logoImg?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  channels: Channel[];
}

const getLogoText = (name: string): string => {
  let clean = name.replace(/TRUYỀN HÌNH\s+/i, "");
  clean = clean.replace(/Truyền hình\s+/i, "");
  if (clean.includes(" (")) {
    clean = clean.split(" (")[0];
  }
  return clean.substring(0, 10).trim();
};

const getGradient = (group: string, name: string): string => {
  const lowerG = group.toLowerCase();
  const lowerN = name.toLowerCase();
  if (lowerG.includes("vtv")) {
    if (lowerN.includes("1")) return "bg-gradient-to-br from-red-600 to-red-800";
    if (lowerN.includes("2")) return "bg-gradient-to-br from-purple-600 to-purple-800";
    if (lowerN.includes("3")) return "bg-gradient-to-br from-blue-600 to-blue-800";
    if (lowerN.includes("4")) return "bg-gradient-to-br from-teal-600 to-teal-800";
    if (lowerN.includes("5")) return "bg-gradient-to-br from-emerald-600 to-emerald-800";
    return "bg-gradient-to-br from-red-500 to-orange-600";
  }
  if (lowerG.includes("vtvcab")) {
    return "bg-gradient-to-br from-fuchsia-600 to-pink-700";
  }
  if (lowerG.includes("htv")) {
    return "bg-gradient-to-br from-blue-600 to-indigo-800";
  }
  if (lowerG.includes("sctv")) {
    return "bg-gradient-to-br from-rose-600 to-blue-800";
  }
  if (lowerG.includes("radio")) {
    return "bg-gradient-to-br from-red-500 to-pink-600";
  }
  if (lowerG.includes("quốc tế") || lowerG.includes("world")) {
    return "bg-gradient-to-br from-neutral-800 to-stone-900";
  }
  return "bg-gradient-to-br from-teal-500 to-cyan-700";
};

// Map raw channels list to our required application structure
export const getChannelKeyName = (name: string, group: string): string => {
  let clean = name;
  
  // Remove content in parenthesis like (ANTV), (Radio), etc.
  clean = clean.replace(/\([^)]*\)/g, "");

  // Strip "TRUYỀN HÌNH", "Truyền hình", "Kênh ", "KÊNH "
  clean = clean.replace(/TRUYỀN HÌNH\s+/i, "");
  clean = clean.replace(/Truyền hình\s+/i, "");
  clean = clean.replace(/Kênh\s+/i, "");
  clean = clean.replace(/KÊNH\s+/i, "");
  
  // Strip suffix " HD"
  clean = clean.replace(/\s+HD$/i, "");
  
  // Split on " / " or " - " and take the first part
  if (clean.includes(" / ")) {
    clean = clean.split(" / ")[0];
  }
  if (clean.includes(" - ")) {
    clean = clean.split(" - ")[0];
  }

  // Remove accents
  let normalized = clean
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");

  // Keep only alphanumeric characters and spaces
  normalized = normalized.replace(/[^a-zA-Z0-9\s]/g, "");

  // Split into words
  const words = normalized.trim().split(/\s+/);
  
  const keyName = words.map(word => {
    if (!word) return "";
    const upperWord = word.toUpperCase();
    const keepUpper = ["VTV", "HTV", "HTVC", "SCTV", "VOV", "TV", "FM", "ON", "CNN", "BBC", "KBS", "NHK", "CNBC", "KIX", "CNA", "AFN"];
    if (keepUpper.includes(upperWord)) {
      return upperWord;
    }
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join("");

  return `live_feed.${keyName || "Channel"}.name`;
};

export const processedChannels: Channel[] = rawChannels.map((ch: any) => {
  const isRadio = ch.group === "Radio" || !!ch.isRadio;
  let logoImg = ch.logo;
  if (ch.id === "vtv1") {
    logoImg = "https://static.wikia.nocookie.net/ep-deo/images/0/0a/V1_HD.png/revision/latest/scale-to-width-down/180?cb=20260625102216";
  } else if (ch.id === "vtv2") {
    logoImg = "https://static.wikia.nocookie.net/ep-deo/images/7/7c/V2_HD.png/revision/latest/scale-to-width-down/180?cb=20260625102502";
  } else if (ch.id === "vtv3") {
    logoImg = "https://static.wikia.nocookie.net/ep-deo/images/1/12/VTV3_HD.png/revision/latest/scale-to-width-down/180?cb=20260625102733";
  } else if (ch.id === "vtv4") {
    logoImg = "https://static.wikia.nocookie.net/ep-deo/images/5/5d/4_hd.png/revision/latest/scale-to-width-down/180?cb=20260625103218";
  } else if (ch.id === "vtv5") {
    logoImg = "https://static.wikia.nocookie.net/ep-deo/images/4/4c/5_HD.png/revision/latest?cb=20260625104022";
  } else if (ch.id === "vtv6") {
    logoImg = "https://static.wikia.nocookie.net/ep-deo/images/6/6a/VTV6_HD.png/revision/latest/scale-to-width-down/180?cb=20260625104230";
  } else if (ch.id === "vtv7") {
    logoImg = "https://static.wikia.nocookie.net/ep-deo/images/6/6a/VTV6_HD.png/revision/latest/scale-to-width-down/180?cb=20260625104230";
  } else if (ch.id === "vtv8") {
    logoImg = "https://static.wikia.nocookie.net/ep-deo/images/a/ac/V8_HD.png/revision/latest/scale-to-width-down/180?cb=20260625104830";
  } else if (ch.id === "vtv9") {
    logoImg = "https://static.wikia.nocookie.net/ep-deo/images/2/25/9_HD.png/revision/latest/scale-to-width-down/180?cb=20260625105022";
  } else if (ch.id === "vtv10") {
    logoImg = "https://static.wikia.nocookie.net/ep-deo/images/3/38/CHD.png/revision/latest/scale-to-width-down/180?cb=20260625105355";
  }

  return {
    id: ch.id,
    name: getChannelKeyName(ch.name, ch.group),
    url: ch.url,
    group: ch.group,
    logoText: getLogoText(ch.name),
    logoBg: getGradient(ch.group, ch.name),
    isRadio: isRadio,
    logoImg: logoImg
  };
});

const vtv6TestChannel: Channel = {
  id: "vtv6_test",
  name: "live_feed.VTV6Test.name",
  url: "#testcard",
  group: "VTV",
  logoText: "VTV6 TN",
  logoBg: "bg-gradient-to-br from-indigo-600 to-indigo-800",
  isRadio: false,
  logoImg: "https://static.wikia.nocookie.net/ep-deo/images/6/62/6_th%E1%BB%AD_nghi%E1%BB%87m.png/revision/latest/scale-to-width-down/180?cb=20260625124449"
};

const vtvgoChannels: Channel[] = Array.from({ length: 8 }, (_, i) => {
  const index = i + 1;
  return {
    id: `vtvgo_${index}`,
    name: `live_feed.VTVgo${index}.name`,
    url: "#testcard",
    group: "Đặc biệt",
    logoText: `VTVgo ${index}`,
    logoBg: "bg-gradient-to-br from-red-600 to-indigo-800",
    isRadio: false,
    logoImg: "https://static.wikia.nocookie.net/ep-deo/images/6/64/Vtv_s%E1%BB%A7a.png/revision/latest?cb=20260625120702"
  };
});

const vietnamWildLiveChannel: Channel = {
  id: "vietnam-wild-live",
  name: "live_feed.VietnamWildLive.name",
  url: "https://events.vtvdigital.vn/livestream/wildlife-720p50fps.m3u8",
  group: "Đặc biệt",
  logoText: "Wild LIVE",
  logoBg: "bg-gradient-to-br from-emerald-600 to-green-800",
  isRadio: false,
  logoImg: "https://static.wikia.nocookie.net/ep-deo/images/6/64/Vtv_s%E1%BB%A7a.png/revision/latest?cb=20260625120702"
};

// Category template definitions
const categoryTemplates = [
  { id: "dac-biet", name: "home.categories.Special.name", description: "Các sự kiện và luồng phát đặc biệt" },
  { id: "vtv", name: "home.categories.VTV.name", description: "Các kênh sóng truyền hình quốc gia VTV" },
  { id: "vtvcab", name: "home.categories.VTVCab.name", description: "Kênh giải trí thể thao, phim ảnh tổng hợp đặc sắc" },
  { id: "htv", name: "home.categories.HTV.name", description: "Các kênh sóng truyền hình Đài Thành phố Hồ Chí Minh" },
  { id: "sctv", name: "home.categories.SCTV.name", description: "Các kênh giải trí, khoa học và phim truyện SCTV cáp" },
  { id: "dia-phuong", name: "home.categories.Local.name", description: "Truyền hình địa phương, kênh liên tỉnh bản quyền" },
  { id: "quoc-te", name: "home.categories.International.name", description: "Kênh tin tức thời sự thế giới, phim hoạt hình nổi tiếng nước ngoài" },
  { id: "phat-thanh-radio", name: "home.categories.Radio.name", description: "Các đài phát thanh VOV, VOH, FM Giao thông đặc sắc" },
  { id: "thu-nghiem", name: "home.categories.Experimental.name", description: "Kênh truyền hình thử nghiệm luồng phát kỹ thuật" }
];

// Dynamically construct and populate categories based on channel groups
export const CATEGORIES: Category[] = categoryTemplates.map(tpl => {
  let matchedChannels: Channel[] = [];
  
  if (tpl.id === "dac-biet") {
    matchedChannels = [vietnamWildLiveChannel, ...vtvgoChannels];
  } else if (tpl.id === "vtv") {
    const vtvList = processedChannels.filter(c => c.group === "VTV" && c.id !== "vtv5_tn" && c.id !== "vtv5_tnb");
    const vtv6Index = vtvList.findIndex(c => c.id === "vtv6");
    if (vtv6Index !== -1) {
      matchedChannels = [
        ...vtvList.slice(0, vtv6Index + 1),
        vtv6TestChannel,
        ...vtvList.slice(vtv6Index + 1)
      ];
    } else {
      matchedChannels = [...vtvList, vtv6TestChannel];
    }
  } else if (tpl.id === "vtvcab") {
    matchedChannels = processedChannels.filter(c => c.group === "VTVcab");
  } else if (tpl.id === "htv") {
    matchedChannels = processedChannels.filter(c => c.group === "HTV" || c.group === "HTVC");
  } else if (tpl.id === "sctv") {
    matchedChannels = processedChannels.filter(c => c.group === "SCTV");
  } else if (tpl.id === "dia-phuong") {
    matchedChannels = processedChannels.filter(c => c.group === "Địa phương" || c.group === "Thiết yếu");
  } else if (tpl.id === "quoc-te") {
    matchedChannels = processedChannels.filter(c => c.group === "Quốc tế" || c.group === "World");
  } else if (tpl.id === "phat-thanh-radio") {
    matchedChannels = processedChannels.filter(c => c.isRadio);
  } else if (tpl.id === "thu-nghiem") {
    matchedChannels = processedChannels.filter(c => c.group === "Thử nghiệm");
  }

  // Auto clean names and append HD appropriately
  const formattedChannels = matchedChannels.map(ch => {
    if (ch.name.startsWith("live_feed.")) {
      return ch;
    }
    let cleanName = ch.name;
    const nameUpper = cleanName.toUpperCase();
    if (!nameUpper.endsWith("HD") && !nameUpper.includes(" HD") && !ch.isRadio && tpl.id !== "thu-nghiem" && tpl.id !== "dac-biet") {
      cleanName = `${cleanName.trim()} HD`;
    }
    return { ...ch, name: cleanName };
  });

  return {
    ...tpl,
    channels: formattedChannels
  };
});
