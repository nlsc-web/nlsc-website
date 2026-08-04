import { lmsTokens } from "@/lib/portal/lms-tokens";

type GradeBarProps = {
  course: string;
  grade: number;
  color: string;
};

function GradeBar({ course, grade, color }: GradeBarProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs">
        <span style={{ color: lmsTokens.ink }}>{course}</span>
        <span className="font-semibold" style={{ color: lmsTokens.slate }}>
          {grade}%
        </span>
      </div>
      <div
        className="h-2 w-full rounded-full"
        style={{ backgroundColor: lmsTokens.gold100 }}
      >
        <div
          className="h-2 rounded-full"
          style={{ width: `${grade}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function GradeSummaryChart({
  data,
}: {
  data: Array<{ course: string; grade: number }>;
}) {
  return (
    <div className="space-y-4">
      {data.map((entry, index) => (
        <GradeBar
          key={entry.course}
          course={entry.course}
          grade={entry.grade}
          color={index === 0 ? lmsTokens.gold500 : lmsTokens.good}
        />
      ))}
    </div>
  );
}
