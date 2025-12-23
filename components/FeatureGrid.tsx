
import React from 'react';
import { SawaInfo } from '../types';

interface Props {
  stats: SawaInfo;
}

const FeatureGrid: React.FC<Props> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      <div className="glass p-5 md:p-8 rounded-2xl border border-white/5 hover:border-cyan-500/40 transition-all group active:scale-[0.98]">
        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">💎</div>
        <h3 className="text-lg md:text-xl font-bold mb-3 text-cyan-100">تحويل الماسات</h3>
        <div className="space-y-1">
          <p className="text-slate-400 text-sm flex justify-between">
            <span>للمضيف:</span>
            <span className="text-cyan-400 font-bold">{stats.diamondsPerDollarHost} = $1</span>
          </p>
          <p className="text-slate-400 text-sm flex justify-between">
            <span>للوكيل:</span>
            <span className="text-blue-400 font-bold">{stats.diamondsPerDollarAgent} = $1</span>
          </p>
        </div>
      </div>

      <div className="glass p-5 md:p-8 rounded-2xl border border-white/5 hover:border-blue-500/40 transition-all group active:scale-[0.98]">
        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📊</div>
        <h3 className="text-lg md:text-xl font-bold mb-3 text-blue-100">نسب الأرباح</h3>
        <div className="space-y-1">
          <p className="text-slate-400 text-sm flex justify-between">
            <span>أعلى نسبة مضيف:</span>
            <span className="text-cyan-400 font-bold">{stats.maxHostProfit}</span>
          </p>
          <p className="text-slate-400 text-sm flex justify-between">
            <span>أعلى نسبة وكيل:</span>
            <span className="text-blue-400 font-bold">{stats.agentTopProfit}</span>
          </p>
        </div>
      </div>

      <div className="glass p-5 md:p-8 rounded-2xl border border-white/5 hover:border-purple-500/40 transition-all group active:scale-[0.98]">
        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">⚡</div>
        <h3 className="text-lg md:text-xl font-bold mb-3 text-purple-100">نظام الترقية</h3>
        <p className="text-slate-400 text-sm leading-relaxed">
          أسرع نظام ترقية ليفل بمتطلبات أقل بكثير من التطبيقات الأخرى. مجهود أقل = وصول أسرع.
        </p>
      </div>
    </div>
  );
};

export default FeatureGrid;
