import SectionHeader from "@/components/SectionHeader";
import CourseCard from "./CourseCard";

const stories = [
  {
    title: "Kavindu — Software Engineer at Virtusa",
    description: "Graduated from our Software Engineering program and landed a role within three months.",
  },
  {
    title: "Dilani — Marketing Manager at Dialog",
    description: "The Digital Marketing course gave her the skills to lead campaigns for a major brand.",
  },
  {
    title: "Tharindu — Startup Founder",
    description: "Business Management program helped him launch his own tech startup in Colombo.",
  },
];

export default function SuccessStoriesSection() {
  return (
    <section className="bg-nlsc-surface px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="What our students say"
          title="Success stories"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => (
            <CourseCard
              key={story.title}
              title={story.title}
              description={story.description}
              variant="image"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
