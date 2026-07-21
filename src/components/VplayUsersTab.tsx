import React, { useState, useMemo } from "react";
import { 
  ArrowLeft, 
  Search, 
  Users, 
  UserCheck, 
  ShieldAlert, 
  User, 
  Calendar, 
  TrendingUp, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  CheckCircle, 
  Award,
  Clock,
  Briefcase,
  Mail,
  Fingerprint
} from "lucide-react";

interface VplayUser {
  id: number;
  name: string;
  username: string;
  userId: string;
  role: "VIP User" | "Moderator" | "Vplay Member";
  joinedDate: string;
  avatarColor: string;
  reputation: number;
  level: number;
  status: "Online" | "Offline" | "Idle";
}

interface VplayUsersTabProps {
  onBack: () => void;
  initialSearchQuery?: string;
}

export default function VplayUsersTab({ onBack, initialSearchQuery = "" }: VplayUsersTabProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [roleFilter, setRoleFilter] = useState<"All" | "VIP User" | "Moderator" | "Vplay Member">("All");
  const [statusFilter, setStatusFilter] = useState<"All" | "Online" | "Offline" | "Idle">("All");
  const [sortBy, setSortBy] = useState<"id_asc" | "id_desc" | "name_asc" | "name_desc" | "joined_newest" | "joined_oldest">("id_asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<VplayUser | null>(null);
  const itemsPerPage = 24;

  // Generate the high-fidelity 1000 users dataset
  const vplayUsers = useMemo<VplayUser[]>(() => {
    const list: VplayUser[] = [];
    const firstNames = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý"];
    const middleNames = ["Văn", "Thị", "Hữu", "Đức", "Minh", "Kim", "Anh", "Quốc", "Thành", "Ngọc", "Tuấn", "Thanh", "Hoài", "Khánh", "Xuân"];
    const lastNames = ["Hải", "Nam", "An", "Bình", "Chinh", "Cường", "Dũng", "Đông", "Giang", "Hà", "Hùng", "Huy", "Khoa", "Lâm", "Long", "Minh", "Phong", "Quân", "Sơn", "Tùng", "Vinh", "Vy", "Trang", "Linh", "Hương", "Lan", "Mai", "Cúc", "Trúc", "Đào"];
    
    const avatarGradients = [
      "from-indigo-500 to-purple-500",
      "from-teal-400 to-emerald-500",
      "from-blue-500 to-cyan-500",
      "from-rose-500 to-pink-500",
      "from-amber-400 to-orange-500",
      "from-violet-600 to-indigo-600",
      "from-fuchsia-500 to-purple-600"
    ];

    for (let i = 1; i <= 1000; i++) {
      const fn = firstNames[i % firstNames.length];
      const mn = middleNames[(i * 3) % middleNames.length];
      const ln = lastNames[(i * 7) % lastNames.length];
      const name = `${fn} ${mn} ${ln}`;
      
      const normalizedName = name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "d")
        .toLowerCase()
        .replace(/\s+/g, "");
      
      const username = `${normalizedName}_vplay${i}`;
      const randomSixDigits = String((123456 + i * 7654321) % 900000 + 100000);
      const userId = `V${randomSixDigits}`;
      
      const role = i % 25 === 0 ? "VIP User" : i % 100 === 0 ? "Moderator" : "Vplay Member";
      const month = String((i % 12) + 1).padStart(2, "0");
      const day = String((i % 28) + 1).padStart(2, "0");
      const joinedDate = `2024-${month}-${day}`;
      const avatarColor = avatarGradients[i % avatarGradients.length];
      
      const reputation = 150 + (i * 23) % 4800;
      const level = 1 + (i % 85);
      const statuses: ("Online" | "Offline" | "Idle")[] = ["Online", "Offline", "Idle"];
      const status = statuses[i % statuses.length];

      list.push({
        id: i,
        name,
        username,
        userId,
        role,
        joinedDate,
        avatarColor,
        reputation,
        level,
        status
      });
    }
    return list;
  }, []);

  // Compute metrics
  const metrics = useMemo(() => {
    const total = vplayUsers.length;
    const vips = vplayUsers.filter(u => u.role === "VIP User").length;
    const mods = vplayUsers.filter(u => u.role === "Moderator").length;
    const online = vplayUsers.filter(u => u.status === "Online").length;
    return { total, vips, mods, online };
  }, [vplayUsers]);

  // Filter & Sort logic
  const filteredUsers = useMemo(() => {
    let result = [...vplayUsers];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(u => 
        u.name.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.userId.toLowerCase().includes(q)
      );
    }

    // Role filter
    if (roleFilter !== "All") {
      result = result.filter(u => u.role === roleFilter);
    }

    // Status filter
    if (statusFilter !== "All") {
      result = result.filter(u => u.status === statusFilter);
    }

    // Sort logic
    result.sort((a, b) => {
      switch (sortBy) {
        case "id_desc":
          return b.id - a.id;
        case "name_asc":
          return a.name.localeCompare(b.name, "vi");
        case "name_desc":
          return b.name.localeCompare(a.name, "vi");
        case "joined_newest":
          return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime();
        case "joined_oldest":
          return new Date(a.joinedDate).getTime() - new Date(b.joinedDate).getTime();
        case "id_asc":
        default:
          return a.id - b.id;
      }
    });

    return result;
  }, [vplayUsers, searchQuery, roleFilter, statusFilter, sortBy]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 font-sans pb-24">
      {/* Top Banner / Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-30 px-4 py-4 sm:px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="p-2 rounded-xl hover:bg-zinc-800 text-zinc-300 transition-colors cursor-pointer border border-zinc-800"
            >
              <ArrowLeft className="w-4 h-4 text-white" />
            </button>
            <div className="text-left">
              <h1 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-red-500" />
                Tra cứu Thành viên Vplay
              </h1>
              <p className="text-xs text-zinc-400 font-medium">Tìm kiếm và quản lý thông tin tài khoản người dùng của hệ sinh thái Vplay</p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <div className="bg-zinc-800 border border-zinc-700/80 rounded-xl px-3 py-1.5 flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-zinc-300" />
              <div className="text-left">
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Tổng User</p>
                <p className="text-xs font-extrabold text-white">{metrics.total.toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-amber-950/20 border border-amber-800/30 rounded-xl px-3 py-1.5 flex items-center gap-2">
              <Award className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <div className="text-left">
                <p className="text-[9px] font-bold text-amber-500 uppercase tracking-wider">VIP Users</p>
                <p className="text-xs font-extrabold text-amber-400">{metrics.vips}</p>
              </div>
            </div>

            <div className="bg-purple-950/20 border border-purple-800/30 rounded-xl px-3 py-1.5 flex items-center gap-2">
              <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
              <div className="text-left">
                <p className="text-[9px] font-bold text-purple-400 uppercase tracking-wider">Moderators</p>
                <p className="text-xs font-extrabold text-purple-300">{metrics.mods}</p>
              </div>
            </div>

            <div className="bg-emerald-950/20 border border-emerald-850/30 rounded-xl px-3 py-1.5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <div className="text-left">
                <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">Online</p>
                <p className="text-xs font-extrabold text-emerald-300">{metrics.online}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-5">
          <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 shadow-lg space-y-5">
            <h3 className="text-sm font-bold text-white border-b border-zinc-800 pb-3 flex items-center justify-between">
              <span>Bộ lọc nâng cao</span>
              <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full font-mono">{filteredUsers.length}</span>
            </h3>

            {/* Role Filter */}
            <div className="space-y-2 text-left">
              <label className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider block">Vai trò / Cấp bậc</label>
              <div className="flex flex-col gap-1.5">
                {[
                  { value: "All", label: "Tất cả" },
                  { value: "VIP User", label: "VIP User" },
                  { value: "Moderator", label: "Moderator" },
                  { value: "Vplay Member", label: "Vplay Member" }
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => {
                      setRoleFilter(item.value as any);
                      setCurrentPage(1);
                    }}
                    className={`text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                      roleFilter === item.value 
                        ? "bg-[#cc1827] text-white shadow-lg shadow-red-900/20" 
                        : "bg-zinc-800 hover:bg-zinc-750 text-zinc-300"
                    }`}
                  >
                    <span>{item.label}</span>
                    {roleFilter === item.value && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-2 text-left">
              <label className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider block">Trạng thái Hoạt động</label>
              <div className="flex flex-col gap-1.5">
                {[
                  { value: "All", label: "Tất cả" },
                  { value: "Online", label: "Đang hoạt động" },
                  { value: "Idle", label: "Tạm vắng" },
                  { value: "Offline", label: "Ngoại tuyến" }
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => {
                      setStatusFilter(item.value as any);
                      setCurrentPage(1);
                    }}
                    className={`text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                      statusFilter === item.value 
                        ? "bg-[#cc1827] text-white shadow-lg shadow-red-900/20" 
                        : "bg-zinc-800 hover:bg-zinc-750 text-zinc-300"
                    }`}
                  >
                    <span>{item.label}</span>
                    {statusFilter === item.value && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Sorting Filter */}
            <div className="space-y-2 text-left">
              <label className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider block">Sắp xếp theo</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-zinc-800 border border-zinc-700/80 rounded-xl px-3 py-2.5 text-xs font-bold text-zinc-200 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              >
                <option value="id_asc" className="bg-zinc-900">ID: Tăng dần (Mặc định)</option>
                <option value="id_desc" className="bg-zinc-900">ID: Giảm dần</option>
                <option value="name_asc" className="bg-zinc-900">Tên: A - Z</option>
                <option value="name_desc" className="bg-zinc-900">Tên: Z - A</option>
                <option value="joined_newest" className="bg-zinc-900">Ngày tham gia: Mới nhất</option>
                <option value="joined_oldest" className="bg-zinc-900">Ngày tham gia: Cũ nhất</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Cards Grid */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Main Search Bar */}
          <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 shadow-md">
            <img src="https://static.wikia.nocookie.net/ep-deo/images/2/21/Searchhh.png/revision/latest/scale-to-width-down/1000?cb=20260717131751" className="w-5 h-5 shrink-0 object-contain" style={{ filter: "brightness(0) invert(1)" }} referrerPolicy="no-referrer" alt="Search" />
            <input
              type="text"
              placeholder="Nhập tên người dùng, username hoặc mã ID (ví dụ: V123456)..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="flex-1 bg-transparent border-none text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none font-medium text-left"
            />
            {searchQuery && (
              <button 
                onClick={handleClearSearch}
                className="text-zinc-400 hover:text-white cursor-pointer transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Users Grid */}
          {paginatedUsers.length === 0 ? (
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 py-16 text-center flex flex-col items-center justify-center p-6">
              <Users className="w-16 h-16 text-zinc-700 mb-4" />
              <h3 className="text-base font-bold text-zinc-200">Không tìm thấy người dùng nào</h3>
              <p className="text-xs text-zinc-400 max-w-sm mt-1">Vui lòng kiểm tra lại từ khóa tìm kiếm hoặc điều chỉnh các bộ lọc bên trái.</p>
              { (searchQuery || roleFilter !== "All" || statusFilter !== "All") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setRoleFilter("All");
                    setStatusFilter("All");
                  }}
                  className="mt-4 px-4 py-2 bg-[#cc1827] hover:bg-[#b01420] text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Đặt lại bộ lọc
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {paginatedUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className="bg-zinc-900/50 rounded-2xl border border-zinc-800/80 p-4 hover:border-red-500/50 hover:bg-zinc-900 transition-all cursor-pointer group flex flex-col justify-between h-40 shadow-sm text-left"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Avatar with dynamic initials */}
                      <div className={`w-11 h-11 rounded-full bg-gradient-to-tr ${user.avatarColor} flex items-center justify-center text-white text-xs font-black shadow-sm shrink-0 uppercase`}>
                        {user.name.split(" ").slice(-1)[0][0]}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-black text-zinc-100 truncate group-hover:text-red-400 transition-colors">
                          {user.name}
                        </h4>
                        <p className="text-[10px] text-zinc-400 truncate font-mono mt-0.5">@{user.username}</p>
                      </div>
                    </div>

                    <div className="shrink-0 flex flex-col items-end gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${
                        user.status === "Online" 
                          ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" 
                          : user.status === "Idle"
                          ? "bg-amber-400"
                          : "bg-zinc-600"
                      }`} />
                      <span className="text-[9px] font-mono font-bold bg-zinc-800 text-zinc-300 border border-zinc-700/40 px-1.5 py-0.5 rounded-md">
                        {user.userId}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-zinc-800 pt-3 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Cấp độ</span>
                      <span className="text-xs font-black text-zinc-200">Lv. {user.level}</span>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Cấp bậc</span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        user.role === "VIP User"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : user.role === "Moderator"
                            ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                            : "bg-zinc-800 text-zinc-400 border border-zinc-700/40"
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
              <p className="text-xs font-bold text-zinc-400 text-left">
                Hiển thị <span className="text-white">{(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> trên <span className="text-white font-extrabold">{filteredUsers.length}</span> người dùng
              </p>

              <div className="flex items-center gap-1.5 select-none">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                  className="px-2.5 py-1.5 bg-zinc-800 border border-zinc-700 text-xs font-bold rounded-lg hover:bg-zinc-700 disabled:opacity-40 disabled:hover:bg-zinc-800 text-zinc-200 transition-colors cursor-pointer shadow-sm"
                >
                  Đầu
                </button>
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="p-1.5 bg-zinc-800 border border-zinc-700 text-xs font-bold rounded-lg hover:bg-zinc-700 disabled:opacity-40 disabled:hover:bg-zinc-800 text-zinc-200 transition-colors cursor-pointer shadow-sm flex items-center"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1 mx-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
                    let pageNumber = currentPage;
                    if (currentPage <= 3) pageNumber = index + 1;
                    else if (currentPage >= totalPages - 2) pageNumber = totalPages - 4 + index;
                    else pageNumber = currentPage - 2 + index;

                    if (pageNumber > 0 && pageNumber <= totalPages) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`w-8 h-8 flex items-center justify-center text-xs font-black rounded-lg transition-colors cursor-pointer ${
                            currentPage === pageNumber
                              ? "bg-[#cc1827] text-white font-extrabold shadow-md shadow-red-900/30"
                              : "bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="p-1.5 bg-zinc-800 border border-zinc-700 text-xs font-bold rounded-lg hover:bg-zinc-700 disabled:opacity-40 disabled:hover:bg-zinc-800 text-zinc-200 transition-colors cursor-pointer shadow-sm flex items-center"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                  className="px-2.5 py-1.5 bg-zinc-800 border border-zinc-700 text-xs font-bold rounded-lg hover:bg-zinc-700 disabled:opacity-40 disabled:hover:bg-zinc-800 text-zinc-200 transition-colors cursor-pointer shadow-sm"
                >
                  Cuối
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[999] flex items-center justify-center p-4">
          <div 
            className="bg-zinc-900 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-zinc-800 animate-fade-in text-left flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header banner */}
            <div className={`h-24 bg-gradient-to-tr ${selectedUser.avatarColor} relative flex items-end px-6 pb-2 shrink-0`}>
              <button 
                onClick={() => setSelectedUser(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-black/25 text-white hover:bg-black/40 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute top-12 left-6">
                <div className={`w-20 h-20 rounded-full border-4 border-zinc-900 bg-gradient-to-tr ${selectedUser.avatarColor} flex items-center justify-center text-white text-3xl font-black shadow-md uppercase`}>
                  {selectedUser.name.split(" ").slice(-1)[0][0]}
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="px-6 pt-12 pb-6 space-y-5">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-white">{selectedUser.name}</h3>
                  <span className={`w-2 h-2 rounded-full ${
                    selectedUser.status === "Online" ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" : selectedUser.status === "Idle" ? "bg-amber-400" : "bg-zinc-600"
                  }`} />
                </div>
                <p className="text-xs text-zinc-400 font-mono">@{selectedUser.username}</p>
              </div>

              {/* Detailed Grid */}
              <div className="grid grid-cols-2 gap-3.5 bg-zinc-950 p-4 rounded-2xl border border-zinc-800/80">
                <div className="flex items-center gap-2.5">
                  <Fingerprint className="w-4 h-4 text-zinc-400" />
                  <div className="text-left">
                    <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Mã số ID</p>
                    <p className="text-xs font-bold text-white font-mono">{selectedUser.userId}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Briefcase className="w-4 h-4 text-zinc-400" />
                  <div className="text-left">
                    <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Cấp bậc</p>
                    <p className="text-xs font-bold text-white">{selectedUser.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <TrendingUp className="w-4 h-4 text-zinc-400" />
                  <div className="text-left">
                    <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Điểm tích lũy</p>
                    <p className="text-xs font-bold text-white font-mono">{selectedUser.reputation} XP</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-zinc-400" />
                  <div className="text-left">
                    <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Cấp độ Level</p>
                    <p className="text-xs font-bold text-white">Cấp {selectedUser.level}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 col-span-2 border-t border-zinc-800 pt-3 mt-1.5 text-left">
                  <Calendar className="w-4 h-4 text-zinc-400" />
                  <div>
                    <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Ngày đăng ký tham gia</p>
                    <p className="text-xs font-bold text-white">{new Date(selectedUser.joinedDate).toLocaleDateString("vi-VN", { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-xl transition-all cursor-pointer text-center"
                >
                  Đóng cửa sổ
                </button>
                <a
                  href={`mailto:${selectedUser.username}@vplay.vn`}
                  className="flex-1 py-2.5 bg-[#cc1827] hover:bg-[#b01420] text-white text-xs font-bold rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-2 shadow-md shadow-red-900/10"
                >
                  <Mail className="w-3.5 h-3.5 text-white" />
                  Gửi thư liên hệ
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
