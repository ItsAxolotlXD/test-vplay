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
  channelNumber?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  logo?: string;
  channels: Channel[];
}

const getLogoText = (name: string): string => {
  let clean = name;
  if (clean.includes(" - ")) {
    clean = clean.split(" - ")[1];
  } else {
    clean = clean.replace(/TRUYỀN HÌNH\s+/i, "");
    clean = clean.replace(/Truyền hình\s+/i, "");
  }
  if (clean.includes(" (")) {
    clean = clean.split(" (")[0];
  }
  return clean.trim();
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
export const processedChannels: Channel[] = rawChannels.map((ch: any) => {
  const isRadio = ch.group === "Radio" || !!ch.isRadio;
  return {
    id: ch.id,
    name: ch.name,
    url: ch.url,
    group: ch.group,
    logoText: getLogoText(ch.name),
    logoBg: getGradient(ch.group, ch.name),
    isRadio: isRadio,
    logoImg: ch.logo
  };
});

// Category template definitions
const categoryTemplates = [
  { id: "vtv", name: "Kênh VTV", description: "Các kênh sóng truyền hình quốc gia VTV", logo: "https://static.wikia.nocookie.net/logos/images/1/13/VTV_logo_%28b%E1%BA%A3n_2%29.png/revision/latest/scale-to-width-down/1000?cb=20240103140637&path-prefix=vi" },
  { id: "vtvcab", name: "Kênh VTVcab", description: "Kênh giải trí thể thao, phim ảnh tổng hợp đặc sắc", logo: "https://static.wikia.nocookie.net/logos/images/4/45/VTVcab_logo.png/revision/latest/scale-to-width-down/1000?cb=20230331092733&path-prefix=vi" },
  { id: "htv", name: "Kênh HTV", description: "Các kênh sóng truyền hình Đài Thành phố Hồ Chí Minh", logo: "https://static.wikia.nocookie.net/logos/images/d/dd/HTV_logo_2012_%281%29.png/revision/latest/scale-to-width-down/1000?cb=20231118121202&path-prefix=vi" },
  { id: "sctv", name: "Kênh SCTV", description: "Các kênh giải trí, khoa học và phim truyện SCTV cáp", logo: "https://static.wikia.nocookie.net/logos/images/1/15/SCTV.png/revision/latest/scale-to-width-down/1000?cb=20230624130447&path-prefix=vi" },
  { id: "thiet-yeu", name: "Kênh thiết yếu", description: "Truyền hình thiết yếu quốc gia", logo: "https://em-content.zobj.net/source/microsoft/379/check-mark-button_2705.png" },
  { id: "dia-phuong", name: "Kênh địa phương", description: "Truyền hình địa phương, liên tỉnh bản quyền", logo: "https://vectorflags.s3.amazonaws.com/flags/vn-wave-01.png" },
  { id: "quoc-te", name: "Kênh quốc tế", description: "Kênh tin tức thời sự thế giới, phim hoạt hình nổi tiếng nước ngoài", logo: "https://em-content.zobj.net/source/microsoft/379/globe-with-meridians_1f310.png" },
  { id: "phat-thanh-radio", name: "Kênh phát thanh", description: "Các đài phát thanh VOV, VOH, FM Giao thông đặc sắc" }
];

// Custom helper to provide specific custom sort order for local channels as requested by the user
function getSortName(name: string, id: string): string {
  // Group 1: Gia Lai & Dong Thap (GTV đặt trước THĐT1)
  if (id === "gia_lai") {
    return "Truyền hình Đồng Tháp - THĐT A_gia_lai";
  }
  if (id === "dong_thap_1") {
    return "Truyền hình Đồng Tháp - THĐT B_dong_thap_1";
  }
  if (id === "dong_thap_2") {
    return "Truyền hình Đồng Tháp - THĐT C_dong_thap_2";
  }

  // Group 2: Lao Cai & Lang Son (LSTV đặt sau Lào cai)
  if (id === "lao_cai") {
    return "Truyền hình Lào Cai - THLC A_lao_cai";
  }
  if (id === "lang_son") {
    return "Truyền hình Lào Cai - THLC B_lang_son";
  }

  // Group 3: Quang Ninh & Quang Ngai (QTV1 và 3 đặt trc qngtv1 và 2)
  if (id === "quang_ninh_1") {
    return "Truyền hình Quảng Ngãi - QNgTV A1_quang_ninh_1";
  }
  if (id === "quang_ninh_3") {
    return "Truyền hình Quảng Ngãi - QNgTV A2_quang_ninh_3";
  }
  if (id === "quang_ngai_1") {
    return "Truyền hình Quảng Ngãi - QNgTV B1_quang_ngai_1";
  }
  if (id === "quang_ngai_2") {
    return "Truyền hình Quảng Ngãi - QNgTV B2_quang_ngai_2";
  }

  // Group 4: Tay Ninh, Son La, Quang Tri (Tây ninh đặt trc QTTV, Snews đặt giữa tây ninh và QTTV)
  if (id === "tay_ninh") {
    return "Truyền hình Quảng Trị - QTTV A_tay_ninh";
  }
  if (id === "son_la") {
    return "Truyền hình Quảng Trị - QTTV B_son_la";
  }
  if (id === "quang_tri") {
    return "Truyền hình Quảng Trị - QTTV C_quang_tri";
  }

  // Group 5: Tuyen Quang, Thanh Hoa, Thai Nguyen (TTV Tuyên quang đặt trước thanh hóa, thái nguyên đặt sau 2 kênh TTV)
  if (id === "tuyen_quang") {
    return "Truyền hình Thái Nguyên - TN A_tuyen_quang";
  }
  if (id === "thanh_hoa") {
    return "Truyền hình Thái Nguyên - TN B_thanh_hoa";
  }
  if (id === "thai_nguyen") {
    return "Truyền hình Thái Nguyên - TN C_thai_nguyen";
  }

  // Group 6: Ha Noi & HueTV (HueTV đặt cạnh H2)
  if (id === "ha_noi_1") {
    return "Truyền hình Hà Nội - H1";
  }
  if (id === "ha_noi_2") {
    return "Truyền hình Hà Nội - H2";
  }
  if (id === "hue") {
    return "Truyền hình Hà Nội - H3_hue";
  }

  return name;
}

// Dynamically construct and populate categories based on channel groups
export const CATEGORIES: Category[] = categoryTemplates.map(tpl => {
  let matchedChannels: Channel[] = [];
  
  if (tpl.id === "vtv") {
    matchedChannels = processedChannels.filter(c => c.group === "VTV" && c.id !== "vtv5_tn" && c.id !== "vtv5_tnb");
  } else if (tpl.id === "vtvcab") {
    matchedChannels = processedChannels.filter(c => c.group === "VTVcab");
  } else if (tpl.id === "htv") {
    matchedChannels = processedChannels.filter(c => c.group === "HTV" || c.group === "HTVC");
  } else if (tpl.id === "sctv") {
    matchedChannels = processedChannels.filter(c => c.group === "SCTV");
  } else if (tpl.id === "thiet-yeu") {
    matchedChannels = processedChannels.filter(c => c.id === "antv_thiet_yeu" || c.id === "qpvn_thiet_yeu" || c.group === "Thiết yếu");
  } else if (tpl.id === "dia-phuong") {
    matchedChannels = processedChannels.filter(c => c.group === "Địa phương");
  } else if (tpl.id === "quoc-te") {
    matchedChannels = processedChannels.filter(c => c.group === "Quốc tế" || c.group === "World");
  } else if (tpl.id === "phat-thanh-radio") {
    matchedChannels = processedChannels.filter(c => c.isRadio);
  } else if (tpl.id === "thu-nghiem") {
    matchedChannels = processedChannels.filter(c => c.group === "Thử nghiệm");
  }

  // Auto clean names and append HD appropriately
  const formattedChannels = matchedChannels.map(ch => {
    let cleanName = ch.name;
    const nameUpper = cleanName.toUpperCase();
    if (!nameUpper.endsWith("HD") && !nameUpper.includes(" HD") && !ch.isRadio && tpl.id !== "thu-nghiem") {
      cleanName = `${cleanName.trim()} HD`;
    }
    return { ...ch, name: cleanName };
  });

  // Sort alphabetically from A-Z for local and essential categories
  if (tpl.id === "dia-phuong" || tpl.id === "thiet-yeu") {
    formattedChannels.sort((a, b) => getSortName(a.name, a.id).localeCompare(getSortName(b.name, b.id), "vi"));
  }

  return {
    ...tpl,
    channels: formattedChannels
  };
});

// Assign channel position numbers in the format xxx
const SPECIAL_VTV_NUMBERS: Record<string, string> = {
  vtv1: "001",
  vtv2: "002",
  vtv3: "003",
  vtv4: "004",
  vtv5: "005",
  vtv6: "006",
  vtv7: "007",
  vtv8: "008",
  vtv9: "009",
  vtv10: "010",
  vtv5_tnb: "011",
  vtv5_tn: "012",
};

let nextNum = 13;

// First pass: assign numbers to all channels inside categories
CATEGORIES.forEach(category => {
  category.channels.forEach(ch => {
    if (SPECIAL_VTV_NUMBERS[ch.id]) {
      ch.channelNumber = SPECIAL_VTV_NUMBERS[ch.id];
    } else {
      ch.channelNumber = String(nextNum).padStart(3, '0');
      nextNum++;
    }
  });
});

// Assign numbers to the raw processedChannels for consistency
processedChannels.forEach(ch => {
  if (SPECIAL_VTV_NUMBERS[ch.id]) {
    ch.channelNumber = SPECIAL_VTV_NUMBERS[ch.id];
  } else {
    // Match the number already assigned in CATEGORIES
    const matched = CATEGORIES.flatMap(cat => cat.channels).find(c => c.id === ch.id);
    if (matched && matched.channelNumber) {
      ch.channelNumber = matched.channelNumber;
    } else {
      ch.channelNumber = String(nextNum).padStart(3, '0');
      nextNum++;
    }
  }
});

// Explicitly ensure the VTV5 subchannels are correctly numbered in processedChannels
const tnbChan = processedChannels.find(c => c.id === "vtv5_tnb");
if (tnbChan) tnbChan.channelNumber = "011";
const tnChan = processedChannels.find(c => c.id === "vtv5_tn");
if (tnChan) tnChan.channelNumber = "012";
