import React, { useState } from 'react';
import { Activity, CheckCircle2, HeartPulse, Moon, Plus, ShieldCheck, Target } from 'lucide-react';

const habits = [
  { label: 'Uống đủ nước', value: '6 / 8 ly', icon: Activity },
  { label: 'Vận động', value: '24 phút', icon: Target },
  { label: 'Giấc ngủ', value: '7h 42m', icon: Moon },
];

export const VHealthTab: React.FC = () => {
  const [checked, setChecked] = useState<string[]>(['Uống đủ nước']);

  const toggleHabit = (label: string) => setChecked((current) => current.includes(label) ? current.filter((item) => item !== label) : [...current, label]);

  return (
    <section className="bg-[#10231f] p-5 text-white sm:p-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3"><div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300"><HeartPulse className="size-6" /></div><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">V-Health</p><h2 className="text-2xl font-bold">Trung tâm sức khỏe</h2></div></div>
        <div className="flex items-center gap-2 rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-sm text-emerald-100"><ShieldCheck className="size-4" /> Dữ liệu riêng tư</div>
      </div>
      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.06] p-5"><div className="flex items-end justify-between"><div><p className="text-sm text-slate-400">Điểm sức khỏe hôm nay</p><p className="mt-1 text-4xl font-bold text-emerald-300">82<span className="text-lg text-slate-400">/100</span></p></div><div className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-300">Tốt</div></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[82%] rounded-full bg-emerald-400" /></div></div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">{habits.map(({ label, value, icon: Icon }) => { const isChecked = checked.includes(label); return <button key={label} onClick={() => toggleHabit(label)} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-left transition-colors hover:bg-white/10"><div className="flex items-center justify-between"><Icon className="size-5 text-emerald-300" />{isChecked ? <CheckCircle2 className="size-4 text-emerald-300" /> : <Plus className="size-4 text-slate-500" />}</div><p className="mt-4 text-sm text-slate-300">{label}</p><p className="mt-1 font-semibold">{value}</p></button>; })}</div>
    </section>
  );
};

export default VHealthTab;
