"use client";

interface DebugPanelProps {
  currentAnimation?: string;
  position?: [number, number, number];
  fps?: number;
}

export default function DebugPanel({ 
  currentAnimation = "N/A", 
  position = [0, 0, 0],
  fps = 0 
}: DebugPanelProps) {
  return (
    <div className="fixed top-4 right-4 bg-black/80 backdrop-blur-sm text-white p-4 rounded-lg border border-white/20 font-mono text-xs">
      <h3 className="font-bold text-green-400 mb-2">🐛 Debug Info</h3>
      <div className="space-y-1">
        <p>
          <span className="text-gray-400">Animación:</span>{" "}
          <span className="text-yellow-300">{currentAnimation}</span>
        </p>
        <p>
          <span className="text-gray-400">Posición:</span>{" "}
          <span className="text-blue-300">
            X: {position[0].toFixed(2)}, Y: {position[1].toFixed(2)}, Z: {position[2].toFixed(2)}
          </span>
        </p>
        {fps > 0 && (
          <p>
            <span className="text-gray-400">FPS:</span>{" "}
            <span className={fps > 50 ? "text-green-300" : "text-red-300"}>
              {fps.toFixed(0)}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
















