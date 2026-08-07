import SectionHeader from "@/components/SectionHeader";
import CourseCard from "./CourseCard";

const councilMembers = [
  {
    title: "Ms. Lakmali",
    description: "Academic Council Member",
    imageSrc: "/academic-council/ms-lakmali.png",
    imageAlt: "Ms. Lakmali — Academic Council",
  },
  {
    title: "Mr. Earnest",
    description: "Academic Council Member",
    imageSrc: "/academic-council/mr-earnest.png",
    imageAlt: "Mr. Earnest — Academic Council",
  },
  {
    title: "Mr. Ranjith",
    description: "Academic Council Member",
    imageSrc: "/academic-council/mr-ranjith.png",
    imageAlt: "Mr. Ranjith — Academic Council",
  },
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
              imageSrc={member.imageSrc}
              imageAlt={member.imageAlt}
              imageFit="contain"
              variant="image"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
