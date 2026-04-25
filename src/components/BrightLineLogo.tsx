import logo from "@/assets/brightline-logo.png";

export function BrightLineLogo({ className = "", size = 40 }: { className?: string; size?: number }) {
  return (
    <img
      src={logo}
      alt="BrightLine Cleaning"
      style={{ height: size }}
      className={`w-auto select-none ${className}`}
      draggable={false}
    />
  );
}
