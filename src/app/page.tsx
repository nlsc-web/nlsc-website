import Header from "@/components/Header";
import SectionHeader from "@/components/SectionHeader";
import Footer from "@/components/Footer";

const courses = ["Course name", "Course name", "Course name"];
const councilMembers = ["Name", "Name", "Name"];
const events = ["Event title", "Event title", "Event title"];
const stories = ["Description", "Description", "Description"];

function CardGrid({
  items,
  variant,
}: {
  items: string[];
  variant: "course" | "image";
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <article
          key={`${item}-${index}`}
          className="overflow-hidden rounded-xl border border-gray-200 bg-white"
        >
          {variant === "image" && (
            <div className="aspect-[4/3] bg-nlsc-card-placeholder" />
          )}
          <div className={variant === "course" ? "p-6" : "border-t border-gray-100 p-5"}>
            <p className="text-sm font-medium text-nlsc-text">{item}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Header />

      <main>
        {/* Hero */}
        <section
          id="home"
          className="bg-nlsc-mint px-6 py-24 text-center sm:py-32"
        >
          <div className="mx-auto max-w-3xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-nlsc-green">
              Welcome to
            </p>
            <h1 className="mb-5 text-3xl font-bold leading-tight tracking-tight text-nlsc-text sm:text-5xl">
              Build your career with confidence
            </h1>
            <p className="mx-auto mb-8 max-w-xl text-base text-nlsc-muted sm:text-lg">
              Industry-focused courses in Colombo, designed to get you
              job-ready.
            </p>
            <a
              href="#courses"
              className="inline-block rounded-lg bg-nlsc-text px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Explore courses
            </a>
          </div>
        </section>

        {/* Popular Courses */}
        <section id="courses" className="px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeader eyebrow="Our programs" title="Popular courses" />
            <CardGrid items={courses} variant="course" />
          </div>
        </section>

        {/* Academic Council */}
        <section id="about" className="bg-nlsc-beige px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeader eyebrow="Meet our team" title="Academic council" />
            <CardGrid items={councilMembers} variant="image" />
          </div>
        </section>

        {/* Events */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeader eyebrow="What's happening" title="Events" />
            <CardGrid items={events} variant="image" />
          </div>
        </section>

        {/* Success Stories */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeader
              eyebrow="What our students say"
              title="Success stories"
            />
            <CardGrid items={stories} variant="image" />
          </div>
        </section>

        {/* CTA */}
        <section id="contact" className="bg-nlsc-beige px-6 py-20 text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-3 text-2xl font-bold tracking-tight text-nlsc-text sm:text-3xl">
              Ready to start your journey?
            </h2>
            <p className="mb-8 text-nlsc-muted">
              Get in touch with our admissions team.
            </p>
            <a
              href="mailto:admissions@nlsc.lk"
              className="inline-block rounded-lg bg-nlsc-text px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Contact us
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
