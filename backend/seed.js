import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import { User } from "./models/User.js";
import { Lead } from "./models/Lead.js";
import { Contact } from "./models/Contact.js";
import { Note } from "./models/Note.js";
import { Task } from "./models/Task.js";

const DAY = 24 * 60 * 60 * 1000;
const daysAgo = (n) => new Date(Date.now() - n * DAY);
const daysAhead = (n) => new Date(Date.now() + n * DAY);
const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pickSome = (arr, n) =>
  [...arr].sort(() => Math.random() - 0.5).slice(0, n);
const weighted = (pairs) => {
  const total = pairs.reduce((s, [, w]) => s + w, 0);
  let r = Math.random() * total;
  for (const [v, w] of pairs) {
    if ((r -= w) <= 0) return v;
  }
  return pairs[0][0];
};

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

const COMPANIES = [
  ["Tata Consultancy", "tcs.co"], ["Infosys Ltd", "infosys.io"],
  ["Wipro Technologies", "wipro.co"], ["Reliance Digital", "reliancedigital.in"],
  ["Mahindra Tech", "mahindratech.com"], ["HCL Systems", "hclsystems.io"],
  ["Bajaj Finserv", "bajajfinserv.co"], ["HDFC Solutions", "hdfcsoln.com"],
  ["Zerodha Capital", "zerodha.io"], ["Razorpay Inc", "razorpay.co"],
  ["Paytm Enterprises", "paytment.com"], ["Swiggy Logistics", "swiggylog.io"],
  ["Zomato Corp", "zomatocorp.co"], ["Ola Electric", "olaelectric.io"],
  ["Byju's Learning", "byjus.co"], ["Freshworks Inc", "freshworks.io"],
  ["Dream11 Sports", "dream11.co"], ["PhonePe Ltd", "phonepe.io"],
  ["Meesho Retail", "meesho.co"], ["Nykaa Fashion", "nykaa.io"],
  ["Lenskart Tech", "lenskart.co"], ["Groww Finance", "groww.io"],
  ["CRED Capital", "cred.co"], ["upGrad Learning", "upgrad.io"],
  ["Delhivery Corp", "delhivery.co"], ["Moglix Supply", "moglix.io"],
  ["Policybazaar", "policybazaar.co"], ["CarDekho Auto", "cardekho.io"],
  ["Urban Company", "urbancompany.co"], ["Vedantu Edu", "vedantu.io"],
  ["Myntra Fashion", "myntra.co"], ["Snapdeal Ltd", "snapdeal.io"],
  ["InMobi Tech", "inmobi.co"], ["Cleartax Finance", "cleartax.io"],
  ["Darwinbox HR", "darwinbox.co"], ["Browserstack", "browserstack.io"],
  ["Postman API", "postman.co"], ["Zoho Corp", "zoho.io"],
  ["MakeMyTrip", "makemytrip.co"], ["Indiamart B2B", "indiamart.io"],
];

const FIRST = [
  "Aarav", "Vivaan", "Aditya", "Arjun", "Rohan", "Karan", "Rahul", "Vikram",
  "Anuj", "Nikhil", "Priya", "Neha", "Pooja", "Ananya", "Divya", "Sneha",
  "Kavya", "Ishaan", "Riya", "Siddharth", "Meera", "Kunal", "Tanvi", "Harsh",
  "Shreya", "Manish", "Deepika", "Amit", "Swati", "Gaurav", "Nisha", "Varun",
  "Ritika", "Akash", "Preeti", "Sumit", "Ankita", "Rajesh", "Shweta", "Tarun",
];

const LAST = [
  "Sharma", "Verma", "Patel", "Singh", "Kumar", "Gupta", "Joshi", "Mehta",
  "Shah", "Yadav", "Mishra", "Pandey", "Dubey", "Chauhan", "Nair", "Iyer",
  "Reddy", "Rao", "Pillai", "Malhotra", "Kapoor", "Sinha", "Bose", "Das",
  "Trivedi", "Agarwal", "Saxena", "Tiwari", "Bhatt", "Desai",
];

const TITLES = [
  "VP of Sales", "CTO", "CEO", "Founder", "Head of Operations", "Product Lead",
  "Procurement Manager", "Digital Marketing Head", "Engineering Manager", "COO",
  "CFO", "Head of Growth", "Business Development Manager", "Solutions Architect",
  "IT Director", "AGM Sales", "DGM Operations", "Zonal Manager",
];

const TAGS = [
  "decision-maker", "champion", "technical", "finance", "executive", "warm",
  "vip", "influencer", "saas", "enterprise",
];

const SOURCES = ["Website", "Referral", "Cold Outreach", "Social", "Event", "Other"];

const NOTE_TEMPLATES = [
  (c) => `Discovery call with ${c} went well – strong interest in the enterprise module. Need to loop in a solutions engineer for the technical demo.`,
  (c) => `${c} raised concerns about GST compliance features. Prepare a detailed walkthrough before the next call.`,
  (c) => `Champion at ${c} is pushing internally; legal and procurement review is the main blocker right now.`,
  (c) => `Left a callback request for ${c}. Follow up by email if no response within 48 hours.`,
  (c) => `${c} wants SSO + Aadhaar-based verification support. Confirm timeline with product team before committing.`,
  (c) => `Great demo with ${c}. Two senior stakeholders engaged, decision expected before quarter end.`,
  (c) => `${c} is comparing us against a competitor on pricing. Emphasise our India-specific support SLA and onboarding.`,
  (c) => `Renewal conversation with ${c} – they are likely to expand licenses next quarter.`,
  (c) => `${c} requested an ISO 27001 certificate and data residency confirmation. Sent to the trust center.`,
  (c) => `Procurement at ${c} confirmed budget approval. Moving to contract redlines this week.`,
];

const TASK_TEMPLATES = [
  (c) => `Send proposal follow-up to ${c}`,
  (c) => `Schedule technical deep-dive with ${c}`,
  (c) => `Quarterly business review with ${c}`,
  (c) => `Draft ROI one-pager for ${c}`,
  (c) => `Share India case study with ${c}`,
  (c) => `Confirm contract redlines with ${c}`,
  (c) => `Book discovery call with ${c}`,
  (c) => `Send security and compliance docs to ${c}`,
  (c) => `Negotiate pricing with ${c}`,
  (c) => `Re-engage stalled deal at ${c}`,
];

const personName = () => `${pick(FIRST)} ${pick(LAST)}`;
const emailFor = (name, domain) =>
  `${slug(name.split(" ")[0])}@${domain}`;

const run = async () => {
  await connectDB();

  let user = await User.findOne({ email: "anuj@gmail.com" });
  if (user) {
    await Promise.all([
      Lead.deleteMany({ owner: user._id }),
      Contact.deleteMany({ owner: user._id }),
      Note.deleteMany({ owner: user._id }),
      Task.deleteMany({ owner: user._id }),
    ]);
  } else {
    user = await User.create({
      name: "Anuj",
      email: "anuj@gmail.com",
      password: "anuj@123",
      company: "Your Company",
    });
  }

  const owner = user._id;

  const stageOrder = { New: 0, Qualified: 0, Proposal: 0, Won: 0, Lost: 0 };
  const leadDocs = [];
  const usedCompanies = pickSome(COMPANIES, 40);

  for (let i = 0; i < 40; i++) {
    const [company, domain] = usedCompanies[i] || pick(COMPANIES);
    const name = personName();
    const status = weighted([
      ["New", 28], ["Qualified", 24], ["Proposal", 20], ["Won", 16], ["Lost", 12],
    ]);
    const ageDays =
      status === "Won" || status === "Lost" ? rand(20, 175) : rand(0, 120);

    leadDocs.push({
      owner,
      name,
      email: emailFor(name, domain),
      phone: `+91 98${rand(10, 99)} ${rand(10000, 99999)}`,
      company,
      status,
      priority: weighted([["High", 35], ["Medium", 45], ["Low", 20]]),
      source: pick(SOURCES),
      value: rand(8, 220) * 1000,
      notes: pick([
        "Inbound from website demo request.",
        "Referred by an existing customer.",
        "Met at TechSparks Bangalore – strong technical fit.",
        "Cold outreach via LinkedIn, early stage.",
        "Trial active, multiple stakeholders engaged.",
        "",
      ]),
      tags: pickSome(["saas", "enterprise", "smb", "priority"], rand(0, 2)),
      order: stageOrder[status]++,
      createdAt: daysAgo(ageDays),
      updatedAt: daysAgo(rand(0, Math.min(ageDays, 14))),
    });
  }

  const leads = await Lead.insertMany(leadDocs);

  const contactDocs = [];
  for (let i = 0; i < 26; i++) {
    const [company, domain] = pick(COMPANIES);
    const name = personName();
    contactDocs.push({
      owner,
      name,
      title: pick(TITLES),
      company,
      email: emailFor(name, domain),
      phone: `+91 99${rand(10, 99)} ${rand(10000, 99999)}`,
      tags: pickSome(TAGS, rand(1, 3)),
      favorite: Math.random() < 0.22,
      notes: Math.random() < 0.5 ? pick([
        "Primary point of contact.",
        "Prefers WhatsApp over calls.",
        "Met at SaaS Summit Mumbai 2025.",
        "Key technical evaluator.",
      ]) : "",
      createdAt: daysAgo(rand(0, 160)),
    });
  }

  await Contact.insertMany(contactDocs);

  const noteDocs = [];
  for (let i = 0; i < 22; i++) {
    const lead = pick(leads);
    noteDocs.push({
      owner,
      content: pick(NOTE_TEMPLATES)(lead.company),
      lead: lead._id,
      pinned: Math.random() < 0.25,
      createdAt: daysAgo(rand(0, 90)),
    });
  }

  await Note.insertMany(noteDocs);

  const taskDocs = [];
  for (let i = 0; i < 28; i++) {
    const lead = pick(leads);
    const bucket = weighted([
      ["overdue", 22], ["today", 12], ["upcoming", 46], ["completed", 20],
    ]);
    let dueDate, status, completedAt = null;
    if (bucket === "overdue") {
      dueDate = daysAgo(rand(1, 18));
      status = weighted([["Pending", 60], ["In Progress", 40]]);
    } else if (bucket === "today") {
      dueDate = new Date();
      status = weighted([["Pending", 50], ["In Progress", 50]]);
    } else if (bucket === "upcoming") {
      dueDate = daysAhead(rand(1, 30));
      status = weighted([["Pending", 65], ["In Progress", 35]]);
    } else {
      dueDate = daysAgo(rand(1, 20));
      status = "Completed";
      completedAt = daysAgo(rand(0, 10));
    }

    taskDocs.push({
      owner,
      title: pick(TASK_TEMPLATES)(lead.company),
      description: Math.random() < 0.5
        ? pick([
            "Reference the latest proposal and pricing.",
            "Coordinate with the solutions engineering team.",
            "Confirm the next steps and decision timeline.",
            "",
          ])
        : "",
      dueDate,
      status,
      priority: weighted([["High", 35], ["Medium", 45], ["Low", 20]]),
      relatedLead: lead._id,
      completedAt,
      createdAt: daysAgo(rand(0, 40)),
    });
  }

  await Task.insertMany(taskDocs);

  console.log("✅ Seed complete for Anuj's workspace:");
  console.log(`   • ${leads.length} leads`);
  console.log(`   • ${contactDocs.length} contacts`);
  console.log(`   • ${noteDocs.length} notes`);
  console.log(`   • ${taskDocs.length} tasks`);
  console.log("   Login → anuj@gmail.com / anuj@123");

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error("Seed failed:", err);
});