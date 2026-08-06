export type CourseModuleSection = {
  title: string;
  content?: string;
  intro?: string;
  items?: string[];
};

export type CoursesPageContent = {
  description: string;
  overview: string;
  moduleSections: CourseModuleSection[];
  audience: string[];
  highlights?: string[];
  highlightsLabel?: string;
};

export type PopularCourse = {
  title: string;
  duration: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  features?: string[];
  overview?: string;
  modules?: string[];
  modulesLabel?: string;
  audience?: string[];
  highlights?: string[];
  highlightsLabel?: string;
  outcome?: string;
  detailed?: boolean;
  coursesPageContent?: CoursesPageContent;
};

export const popularCourses: PopularCourse[] = [
  {
    title: "20 Days All Inclusive Course",
    duration: "20 Days",
    detailed: true,
    description:
      "Designed for students, job seekers, entrepreneurs, and professionals, this twenty day Theory Programme covers Financial Accounting, Auditing, Financial Statement Analysis, Taxation, HR Management, and SOPs. Grounded in current legislation, accounting standards, and practical applications, it delivers the essential foundation needed to tackle complex business responsibilities and drive career success.",
    modules: [
      "Taxation",
      "Accounting",
      "Human Resource Management",
      "Auditing",
      "Ratio Analysis & SOP (Standard Auditing Procedure)",
    ],
    outcome:
      "Upon successful completion, participants will possess a comprehensive theoretical understanding of essential accounting and business functions, providing a solid foundation for professional practice and further career development.",
    imageSrc: "/cand-b.jpg",
    imageAlt: "Comprehensive professional accounting course",
    coursesPageContent: {
      description:
        "Build a strong foundation for a successful career in accounting, finance, taxation, auditing, and human resource management with our comprehensive twenty days Theory Programme. This course is designed for students, job seekers, entrepreneurs, and professionals who want to develop practical theoretical knowledge that meets today's business requirements.",
      overview:
        "Throughout the programme, participants will gain in-depth knowledge in Taxation, Financial Accounting, Human Resource Management, Auditing: Internal Controls, Financial Statement Analysis, Ratio Analysis, and Standard Operating Procedures (SOPs). The curriculum combines current legislation, accounting standards, and real-world business practices to prepare participants for professional responsibilities.",
      moduleSections: [
        {
          title: "Taxation",
          content:
            "Introduction to Taxation, Principles of Taxation, Employment Income Tax, Business Income, Corporate Taxation, Allowable & Disallowable Expenses, Tax Computations, and an Introduction to the RAMIS System and Tax Return Filling.",
        },
        {
          title: "Accounting",
          content:
            "Important Accounting Standards Understanding of Accounting Standards, including LKAS 1 – Presentation of Financial Statements, LKAS 16 – Property, Plant and Equipment, SLFRS 15 – Revenue Recognition, SLFRS 16 – Leases, LKAS 23 – Borrowing Costs, LKAS 24 – Related Party Disclosures, and LKAS 10 – Events After the Reporting Period.",
        },
        {
          title: "Human Resource Management",
          content:
            "Principles of Human Resource Management, Introduction to Labour Registration, Contracts of Employment, Types of Employment, Shop and Office Employees (Regulation of Employment and Remuneration) Act, Remuneration Act, Wages Boards Ordinance, Maternity Benefits Ordinance, Employees' Provident Fund (EPF) Act, Disciplinary Procedures & Workplace Conflict Management, Training & Development, Organizational Behavior, Modern Workplace Practices & Career Success.",
        },
        {
          title: "Auditing",
          content:
            "Introduction to Internal Controls, Internal Controls in Businesses, Record Keeping, and Documentation Standards.",
        },
        {
          title: "Ratio Analysis & SOP (Standard Auditing Procedure)",
          content:
            "Financial Statement Interpretation, Financial Ratio Analysis, Business Performance Evaluation, and Standard Operating Procedures.",
        },
      ],
      audience: [
        "Students pursuing accounting and finance qualifications",
        "School leavers seeking practical knowledge",
        "Accounting and finance professionals",
        "Business owners and entrepreneurs",
        "Anyone interested in developing career-ready accounting skills",
      ],
    },
  },
  {
    title: "4 Days Fast Track Practical Accounting Programme",
    duration: "4 Days",
    detailed: true,
    description:
      "Designed for students, job seekers, entrepreneurs, and professionals, the four days Fast Track Practical Accounting Programme bridges the gap between theory and real-world business operations to build high-demand, job-ready skills. Through intensive hands-on training using industry-standard software, business documentation, and practical workplace scenarios, it delivers the essential expertise needed to perform confidently in today's accounting and finance environment.",
    modules: [
      "Session 1 – QuickBooks & Cloud Accounting",
      "Session 2 – Financial Statements & Business Decision Making",
      "Session 3 – Auditing & Internal Controls",
      "Session 4 – Advanced HR & Payroll",
    ],
    outcome:
      "Start your professional journey with practical knowledge that can be applied immediately in the workplace and enhance your career opportunities with confidence.",
    imageSrc: "/course-4days-practical.png",
    imageAlt:
      "Practical accounting training with calculator, documents, and financial analysis",
    coursesPageContent: {
      description:
        "The four days Fast Track Practical Accounting Programme is designed to equip participants with the practical skills required to perform confidently in today's accounting and finance workplace. This intensive hands-on programme bridges the gap between theory and real-world business operations by providing practical training using industry-standard software, business documentation, and workplace scenarios.",
      overview:
        "Whether you are a student, graduate, entrepreneur, or working professional, this programme will help you develop job-ready skills that employers value.",
      moduleSections: [
        {
          title: "Session 1 – QuickBooks & Cloud Accounting",
          intro: "Gain hands-on experience in:",
          items: [
            "Bookkeeping and Double Entry Principles",
            "Practical Data Entry",
            "QuickBooks Accounting Software",
            "Cloud-Based Accounting Systems",
            "Generating Accounting Reports",
          ],
        },
        {
          title: "Session 2 – Financial Statements & Business Decision Making",
          intro: "Develop the ability to:",
          items: [
            "Generate Trial Balances and Financial Statements using QuickBooks",
            "Interpret Financial Statements",
            "Perform Financial Ratio Analysis",
            "Support Management and Boardroom Decision Making using financial information",
          ],
        },
        {
          title: "Session 3 – Auditing & Internal Controls",
          intro: "Learn practical auditing procedures including:",
          items: [
            "Internal Control Systems",
            "Standard Operating Procedures (SOPs)",
            "Business Documentation and Record Management",
            "Filing Systems and Compliance",
            "Authority Levels and Approval Procedures within an Organisation",
          ],
        },
        {
          title: "Session 4 – Advanced HR & Payroll",
          intro: "Master practical HR administration by learning:",
          items: [
            "Payroll Preparation using Microsoft Excel",
            "Salary, EPF & ETF Calculations",
            "C Form and R Form Preparation",
            "HR Documentation",
            "Employment Letters and Legal Agreements",
            "Practical Application of Sri Lankan Labour Laws",
          ],
        },
      ],
      audience: [
        "Students pursuing Accounting, Finance or AAT qualifications",
        "School leavers seeking practical experience",
        "Graduates looking for employment",
        "Accountants and Finance Executives",
        "HR Professionals",
        "Business Owners and Entrepreneurs",
      ],
      highlightsLabel: "Why Choose This Programme?",
      highlights: [
        "Practical, hands-on training",
        "Industry-relevant software and business documents",
        "Experienced trainers",
        "Real workplace scenarios and case studies",
        "Job-ready skills in just 4 Sessions",
      ],
    },
  },
];
