import SectionHeader from "@/components/SectionHeader";
import EventCard from "./EventCard";

const featuredEvent = {
  title: "Official Graduation 2026",
  description:
    "Celebrating Our Graduates and their Achievements at Next Level Solutions Campus.",
  imageSrc: "/events/graduation-2026.png",
  imageAlt: "Official Graduation 2026 group photo",
};

const upcomingEvents = [
  {
    title: "Open Day 2026",
    description: "Campus tour and program overview for prospective students.",
    month: "Mar",
    day: "15",
  },
  {
    title: "Career Fair",
    description: "Meet top employers and explore career opportunities in Colombo.",
    month: "Apr",
    day: "22",
  },
];

export default function EventsSection() {
  return (
    <section className="border-t border-nlsc-border bg-nlsc-beige px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader eyebrow="What's happening" title="Events" />

        <div className="grid items-stretch gap-8 lg:grid-cols-5">
          <EventCard
            title={featuredEvent.title}
            description={featuredEvent.description}
            imageSrc={featuredEvent.imageSrc}
            imageAlt={featuredEvent.imageAlt}
            featured
          />

          <div className="flex flex-col gap-6 lg:col-span-2">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-nlsc-gold-text">
              Upcoming
            </p>
            {upcomingEvents.map((event) => (
              <EventCard
                key={event.title}
                title={event.title}
                description={event.description}
                month={event.month}
                day={event.day}
                compact
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
