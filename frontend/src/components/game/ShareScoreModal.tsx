import { useState, useRef, useEffect } from 'react';

interface Props {
  score: number;
  highScore: number;
  level: number;
  achievementCount: number;
  onClose: () => void;
}

export function ShareScoreModal({ score, highScore, level, achievementCount, onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const [cardUrl, setCardUrl] = useState('');

  const shareText = `I scored ${score} pts in Fruit Catcher on IslandFruitGuide! Level ${level}, ${achievementCount} achievements. Can you beat me? 🥭🏆`;
  const shareUrl = typeof window !== 'undefined' ? window.location.origin + '/fruit-game' : '';

  // Generate share card image on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = 600, H = 340;
    canvas.width = W;
    canvas.height = H;

    // Background
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#071A07');
    bg.addColorStop(0.5, '#0A2010');
    bg.addColorStop(1, '#071A07');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Border
    ctx.strokeStyle = '#F9A825';
    ctx.lineWidth = 3;
    ctx.strokeRect(8, 8, W - 16, H - 16);

    // Title
    ctx.textAlign = 'center';
    ctx.fillStyle = '#F9A825';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('IslandFruitGuide', W / 2, 40);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('FRUIT CATCHER', W / 2, 78);

    // Score
    ctx.fillStyle = '#F9A825';
    ctx.font = 'bold 72px sans-serif';
    ctx.fillText(`${score}`, W / 2, 165);

    ctx.fillStyle = '#FFFFFF99';
    ctx.font = '18px sans-serif';
    ctx.fillText('POINTS', W / 2, 190);

    // Stats row
    const stats = [
      { label: 'High Score', value: `${highScore}` },
      { label: 'Level', value: `${level}` },
      { label: 'Badges', value: `${achievementCount}` },
    ];
    const gap = W / (stats.length + 1);
    stats.forEach((s, i) => {
      const x = gap * (i + 1);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(s.value, x, 240);
      ctx.fillStyle = '#FFFFFF66';
      ctx.font = '12px sans-serif';
      ctx.fillText(s.label, x, 260);
    });

    // Footer
    ctx.fillStyle = '#1F7A4D';
    ctx.fillRect(0, H - 40, W, 40);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('Play at islandfruitguide.com/fruit-game', W / 2, H - 16);

    setCardUrl(canvas.toDataURL('image/png'));
  }, [score, highScore, level, achievementCount]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText + '\n' + shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* */ }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Fruit Catcher Score', text: shareText, url: shareUrl });
      } catch { /* user cancelled */ }
    } else {
      handleCopy();
    }
  };

  const handleDownload = () => {
    if (!cardUrl) return;
    const a = document.createElement('a');
    a.href = cardUrl;
    a.download = `fruit-catcher-${score}pts.png`;
    a.click();
  };

  const handleTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.82)' }}
      onClick={onClose}
    >
      <div
        className="bg-[#0A1F0A] rounded-3xl shadow-2xl max-w-lg w-full p-6 relative border border-white/10"
        style={{ animation: 'sharePop 0.3s ease-out' }}
        onClick={e => e.stopPropagation()}
        data-testid="share-modal"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-white/30 hover:text-white text-2xl leading-none">x</button>
        
        <h3 className="font-heading text-xl font-black text-white text-center mb-4">Share Your Score</h3>

        {/* Card preview */}
        <div className="flex justify-center mb-4">
          <canvas ref={canvasRef} className="rounded-xl shadow-lg w-full max-w-md" style={{ display: cardUrl ? 'none' : 'block' }} />
          {cardUrl && <img src={cardUrl} alt="Score card" className="rounded-xl shadow-lg w-full max-w-md" />}
        </div>

        {/* Share buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={handleShare}
            className="bg-leaf text-white font-bold py-3 rounded-xl hover:bg-leaf-light transition-colors text-sm"
            data-testid="share-native-btn"
          >
            📤 Share
          </button>
          <button
            onClick={handleTwitter}
            className="bg-[#1DA1F2] text-white font-bold py-3 rounded-xl hover:bg-[#1a8cd8] transition-colors text-sm"
            data-testid="share-twitter-btn"
          >
            𝕏 Post
          </button>
          <button
            onClick={handleCopy}
            className="bg-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/20 transition-colors text-sm"
            data-testid="share-copy-btn"
          >
            {copied ? '✓ Copied!' : '📋 Copy Text'}
          </button>
          <button
            onClick={handleDownload}
            className="bg-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/20 transition-colors text-sm"
            data-testid="share-download-btn"
          >
            💾 Save Card
          </button>
        </div>

        <p className="text-white/30 text-[10px] text-center">Challenge your friends to beat your score!</p>
      </div>
      <style>{`@keyframes sharePop{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}`}</style>
    </div>
  );
}
