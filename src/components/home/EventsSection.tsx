import SectionHeader from "@/components/SectionHeader";
import EventCard from "./EventCard";

const featuredEvent = {
  title: "Official Graduation 2026",
  description:
    "Celebrating Our Graduates and their Achievements at Next Level Solutions Campus.",
  imageSrc: "/events/graduation-2026.png",
  imageAlt: "Official Graduation 2026 group photo",
};

const upcomingWorkshops = [
  {
    title: "HR 5 Days Workshop",
    description:
      "Practical HR administration, labour law, and workplace compliance over five intensive days.",
    month: "Aug",
    day: "10-14",
  },
  {
    title: "Tax 1 Days Workshop",
    description:
      "One-day focus on employment income tax, RAMIS, and hands-on tax return filing.",
    month: "Aug",
    day: "15",
  },
];

export default function EventsSection() {
  return (
    <section className="border-t border-nlsc-border bg-nlsc-beige px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader eyebrow="What's happening" title="Events" />

        <div className="grid items-stretch gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-5">
          <EventCard
            title={featuredEvent.title}
            description={featuredEvent.description}
            imageSrc={featuredEvent.imageSrc}
            imageAlt={featuredEvent.imageAlt}
            featured
          />

          <div className="flex flex-col gap-6 lg:col-span-2">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-nlsc-gold-text">
              Up Coming Workshop
            </p>
            {upcomingWorkshops.map((workshop) => (
              <EventCard key={workshop.title} {...workshop} compact />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
