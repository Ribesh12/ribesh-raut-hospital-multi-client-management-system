export function Logo({
  className = "h-8 w-8",
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "white";
}) {
  const primaryColor = variant === "white" ? "#ffffff" : "#0573EC";

  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 270-degree arc circle */}
      <path
        d="M20 4 A16 16 0 1 1 4 20"
        stroke={primaryColor}
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Cross in center */}
      <rect x="18" y="12" width="4" height="16" rx="1" fill={primaryColor} />
      <rect x="12" y="18" width="16" height="4" rx="1" fill={primaryColor} />
    </svg>
  );
}

export function LogoFull({
  className = "",
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "white";
}) {
  const textColor = variant === "white" ? "text-white" : "text-foreground";
  const primaryText = variant === "white" ? "text-white" : "text-primary";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Logo className="h-8 w-8" variant={variant} />
      <span className={`text-xl font-bold ${textColor}`}>
        Medi<span className={primaryText}>Care</span>
      </span>
    </div>
  );
}
