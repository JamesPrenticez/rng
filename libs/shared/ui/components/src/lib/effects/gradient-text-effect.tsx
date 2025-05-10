interface GradientTextProps {
  bgcolor1?: string;
  bgcolor2?: string;
  bgcolor3?: string;
  text: string;
  direction?: "top" | "bottom" | "left" | "right";
}

export const GradientText = ({
  bgcolor1 = "#d946ef",
  bgcolor2 = "#f43f5e",
  bgcolor3 = "#facc15",
  text,
  direction = "right",
}: GradientTextProps) => {
  return (
    <div
      className="flex"
      style={{
        background: `linear-gradient(to ${direction}, ${bgcolor1}, ${bgcolor2}, ${bgcolor3})`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      <h1 className="text-xl md:text-3xl font-bold inline-block p-4">{text}</h1>
    </div>
  );
};
