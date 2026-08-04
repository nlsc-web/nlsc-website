import Hero from "@/components/home/Hero";
import PopularCoursesSection from "@/components/home/PopularCoursesSection";
import AcademicCouncilSection from "@/components/home/AcademicCouncilSection";
import EventsSection from "@/components/home/EventsSection";
import SuccessStoriesSection from "@/components/home/SuccessStoriesSection";
import CtaSection from "@/components/home/CtaSection";

export default function Home() {
  return (
    <main>
      <Hero />
      <PopularCoursesSection />
      <AcademicCouncilSection />
      <EventsSection />
      <SuccessStoriesSection />
      <CtaSection />
    </main>
  );
}
