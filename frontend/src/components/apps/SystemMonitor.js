import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

function formatBytes(bytes) {
  if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(0)} MB`;
  return `${(bytes / 1073741824).toFixed(1)} GB`;
}

function GaugeRing({ percent, color, label }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="sysmon-gauge">
      <div className="sysmon-gauge-ring">
        <svg width="70" height="70" viewBox="0 0 70 70">
          <circle cx="35" cy="35" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
          <circle
            cx="35" cy="35" r={radius} fill="none" stroke={color} strokeWidth="5"
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round" transform="rotate(-90 35 35)"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.9)'
        }}>
          {Math.round(percent)}%
        </div>
      </div>
      <span className="sysmon-gauge-label">{label}</span>
    </div>
  );
}

export default function SystemMonitor() {
  const [sysInfo, setSysInfo] = useState(null);
  const [processes, setProcesses] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const [infoRes, procRes] = await Promise.all([
        axios.get(`${API}/system/info`, { withCredentials: true }),
        axios.get(`${API}/system/processes`, { withCredentials: true }),
      ]);
      setSysInfo(infoRes.data);
      setProcesses(procRes.data);
    } catch {}
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (!sysInfo) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
        Loading system info...
      </div>
    );
  }

  return (
    <div className="sysmon-layout" data-testid="system-monitor">
      <div className="sysmon-gauges" data-testid="sysmon-gauges">
        <GaugeRing percent={sysInfo.cpu.percent} color="#6CB4EE" label="CPU" />
        <GaugeRing percent={sysInfo.memory.percent} color="#9D4CDD" label="MEMORY" />
        <GaugeRing percent={sysInfo.disk.percent} color="#FF0055" label="DISK" />
      </div>

      <div style={{ padding: '0 16px 8px', display: 'flex', gap: 20, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
        <span>CPU Cores: {sysInfo.cpu.count}</span>
        <span>RAM: {formatBytes(sysInfo.memory.used)} / {formatBytes(sysInfo.memory.total)}</span>
        <span>Disk: {formatBytes(sysInfo.disk.used)} / {formatBytes(sysInfo.disk.total)}</span>
      </div>

      <div className="sysmon-processes" data-testid="sysmon-processes">
        <div className="sysmon-process-row sysmon-process-header">
          <span>Process</span>
          <span>CPU %</span>
          <span>MEM %</span>
        </div>
        {processes.slice(0, 20).map((proc, i) => (
          <div key={`${proc.pid}-${i}`} className="sysmon-process-row">
            <span style={{ color: 'rgba(255,255,255,0.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {proc.name}
            </span>
            <span style={{ color: proc.cpu > 50 ? '#FF6B8A' : 'rgba(255,255,255,0.5)' }}>
              {proc.cpu.toFixed(1)}
            </span>
            <span style={{ color: proc.memory > 10 ? '#FFD700' : 'rgba(255,255,255,0.5)' }}>
              {proc.memory.toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
