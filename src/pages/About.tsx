import React from 'react';
import { Sparkles, Shield, Heart, Radio, Tv, Users, ExternalLink, Code2, Globe } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      {/* Hero Intro */}
      <div className="text-center space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E50914]/15 border border-[#E50914]/30 text-[#E50914] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Về Waves Community</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
          Nơi Lưu Giữ & Tôn Vinh <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2020] via-[#FF3366] to-[#E50914]">
            Văn Hóa Truyền Hình Việt Nam
          </span>
        </h1>

        <p className="text-sm sm:text-base text-[#9CA3AF] max-w-2xl mx-auto leading-relaxed">
          Waves Community là nền tảng phi lợi nhuận dành cho những người đam mê truyền hình, công nghệ phát sóng, thiết kế motion graphics idents và lưu trữ lịch sử báo chí truyền thông.
        </p>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-[28px] bg-[#1E1E22] border border-[#2D2D35] space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FF2020]/20 text-[#FF2020] flex items-center justify-center">
            <Radio className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Tiếp Sóng Trực Tiếp</h3>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            Hạ tầng trình phát HLS chất lượng cao, tiếp sóng các kênh truyền hình thiết yếu quốc gia và địa phương theo thời gian thực.
          </p>
        </div>

        <div className="p-6 rounded-[28px] bg-[#1E1E22] border border-[#2D2D35] space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#E50914]/20 text-[#E50914] flex items-center justify-center">
            <Tv className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Lưu Trữ & Tư Liệu</h3>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            Lưu giữ hình ảnh nhận diện, idents lịch sử, trường quay và các cột mốc công nghệ phát sóng của các đài truyền hình qua các thời kỳ.
          </p>
        </div>

        <div className="p-6 rounded-[28px] bg-[#1E1E22] border border-[#2D2D35] space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#00E5FF]/20 text-[#00E5FF] flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Cộng Đồng Đam Mê</h3>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            Không gian kết nối những người làm nghề truyền hình, kỹ sư phát sóng, đồ họa truyền hình và khán giả yêu mến màn ảnh nhỏ.
          </p>
        </div>
      </div>

      {/* Disclaimer and Ethics Card */}
      <div className="p-8 rounded-[30px] bg-gradient-to-br from-[#1E1E24] to-[#161618] border border-[#34343E] shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-[#E50914]" />
          <h3 className="text-lg font-bold text-white">Tuyên bố bản quyền & Nguồn phát sóng</h3>
        </div>
        <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
          Tất cả logo, nhãn hiệu truyền hình, hình ảnh trường quay và luồng phát sóng thuộc quyền sở hữu trí tuệ của các Đài Truyền hình (Đài Truyền hình Việt Nam VTV, Đài Truyền hình TP.HCM HTV, Đài Truyền hình Kỹ thuật số VTC và các Đài PT-TH địa phương). Waves Community phục vụ mục đích nghiên cứu, học thuật, hỗ trợ kỹ thuật và phi thương mại.
        </p>
      </div>

      {/* Community Connect */}
      <div className="text-center p-8 rounded-[30px] bg-[#1E1E22] border border-[#2D2D35] space-y-4">
        <h3 className="text-xl font-bold text-white">Tham gia cùng Waves Community</h3>
        <p className="text-xs sm:text-sm text-[#9CA3AF] max-w-lg mx-auto">
          Cùng trao đổi về kỹ thuật trường quay ảo, tần số DVB-T2, đồ họa nhận diện On-Air Graphics và chia sẻ tư liệu truyền hình quý giá.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href="https://discord.gg/wcdjaDDayK"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-bold shadow-lg transition-all"
          >
            <span>Tham gia Discord Cộng Đồng</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#24242A] hover:bg-[#2F2F36] text-white text-xs font-bold border border-[#3A3A44] transition-all"
          >
            <span>Facebook Group Truyền Hình</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
