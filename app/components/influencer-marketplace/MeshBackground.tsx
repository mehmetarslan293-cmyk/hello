"use client";

export function MeshBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 bg-[#030014]" />
      {/* Mesh gradient layers */}
      <div
        className="mesh-blob mesh-a left-[-15%] top-[-20%] h-[55vmin] w-[55vmin] bg-indigo-600/40"
        style={{ filter: "blur(90px)" }}
      />
      <div
        className="mesh-blob mesh-b right-[-10%] top-[15%] h-[45vmin] w-[45vmin] bg-violet-600/35"
        style={{ filter: "blur(85px)" }}
      />
      <div
        className="mesh-blob mesh-c bottom-[-25%] left-[25%] h-[50vmin] w-[50vmin] bg-fuchsia-600/25"
        style={{ filter: "blur(95px)" }}
      />
      <div
        className="mesh-blob mesh-a left-[40%] top-[40%] h-[35vmin] w-[35vmin] bg-indigo-500/20"
        style={{ filter: "blur(70px)", animationDelay: "-5s" }}
      />
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.35) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />
    </div>
  );
}
