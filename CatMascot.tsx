export default function CatMascot({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`cat-mascot ${compact ? "cat-mascot-compact" : ""}`} aria-label="Кот-маскот чайной">
      <div className="cat-steam steam-one" />
      <div className="cat-steam steam-two" />
      <div className="cat-ear cat-ear-left" />
      <div className="cat-ear cat-ear-right" />
      <div className="cat-face">
        <span className="cat-eye cat-eye-left" />
        <span className="cat-eye cat-eye-right" />
        <span className="cat-blush cat-blush-left" />
        <span className="cat-blush cat-blush-right" />
        <span className="cat-nose" />
        <span className="cat-mouth" />
        <span className="cat-whisker whisker-left" />
        <span className="cat-whisker whisker-right" />
      </div>
      <div className="cat-scarf" />
      {!compact && <div className="cat-cup"><span>茶</span></div>}
    </div>
  );
}