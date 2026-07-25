import React, { useState, useEffect } from "react";
import { playSynthSound } from "../../utils/audio";
import {
  CreditCard,
  Send,
  QrCode,
  History,
  PiggyBank,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  Check,
  X,
  Search,
  Lock,
  Sparkles,
  Smartphone,
  Eye,
  EyeOff,
  Building2,
  Copy,
  GraduationCap,
  Gem,
  ArrowRightLeft
} from "lucide-react";

export interface Transaction {
  id: string;
  type: "income" | "expense" | "transfer" | "convert";
  title: string;
  amount: number;
  date: string;
  recipientAccount?: string;
  bankName?: string;
  status: "success" | "pending" | "failed";
}

export const VBankTab: React.FC = () => {
  const [balance, setBalance] = useState<number>(128500000);
  const [showBalance, setShowBalance] = useState<boolean>(true);
  const [activeSubTab, setActiveSubTab] = useState<"dashboard" | "transfer" | "vlearn" | "qr" | "savings" | "history">("dashboard");

  // V-Learn Points & V-Pearls state
  const [studyPoints, setStudyPoints] = useState<number>(() => {
    const saved = localStorage.getItem("vlearn_study_points");
    return saved ? parseInt(saved) : 2500;
  });

  const [vPearls, setVPearls] = useState<number>(() => {
    const saved = localStorage.getItem("vplay_vpearls");
    return saved ? parseInt(saved) : 1200;
  });

  const [convertInput, setConvertInput] = useState<string>("");
  const [convertSuccessMsg, setConvertSuccessMsg] = useState<string>("");

  useEffect(() => {
    localStorage.setItem("vlearn_study_points", studyPoints.toString());
  }, [studyPoints]);

  useEffect(() => {
    localStorage.setItem("vplay_vpearls", vPearls.toString());
  }, [vPearls]);

  // Sync points from V-Learn exercises dynamically
  useEffect(() => {
    const syncPoints = () => {
      const saved = localStorage.getItem("vlearn_study_points");
      if (saved) {
        setStudyPoints(parseInt(saved));
      }
    };
    window.addEventListener("vlearn_points_updated", syncPoints);
    window.addEventListener("storage", syncPoints);
    return () => {
      window.removeEventListener("vlearn_points_updated", syncPoints);
      window.removeEventListener("storage", syncPoints);
    };
  }, []);

  // Transfer Form State
  const [recipientBank, setRecipientBank] = useState("V-Bank (Nội bộ Vplay)");
  const [recipientAccount, setRecipientAccount] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferMessage, setTransferMessage] = useState("Vplay Chuyển tiền");
  const [isVerifyingRecipient, setIsVerifyingRecipient] = useState(false);
  const [showOreConfirmDialog, setShowOreConfirmDialog] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState(false);

  // Savings State
  const [savingsVault, setSavingsVault] = useState<number>(45000000);
  const [depositAmount, setDepositAmount] = useState("");

  // History State
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "tx-100",
      type: "convert",
      title: "Quy đổi 500 Điểm V-Learn ➔ 50 V-Pearls (Ngọc Vplay)",
      amount: 50,
      date: "2026-07-24 10:15",
      status: "success"
    },
    {
      id: "tx-101",
      type: "income",
      title: "Nhận tiền thưởng Vplay Verified VIP Partner",
      amount: 15000000,
      date: "2026-07-24 08:20",
      status: "success"
    },
    {
      id: "tx-102",
      type: "expense",
      title: "Gia hạn gói Vplay Premium Cloud VIP (1 Năm)",
      amount: 2400000,
      date: "2026-07-23 14:10",
      status: "success"
    },
    {
      id: "tx-103",
      type: "transfer",
      title: "Chuyển tiền cho NGUYEN VAN A",
      amount: 5000000,
      date: "2026-07-22 19:45",
      recipientAccount: "8888999912",
      bankName: "Vietcombank",
      status: "success"
    }
  ]);

  const [copiedAccount, setCopiedAccount] = useState(false);

  const formatVND = (num: number) => {
    return num.toLocaleString("vi-VN") + " ₫";
  };

  const handleLookupRecipient = (acc: string) => {
    setRecipientAccount(acc);
    if (acc.length >= 8) {
      setIsVerifyingRecipient(true);
      setTimeout(() => {
        setIsVerifyingRecipient(false);
        setRecipientName("TRAN THI PHUONG THAO");
      }, 600);
    } else {
      setRecipientName("");
    }
  };

  const handleExecuteTransfer = () => {
    const amt = parseFloat(transferAmount);
    if (!amt || amt <= 0 || amt > balance) return;

    setBalance((prev) => prev - amt);
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: "transfer",
      title: `Chuyển tiền cho ${recipientName || recipientAccount}`,
      amount: amt,
      date: new Date().toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      }),
      recipientAccount,
      bankName: recipientBank,
      status: "success"
    };
    setTransactions([newTx, ...transactions]);
    setShowOreConfirmDialog(false);
    setTransferSuccess(true);
  };

  const handleDepositSavings = () => {
    const amt = parseFloat(depositAmount);
    if (!amt || amt <= 0 || amt > balance) return;
    setBalance((prev) => prev - amt);
    setSavingsVault((prev) => prev + amt);
    setDepositAmount("");
  };

  const handleConvertPointsToPearls = () => {
    const pts = parseInt(convertInput);
    if (isNaN(pts) || pts <= 0 || pts > studyPoints) return;

    // Rate: 10 Study Points = 1 V-Pearl
    const pearlsEarned = Math.floor(pts / 10);
    if (pearlsEarned <= 0) return;

    const actualPointsUsed = pearlsEarned * 10;
    setStudyPoints((prev) => prev - actualPointsUsed);
    setVPearls((prev) => prev + pearlsEarned);

    // Play conversion crystal sound effect
    playSynthSound("convert_pearls");

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: "convert",
      title: `Quy đổi ${actualPointsUsed} Điểm V-Learn ➔ ${pearlsEarned} V-Pearls`,
      amount: pearlsEarned,
      date: new Date().toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      }),
      status: "success"
    };
    setTransactions([newTx, ...transactions]);
    setConvertSuccessMsg(`Quy đổi thành công ${actualPointsUsed} điểm học tập thành ${pearlsEarned} V-Pearls!`);
    setConvertInput("");
    setTimeout(() => setConvertSuccessMsg(""), 4000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-6 text-white font-sans">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 p-6 rounded-3xl bg-gradient-to-r from-amber-950/70 via-zinc-900 to-black border border-amber-500/40 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl shadow-lg shadow-amber-500/20 text-black font-black">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-amber-300 uppercase">
                V-Bank Digital Wallet
              </h1>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-400 text-black font-black uppercase tracking-wider">
                Verified Exclusive
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Hệ thống tài chính kỹ thuật số tích hợp quy đổi điểm học tập V-Learn thành V-Pearls (Ngọc Vplay).
            </p>
          </div>
        </div>

        {/* Quick Tabs Bar */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-900 border border-amber-500/30 rounded-2xl overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveSubTab("dashboard")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === "dashboard"
                ? "bg-amber-500 text-black font-black shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Tổng quan
          </button>
          <button
            onClick={() => setActiveSubTab("vlearn")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === "vlearn"
                ? "bg-gradient-to-r from-amber-400 to-cyan-400 text-black font-black shadow-md"
                : "text-cyan-300 hover:text-white"
            }`}
          >
            <Gem className="w-3.5 h-3.5 text-cyan-500 fill-cyan-400" /> Quy đổi V-Learn
          </button>
          <button
            onClick={() => setActiveSubTab("transfer")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === "transfer"
                ? "bg-amber-500 text-black font-black shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Chuyển tiền
          </button>
          <button
            onClick={() => setActiveSubTab("qr")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === "qr"
                ? "bg-amber-500 text-black font-black shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Mã QR
          </button>
          <button
            onClick={() => setActiveSubTab("savings")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === "savings"
                ? "bg-amber-500 text-black font-black shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Tiết kiệm
          </button>
          <button
            onClick={() => setActiveSubTab("history")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === "history"
                ? "bg-amber-500 text-black font-black shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Lịch sử
          </button>
        </div>
      </div>

      {/* SUB TAB: DASHBOARD */}
      {activeSubTab === "dashboard" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Card & Balance Overview */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Virtual Card (Ore UI Platinum Styling) */}
            <div className="relative h-56 w-full rounded-3xl p-6 bg-gradient-to-br from-zinc-900 via-amber-950 to-zinc-950 border border-amber-500/50 shadow-2xl flex flex-col justify-between overflow-hidden group">
              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all" />

              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-amber-300 tracking-wider uppercase">
                    V-BANK
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold">
                    PLATINUM VIP
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>

              <div className="z-10">
                <div className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest mb-1">
                  Số tài khoản V-Bank
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xl font-mono tracking-widest font-black text-white">
                    8888 9999 6868
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText("888899996868");
                      setCopiedAccount(true);
                      setTimeout(() => setCopiedAccount(false), 2000);
                    }}
                    className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-amber-300 transition-all cursor-pointer"
                  >
                    {copiedAccount ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-end justify-between z-10 border-t border-white/10 pt-3">
                <div>
                  <div className="text-[9px] text-zinc-400 uppercase font-semibold">Chủ tài khoản</div>
                  <div className="text-xs font-bold uppercase text-amber-200">HOANG VAN VPLAY</div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] text-zinc-400 uppercase font-semibold">Hạn thẻ</div>
                  <div className="text-xs font-mono font-bold text-amber-200">12/30</div>
                </div>
              </div>
            </div>

            {/* V-Pearls & V-Learn Quick Exchange Box */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-cyan-950/60 via-zinc-900 to-black border border-cyan-500/40 shadow-xl flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Gem className="w-5 h-5 text-cyan-400 fill-cyan-400 animate-bounce" />
                  <span className="text-xs font-black uppercase text-cyan-300 tracking-wider">
                    V-Pearls (Ngọc Vplay)
                  </span>
                </div>
                <div className="text-2xl font-black font-mono text-cyan-200">
                  {vPearls.toLocaleString()} <span className="text-xs font-normal text-cyan-400">Pearls</span>
                </div>
                <div className="text-[11px] text-zinc-400 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-400" /> Điểm V-Learn hiện có: <b className="text-white font-mono">{studyPoints} điểm</b>
                </div>
              </div>

              <button
                onClick={() => setActiveSubTab("vlearn")}
                className="px-4 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
              >
                <ArrowRightLeft className="w-4 h-4" /> Quy Đổi
              </button>
            </div>

            {/* Balance Card */}
            <div className="bg-[#18181c] border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Số dư khả dụng
                </span>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-zinc-300 transition-all cursor-pointer"
                >
                  {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="text-3xl font-black text-amber-400 tracking-tight mb-4">
                {showBalance ? formatVND(balance) : "•••••••••••• ₫"}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => setActiveSubTab("transfer")}
                  className="flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase rounded-2xl shadow-lg transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" /> Chuyển tiền
                </button>
                <button
                  onClick={() => setActiveSubTab("qr")}
                  className="flex items-center justify-center gap-2 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase rounded-2xl border border-white/10 transition-all cursor-pointer"
                >
                  <QrCode className="w-4 h-4" /> Quét QR
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats & Recent Activity */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#18181c] border border-white/10 rounded-3xl p-5 flex items-center gap-4 shadow-xl">
                <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
                  <ArrowDownLeft className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[11px] text-zinc-400 font-semibold uppercase">Tổng nhận tháng này</div>
                  <div className="text-lg font-black text-emerald-400">{formatVND(15000000)}</div>
                </div>
              </div>

              <div className="bg-[#18181c] border border-white/10 rounded-3xl p-5 flex items-center gap-4 shadow-xl">
                <div className="p-3 bg-red-500/20 text-red-400 rounded-2xl border border-red-500/30">
                  <ArrowUpRight className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[11px] text-zinc-400 font-semibold uppercase">Tổng chi tháng này</div>
                  <div className="text-lg font-black text-red-400">{formatVND(7400000)}</div>
                </div>
              </div>
            </div>

            {/* Recent Transactions List */}
            <div className="bg-[#18181c] border border-white/10 rounded-3xl p-6 shadow-xl flex-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <History className="w-4 h-4 text-amber-400" /> Biến động tài khoản gần đây
                </h3>
                <button
                  onClick={() => setActiveSubTab("history")}
                  className="text-xs text-amber-400 hover:underline font-bold"
                >
                  Xem tất cả
                </button>
              </div>

              <div className="space-y-3">
                {transactions.slice(0, 4).map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3.5 rounded-2xl bg-zinc-900/60 border border-white/5 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2.5 rounded-xl border ${
                          tx.type === "income" || tx.type === "convert"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-red-500/10 text-red-400 border-red-500/30"
                        }`}
                      >
                        {tx.type === "convert" ? (
                          <Gem className="w-4 h-4 text-cyan-400" />
                        ) : tx.type === "income" ? (
                          <ArrowDownLeft className="w-4 h-4" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{tx.title}</div>
                        <div className="text-[10px] text-zinc-500">{tx.date}</div>
                      </div>
                    </div>

                    <div
                      className={`text-sm font-black font-mono ${
                        tx.type === "convert"
                          ? "text-cyan-400"
                          : tx.type === "income"
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {tx.type === "convert" ? `+${tx.amount} Pearls` : tx.type === "income" ? `+${formatVND(tx.amount)}` : `-${formatVND(tx.amount)}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB: V-LEARN EXCHANGE */}
      {activeSubTab === "vlearn" && (
        <div className="max-w-2xl mx-auto bg-[#18181c] border border-cyan-500/30 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl text-black font-black">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
                Quy Đổi Điểm Học Tập V-Learn ➔ V-Pearls
              </h2>
              <p className="text-xs text-zinc-400">
                Đổi thành tích học tập từ ứng dụng V-Learn lấy Ngọc Vplay (V-Pearls) sử dụng cho toàn hệ thống Vplay Verified.
              </p>
            </div>
          </div>

          {/* Current Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-zinc-900 border border-blue-500/30 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-zinc-400 uppercase">Điểm Học Tập V-Learn</span>
                <div className="text-2xl font-black font-mono text-blue-400">{studyPoints.toLocaleString()} Điểm</div>
              </div>
              <GraduationCap className="w-8 h-8 text-blue-500/50" />
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900 border border-cyan-500/30 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-zinc-400 uppercase">Sở Hữu V-Pearls</span>
                <div className="text-2xl font-black font-mono text-cyan-300">{vPearls.toLocaleString()} Pearls</div>
              </div>
              <Gem className="w-8 h-8 text-cyan-500/50 fill-cyan-500/20" />
            </div>
          </div>

          {/* Rate Policy Box */}
          <div className="p-4 bg-cyan-950/30 border border-cyan-500/20 rounded-2xl text-xs text-cyan-200 flex items-center justify-between font-mono">
            <span>Tỷ lệ quy đổi chuẩn:</span>
            <span className="font-extrabold text-cyan-400">10 Điểm Học Tập = 1 V-Pearl</span>
          </div>

          {convertSuccessMsg && (
            <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-xs font-bold text-emerald-300 text-center animate-pulse">
              {convertSuccessMsg}
            </div>
          )}

          {/* Exchange Input Form */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-zinc-400 uppercase">
                  Số điểm học tập muốn quy đổi
                </label>
                <button
                  onClick={() => setConvertInput(studyPoints.toString())}
                  className="text-[11px] text-cyan-400 hover:underline font-bold"
                >
                  Đổi tối đa ({studyPoints} điểm)
                </button>
              </div>

              <input
                type="number"
                placeholder="Nhập số điểm (ví dụ: 500)..."
                value={convertInput}
                onChange={(e) => setConvertInput(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-4 py-3 text-sm text-cyan-300 font-black font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Calculated Preview */}
            {parseInt(convertInput) > 0 && (
              <div className="p-4 bg-zinc-900 rounded-2xl border border-white/10 flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">Nhận về ước tính:</span>
                <span className="text-base font-black text-cyan-300 flex items-center gap-1">
                  <Gem className="w-4 h-4 text-cyan-400 fill-cyan-400" />
                  +{Math.floor(parseInt(convertInput) / 10)} V-Pearls
                </span>
              </div>
            )}

            <button
              disabled={!convertInput || parseInt(convertInput) <= 0 || parseInt(convertInput) > studyPoints || Math.floor(parseInt(convertInput) / 10) <= 0}
              onClick={handleConvertPointsToPearls}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-black font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <ArrowRightLeft className="w-4 h-4" /> Xác Nhận Quy Đổi Ngay
            </button>
          </div>
        </div>
      )}

      {/* SUB TAB: TRANSFER */}
      {activeSubTab === "transfer" && (
        <div className="max-w-2xl mx-auto bg-[#18181c] border border-white/10 rounded-3xl p-6 shadow-2xl">
          <h2 className="text-lg font-black text-white mb-6 uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-4">
            <Send className="w-5 h-5 text-amber-400" /> Chuyển Tiền Nhanh 24/7
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">
                Ngân hàng thụ hưởng
              </label>
              <select
                value={recipientBank}
                onChange={(e) => setRecipientBank(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="V-Bank (Nội bộ Vplay)">V-Bank (Nội bộ Vplay - Miễn phí)</option>
                <option value="Vietcombank">Vietcombank</option>
                <option value="MB Bank">MB Bank</option>
                <option value="Techcombank">Techcombank</option>
                <option value="VPBank">VPBank</option>
                <option value="BIDV">BIDV</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">
                Số tài khoản nhận
              </label>
              <input
                type="text"
                placeholder="Nhập số tài khoản..."
                value={recipientAccount}
                onChange={(e) => handleLookupRecipient(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            {isVerifyingRecipient && (
              <div className="text-xs text-amber-400 font-semibold animate-pulse">
                Đang tra cứu tên tài khoản thụ hưởng...
              </div>
            )}

            {recipientName && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs font-bold text-emerald-400 flex items-center justify-between">
                <span>Tên người nhận:</span>
                <span className="uppercase">{recipientName}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">
                Số tiền chuyển (₫)
              </label>
              <input
                type="number"
                placeholder="Ví dụ: 500000"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-4 py-3 text-sm text-amber-400 font-black focus:outline-none focus:border-amber-500 font-mono"
              />
              <div className="text-[11px] text-zinc-500 mt-1">
                Số dư khả dụng: {formatVND(balance)}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">
                Lời nhắn
              </label>
              <input
                type="text"
                value={transferMessage}
                onChange={(e) => setTransferMessage(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              disabled={!recipientAccount || !transferAmount || parseFloat(transferAmount) > balance}
              onClick={() => setShowOreConfirmDialog(true)}
              className="w-full py-4 mt-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 text-black font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl transition-all cursor-pointer"
            >
              Xác Nhận Chuyển Tiền
            </button>
          </div>
        </div>
      )}

      {/* ORE UI DIALOG STYLED CONFIRMATION POPUP */}
      {showOreConfirmDialog && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#2d2d32] border-2 border-[#4a4a50] rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden font-mono text-zinc-200">
            {/* Header */}
            <div className="bg-[#3a3a40] border-b border-[#4a4a50] px-4 py-3 flex items-center justify-between">
              <span className="text-sm font-extrabold text-white uppercase tracking-wider">
                Xác nhận giao dịch
              </span>
              <button
                onClick={() => setShowOreConfirmDialog(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-5 space-y-4 text-xs font-sans">
              <p className="text-zinc-300 leading-relaxed">
                Vui lòng kiểm tra kỹ thông tin chuyển tiền dưới đây trước khi hoàn tất xác thực OTP.
              </p>

              <div className="bg-[#212125] p-3.5 border border-[#3f3f46] rounded-lg space-y-2 font-mono">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Ngân hàng:</span>
                  <span className="text-white font-bold">{recipientBank}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Số tài khoản:</span>
                  <span className="text-amber-300 font-bold">{recipientAccount}</span>
                </div>
                {recipientName && (
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Người nhận:</span>
                    <span className="text-emerald-400 font-bold uppercase">{recipientName}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-[#3f3f46] pt-2">
                  <span className="text-zinc-400">Số tiền:</span>
                  <span className="text-amber-400 font-black text-sm">
                    {formatVND(parseFloat(transferAmount) || 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Ore UI Buttons */}
            <div className="bg-[#242428] border-t border-[#4a4a50] p-4 flex flex-col gap-2">
              <button
                onClick={handleExecuteTransfer}
                className="w-full py-3 bg-[#388e3c] hover:bg-[#2e7d32] border-2 border-[#1b5e20] text-white font-extrabold text-xs uppercase tracking-wider rounded-md shadow-md transition-all cursor-pointer"
              >
                Xác nhận & Chuyển ngay
              </button>
              <button
                onClick={() => setShowOreConfirmDialog(false)}
                className="w-full py-3 bg-[#5c5c62] hover:bg-[#4d4d53] border-2 border-[#333338] text-white font-extrabold text-xs uppercase tracking-wider rounded-md shadow-md transition-all cursor-pointer"
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB: QR */}
      {activeSubTab === "qr" && (
        <div className="max-w-md mx-auto bg-[#18181c] border border-white/10 rounded-3xl p-6 text-center shadow-2xl">
          <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4">
            Mã QR Thanh Toán V-Bank
          </h3>
          <div className="p-6 bg-white rounded-2xl inline-block mb-4 shadow-xl">
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=VPLAY_VBANK_888899996868"
              alt="V-Bank QR Code"
              className="w-48 h-48 mx-auto"
            />
          </div>
          <div className="text-xs font-mono font-bold text-amber-400">
            STK: 8888 9999 6868 - VPLAY
          </div>
          <p className="text-[11px] text-zinc-400 mt-2">
            Sử dụng ứng dụng V-Bank hoặc ngân hàng bất kỳ để quét mã nhận tiền tự động.
          </p>
        </div>
      )}

      {/* SUB TAB: SAVINGS */}
      {activeSubTab === "savings" && (
        <div className="max-w-xl mx-auto bg-[#18181c] border border-white/10 rounded-3xl p-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
              <PiggyBank className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Sổ Tiết Kiệm Tích Lũy Online
              </h3>
              <p className="text-xs text-zinc-400">Lãi suất ưu đãi 6.8%/năm dành riêng cho Verified VIP</p>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-r from-amber-950/40 via-zinc-900 to-black border border-amber-500/30 rounded-2xl mb-6">
            <div className="text-xs text-zinc-400 font-semibold mb-1">Tổng tiền tích lũy:</div>
            <div className="text-2xl font-black text-amber-300 font-mono">{formatVND(savingsVault)}</div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">
                Gửi thêm vào quỹ tiết kiệm (₫)
              </label>
              <input
                type="number"
                placeholder="Nhập số tiền..."
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              onClick={handleDepositSavings}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all cursor-pointer"
            >
              Nạp Vào Quỹ Tiết Kiệm
            </button>
          </div>
        </div>
      )}

      {/* SUB TAB: HISTORY */}
      {activeSubTab === "history" && (
        <div className="bg-[#18181c] border border-white/10 rounded-3xl p-6 shadow-xl">
          <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <History className="w-4 h-4 text-amber-400" /> Tất cả lịch sử giao dịch
          </h3>
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="text-xs font-bold text-white">{tx.title}</div>
                  <div className="text-[10px] text-zinc-500">{tx.date} • {tx.status.toUpperCase()}</div>
                </div>
                <div
                  className={`text-sm font-black font-mono ${
                    tx.type === "convert"
                      ? "text-cyan-400"
                      : tx.type === "income"
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {tx.type === "convert" ? `+${tx.amount} Pearls` : tx.type === "income" ? `+${formatVND(tx.amount)}` : `-${formatVND(tx.amount)}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
