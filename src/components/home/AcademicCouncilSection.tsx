import SectionHeader from "@/components/SectionHeader";
import CourseCard from "./CourseCard";

const councilMembers = [
  {
    title: "Mrs. Lakmali Maddage",
    description: "Academic Council Member",
    imageSrc: "/academic-council/ms-lakmali-maddage.png",
    imageAlt: "Mrs. Lakmali Maddage — Academic Council",
  },
  {
    title: "Mr. Earnest",
    description: "Academic Council Member",
    imageSrc: "/academic-council/mr-earnest.png",
    imageAlt: "Mr. Earnest — Academic Council",
  },
  {
    title: "Mr. Ranjith Somasiri Samaranayake",
    description: "Academic Council Member",
    imageSrc: "/academic-council/mr-ranjith.png",
    imageAlt: "Mr. Ranjith Somasiri Samaranayake — Academic Council",
  },
  {
    title: "Mrs. Nadeeka Jeewanthi",
    description: "Academic Council Member",
    imageSrc: "/academic-council/ms-nadeeka.png",
    imageAlt: "Mrs. Nadeeka Jeewanthi — Academic Council",
  },
  {
    title: "Dr. Upul Piyawi Wijewardhena",
    description: "Academic Council Member",
    imageSrc: "/academic-council/mr-piyavi.png",
    imageAlt: "Dr. Upul Piyawi Wijewardhena — Academic Council",
  },
  {
    title: "Mr. Nuwan Gamage",
    description: "Academic Council Member",
    imageSrc: "/academic-council/mr-nuwan.png",
    imageAlt: "Mr. Nuwan Gamage — Academic Council",
  },
  {
    title: "Mrs. Chamini Thushari",
    description: "Academic Council Member",
    imageSrc: "/academic-council/ms-chamini.png",
    imageAlt: "Mrs. Chamini Thushari — Academic Council",
  },
  {
    title: "Mr. Isuru Rathnayake",
    description: "Academic Council Member",
    imageSrc: "/academic-council/mr-isuru.png",
    imageAlt: "Mr. Isuru Rathnayake — Academic Council",
  },
  {
    title: "Ms. Sajini Welvidana",
    description: "Academic Council Member",
    imageSrc: "/academic-council/ms-sajini.png",
    imageAlt: "Ms. Sajini Welvidana — Academic Council",
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
