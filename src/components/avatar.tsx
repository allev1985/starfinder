type Props = {
  name: string;
  size?: number;
  radius?: number;
};

function nameToHue(name: string): number {
  return [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
}

function initials(name: string): string {
  const words = name.trim().split(/\s+/);
  return words
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export default function Avatar({ name, size = 46, radius = 12 }: Props) {
  const hue = nameToHue(name);
  const fontSize = Math.round(size * 0.38);

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        backgroundColor: `hsl(${hue} 50% 45%)`,
        fontSize,
        color: "#fff",
        fontFamily: "var(--font-ui)",
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        userSelect: "none",
      }}
    >
      {initials(name)}
    </div>
  );
}
