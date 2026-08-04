import SectionHeader from "@/components/SectionHeader";
import CourseCard from "./CourseCard";

const councilMembers = [
  { title: "Dr. Anil Perera", description: "Dean of Academic Affairs" },
  { title: "Prof. Nimali Fernando", description: "Head of Technology Programs" },
  { title: "Mr. Ruwan Silva", description: "Director of Student Success" },
];

export default function AcademicCouncilSection() {
  return (
    <section className="bg-nlsc-beige px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeader eyebrow="Meet our team" title="Academic council" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {councilMembers.map((member) => (
            <CourseCard
              key={member.title}
              title={member.title}
              description={member.description}
              variant="image"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
