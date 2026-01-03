import React from "react";

type Segment = {
  value: number; // Segmentin yüzdesi (%)
  color: string; // Segmentin renk kodu (HEX, RGB, HSL)
};

type MultiSegmentGaugeProps = {
  segments: Segment[]; // Segmentlerin listesi
  size?: number; // Çap (px)
  strokeWidth?: number; // Çizgi kalınlığı (px)
  percentageText?: string; // Gösterilecek yüzdelik yazısı
  completionText?: string; // Gösterilecek tamamlanma durumu yazısı
};

const MultiSegmentHalfGauge: React.FC<MultiSegmentGaugeProps> = ({
  segments,
  size = 200,
  strokeWidth = 20,
  percentageText = "75%",
  completionText = "Tamamlanıb",
}) => {
  const radius = 15.915; // 36x18 viewBox için normalize edilmiş yarıçap
  const circumference = Math.PI * radius * 2; // Çemberin çevresi
  const halfCircumference = circumference / 2; // Yarım çember çevresi

  let currentOffset = 0; // Başlangıç noktası

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size / 2 }}
    >
      <svg
        viewBox="0 0 36 18"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {segments.map((segment, index) => {
          const percentage = segment.value / 100; // Yüzdeyi normalize et
          const dashLength = percentage * halfCircumference;
          const dashGap = halfCircumference - dashLength;

          const dashArray = `${dashLength} ${dashGap}`;
          const strokeDashoffset = currentOffset;

          // Offset'i bir sonraki segment için güncelle
          currentOffset -= dashLength;

          return (
            <circle
              key={index}
              cx="18"
              cy="18"
              r={radius}
              fill="transparent"
              stroke={segment.color}
              strokeWidth={strokeWidth / 2.5}
              strokeDasharray={dashArray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="butt"
              transform="rotate(180, 18, 18)"
            />
          );
        })}
      </svg>
      {/* Yüzdelik değer */}
      <div
        className="absolute text-center"
        style={{
          top: "45%",
          width: "100%",
          fontSize: "28px",
          fontWeight: "400",
          color: "#14171A",
        }}
      >
        {percentageText}
      </div>
      {/* Tamamlanma durumu */}
      <div
        className="absolute text-center"
        style={{
          top: "70%",
          width: "100%",
          fontSize: "14px",
          fontWeight: "500",
          color: "#64717C",
        }}
      >
        {completionText}
      </div>
    </div>
  );
};

export default MultiSegmentHalfGauge;
