import React, { useState, useEffect } from 'react';

export const StatusBar: React.FC = () => {
  const [timeStr, setTimeStr] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#f8f9ff] px-6 pt-2.5 pb-1 flex items-center justify-between text-[#0b1c30] text-xs font-semibold select-none border-b border-[#d3e4fe]/20">
      {/* Time */}
      <span className="tracking-tight text-[13px] font-bold font-mono">{timeStr}</span>

      {/* Dynamic island / Speaker pill placeholder */}
      <div className="w-20 h-4 bg-[#0b1c30]/10 rounded-full flex items-center justify-center">
        <div className="w-2.5 h-2.5 rounded-full bg-[#0b1c30]/40" />
      </div>

      {/* Right Icons: Cellular, WiFi, Battery */}
      <div className="flex items-center gap-1.5 text-[14px]">
        <span className="material-symbols-outlined text-[15px]">signal_cellular_4_bar</span>
        <span className="material-symbols-outlined text-[15px]">wifi</span>
        <div className="flex items-center gap-0.5">
          <span className="text-[10px] font-mono font-bold">100%</span>
          <span className="material-symbols-outlined text-[16px] text-green-600">battery_full</span>
        </div>
      </div>
    </div>
  );
};
