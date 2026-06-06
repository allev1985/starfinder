type Props = {
  label: string;
  value: string | number;
  mod?: string;
  dark?: boolean;
};

export default function StatTile({ label, value, mod, dark = false }: Props) {
  return (
    <div
      className="flex flex-col items-center justify-center text-center px-2 py-[11px] rounded-[11px] border"
      style={{
        backgroundColor: dark ? "var(--chrome)" : "var(--surface-2)",
        borderColor: dark ? "var(--chrome-3)" : "var(--border)",
      }}
    >
      <span
        className="block uppercase tracking-[0.08em] leading-none"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "9.5px",
          color: dark ? "var(--chrome-muted)" : "var(--text-3)",
        }}
      >
        {label}
      </span>
      <span
        className="block font-bold mt-[3px] leading-none"
        style={{
          fontFamily: "var(--font-ui)",
          fontSize: "22px",
          fontWeight: 700,
          color: dark ? "var(--chrome-text)" : "var(--text-1)",
        }}
      >
        {value}
      </span>
      {mod && (
        <span
          className="block mt-[3px] leading-none"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            color: dark ? "var(--accent-bright)" : "var(--sf-accent)",
          }}
        >
          {mod}
        </span>
      )}
    </div>
  );
}
