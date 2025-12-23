
import React from 'react';
import { SawaInfo } from '../types';

interface Props {
  stats: SawaInfo;
}

const FeatureGrid: React.FC<Props> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
      <div className="glass p-6 md:p-10 rounded-2xl md:rounded-3xl border border-white/5 hover:border-cyan-500/40 transition-all group active:scale-[0.98]">
        <div className="text-3xl md:text-5xl mb-5 group-hover:scale-110 transition-transform">💎</div>
        <h3 className="text-lg md:text-2xl font-black mb-4 text-cyan-100">تحويل الماسات</h3>
        <div className="space-y-2 md:space-y-3">
          <p className="text-slate-400 text-sm md:text-base flex justify-between items-center">
            <span className="opacity-80">للمضيف:</span>
            <span className="text-cyan-400 font-black">{stats.diamondsPerDollarHost.toLocaleString()} = $1</span>
          </p>
          <p className="text-slate-400 text-sm md:text-base flex justify-between items-center">
            <span className="opacity-80">للوكيل:</span>
            <span className="text-blue-400 font-black">{stats.diamondsPerDollarAgent.toLocaleString()} = $1</span>
          </p>
        </div>
      </div>

      <div className="glass p-6 md:p-10 rounded-2xl md:rounded-3xl border border-white/5 hover:border-blue-500/40 transition-all group active:scale-[0.98]">
        <div className="text-3xl md:text-5xl mb-5 group-hover:scale-110 transition-transform">📊</div>
        <h3 className="text-lg md:text-2xl font-black mb-4 text-blue-100">نسب الأرباح</h3>
        <div className="space-y-2 md:space-y-3">
          <p className="text-slate-400 text-sm md:text-base flex justify-between items-center">
            <span className="opacity-80">أعلى نسبة مضيف:</span>
            <span className="text-cyan-400 font-black">{stats.maxHostProfit}</span>
          </p>
          <p className="text-slate-400 text-sm md:text-base flex justify-between items-center">
            <span className="opacity-80">أعلى نسبة وكيل:</span>
            <span className="text-blue-400 font-black">{stats.agentTopProfit}</span>
          </p>
        </div>
      </div>

      <div className="glass p-6 md:p-10 rounded-2xl md:rounded-3xl border border-white/5 hover:border-purple-500/40 transition-all group active:scale-[0.98]">
        <div className="text-3xl md:text-5xl mb-5 group-hover:scale-110 transition-transform">⚡</div>
        <h3 className="text-lg md:text-2xl font-black mb-4 text-purple-100">نظام الترقية</h3>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed opacity-90">
          أسرع نظام ترقية ليفل بمتطلبات أقل بكثير من التطبيقات الأخرى. مجهود أقل = وصول أسرع للنجومية.
        </p>
      </div>
    </div>
  );
};

export default FeatureGrid;
