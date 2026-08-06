export type CourseFee = {
  title: string;
  subtitle?: string;
  duration: string;
  price: string;
  includes?: string[];
  priceBreakdown?: string;
  discount?: string;
  featured?: boolean;
};

export const courseFees: CourseFee[] = [
  {
    title: "20 Days All Inclusive Course",
    duration: "20 Days",
    price: "Rs. 15,000.00",
    includes: [
      "Taxation",
      "Accounting",
      "Human Resource Management",
      "Auditing",
      "Ratio Analysis & SOP (Standard Operating Procedure)",
    ],
  },
  {
    title: "4 Days Fast Track Practical Accounting Programme",
    duration: "4 Days",
    price: "Rs. 20,000.00",
    includes: [
      "Session 1 – QuickBooks & Cloud Accounting",
      "Session 2 – Financial Statements & Business Decision Making",
      "Session 3 – Auditing & Internal Controls",
      "Session 4 – Advanced HR & Payroll",
    ],
  },
  {
    title: "Full Course",
    subtitle:
      "20 Days All Inclusive Course + 4 Days Fast Track Practical Accounting Programme",
    duration: "Combined",
    price: "Rs. 31,000.00",
    priceBreakdown: "Rs. 15,000.00 + Rs. 16,000.00",
    discount: "Rs. 4,000.00",
    featured: true,
  },
];
