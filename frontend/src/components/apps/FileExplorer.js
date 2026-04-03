import { useState, useEffect, useCallback } from "react";
import { FolderOpen, File, ChevronLeft, Home } from "lucide-react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

function formatSize(bytes) {
  if (bytes === 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export default function FileExplorer() {
  const [currentPath, setCurrentPath] = useState("/");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadDirectory = useCallback(async (path) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/files/browse`, {
        params: { path }
      });
      setEntries(data.entries || []);
      setCurrentPath(data.path);
    } catch {
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadDirectory("/"); }, [loadDirectory]);

  const navigateUp = () => {
    if (currentPath === "/") return;
    const parts = currentPath.split("/").filter(Boolean);
    parts.pop();
    loadDirectory("/" + parts.join("/") || "/");
  };

  const handleItemClick = (entry) => {
    if (entry.is_directory) {
      loadDirectory(entry.path);
    }
  };

  return (
    <div className="file-explorer" data-testid="file-explorer">
      <div className="file-toolbar">
        <div
          className="editor-toolbar-btn"
          onClick={navigateUp}
          style={{ cursor: currentPath === "/" ? "default" : "pointer", opacity: currentPath === "/" ? 0.3 : 1 }}
          data-testid="file-explorer-back"
        >
          <ChevronLeft size={14} />
        </div>
        <div
          className="editor-toolbar-btn"
          onClick={() => loadDirectory("/")}
          data-testid="file-explorer-home"
        >
          <Home size={14} />
        </div>
        <div className="file-path" data-testid="file-explorer-path">{currentPath}</div>
      </div>
      <div className="file-grid" data-testid="file-explorer-grid">
        {loading ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
            Loading...
          </div>
        ) : entries.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
            Empty directory
          </div>
        ) : entries.map((entry) => (
          <div
            key={entry.path}
            className="file-item"
            onClick={() => handleItemClick(entry)}
            data-testid={`file-item-${entry.name}`}
          >
            {entry.is_directory ? (
              <FolderOpen size={36} color="#6CB4EE" strokeWidth={1.2} />
            ) : (
              <File size={36} color="rgba(255,255,255,0.4)" strokeWidth={1.2} />
            )}
            <div className="file-item-name">{entry.name}</div>
            {!entry.is_directory && (
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{formatSize(entry.size)}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
