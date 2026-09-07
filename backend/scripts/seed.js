import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Education from "../models/Education.js";
import Course from "../models/Course.js";
import Subject from "../models/Subject.js";
import Chapter from "../models/Chapter.js";
import Enrollment from "../models/Enrollment.js";
import User from "../models/User.js";

const chapterText = (subject, title, n) =>
  `# ${title}\n\n## Overview\nThis chapter introduces **${title}** in the context of ${subject}. Focus on understanding the core idea before memorizing details.\n\n## Learning objectives\n- Explain the central concepts clearly.\n- Recognize where the concept is used.\n- Work through a small practical example.\n- Identify common mistakes.\n\n## Concept explanation\n${title} is an important part of ${subject}. Start by defining the problem it solves, then study the main operations, assumptions, and trade-offs. Connect each idea to a real software or academic scenario.\n\n## Example\nSuppose you are solving a small problem related to ${title}. Break it into input, process, and output. Compare at least two possible approaches and choose the one that best matches the constraints.\n\n## Important notes\n1. Understand why the method works.\n2. Track time/space or practical cost where relevant.\n3. Test edge cases.\n\n## Quick recap\nYou have completed chapter ${n}. Revisit the key terms and explain them in your own words before moving forward.`;

await connectDB();
await Promise.all([
  Enrollment.deleteMany({}),
  User.deleteMany({}),
  Chapter.deleteMany({}),
  Subject.deleteMany({}),
  Course.deleteMany({}),
  Education.deleteMany({}),
]);
const edDefs = [
  ...Array.from({ length: 12 }, (_, i) => ({
    name: `Grade ${i + 1}`,
    description: `School curriculum for Grade ${i + 1}`,
    requiresCourse: false,
    order: i + 1,
  })),
  {
    name: "B.Sc",
    description: "Bachelor of Science",
    requiresCourse: true,
    order: 20,
  },
  {
    name: "B.Tech",
    description: "Bachelor of Technology",
    requiresCourse: true,
    order: 21,
  },
  {
    name: "BBA",
    description: "Bachelor of Business Administration",
    requiresCourse: true,
    order: 22,
  },
  {
    name: "MBA",
    description: "Master of Business Administration",
    requiresCourse: true,
    order: 23,
  },
  {
    name: "MCA",
    description: "Master of Computer Applications",
    requiresCourse: true,
    order: 24,
  },
];
const eds = await Education.insertMany(edDefs);
const em = Object.fromEntries(eds.map((x) => [x.name, x]));
const courseDefs = {
  "B.Tech": [
    "Computer Science & Engineering",
    "Information Technology",
    "Civil Engineering",
    "Mechanical Engineering",
    "Electrical Engineering",
    "Electronics & Communication Engineering",
  ],
  "B.Sc": [
    "Computer Science",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
  ],
  BBA: [
    "General Management",
    "Finance",
    "Marketing",
    "Human Resources",
    "International Business",
  ],
  MBA: [
    "Finance",
    "Marketing",
    "Human Resources",
    "Operations",
    "Business Analytics",
    "International Business",
  ],
  MCA: ["Computer Applications", "Software Development", "Data Science"],
};
const courses = [];
for (const [ed, names] of Object.entries(courseDefs))
  for (const name of names)
    courses.push({
      name,
      shortName:
        name === "Computer Science & Engineering"
          ? "CSE"
          : name === "Information Technology"
            ? "IT"
            : name === "Electronics & Communication Engineering"
              ? "ECE"
              : "",
      education: em[ed]._id,
      description: `${name} pathway for ${ed} students.`,
    });
const cs = await Course.insertMany(courses);
const cse = cs.find((x) => x.name === "Computer Science & Engineering");
const subjects = [
  [
    "Data Structures",
    "Build strong foundations in organizing, storing and processing data.",
    [
      "Introduction to Data Structures",
      "Arrays",
      "Linked Lists",
      "Stacks",
      "Queues",
      "Trees",
      "Binary Search Trees",
      "Heaps",
      "Graphs",
      "Hashing",
    ],
  ],
  [
    "Database Management Systems",
    "Learn relational data modeling, SQL concepts, transactions and database design.",
    [
      "Database Fundamentals",
      "ER Model",
      "Relational Model",
      "SQL Basics",
      "Joins and Subqueries",
      "Normalization",
      "Transactions",
      "Indexing",
    ],
  ],
  [
    "Operating Systems",
    "Understand processes, threads, memory, files and resource management.",
    [
      "OS Overview",
      "Processes",
      "Threads",
      "CPU Scheduling",
      "Synchronization",
      "Deadlocks",
      "Memory Management",
      "File Systems",
    ],
  ],
  [
    "Computer Networks",
    "Learn how computers communicate across local and global networks.",
    [
      "Network Models",
      "Physical Layer",
      "Data Link Layer",
      "Network Layer",
      "Transport Layer",
      "Application Layer",
      "Routing",
      "Network Security Basics",
    ],
  ],
  [
    "Object Oriented Programming",
    "Master classes, objects, inheritance, polymorphism and clean object design.",
    [
      "OOP Foundations",
      "Classes and Objects",
      "Encapsulation",
      "Inheritance",
      "Polymorphism",
      "Abstraction",
      "Interfaces",
      "Design Principles",
    ],
  ],
  [
    "Software Engineering",
    "Study software processes, requirements, design, testing and maintenance.",
    [
      "Software Process",
      "Requirements",
      "System Design",
      "Agile Development",
      "Testing",
      "Version Control",
      "Maintenance",
    ],
  ],
  [
    "Web Development",
    "Learn core frontend, backend and web application architecture concepts.",
    [
      "How the Web Works",
      "HTML",
      "CSS",
      "JavaScript",
      "HTTP and APIs",
      "React Foundations",
      "Node and Express",
      "MongoDB Basics",
    ],
  ],
];
for (let i = 0; i < subjects.length; i++) {
  const [name, description, chs] = subjects[i];
  const s = await Subject.create({
    name,
    description,
    education: em["B.Tech"]._id,
    course: cse._id,
    order: i + 1,
  });
  await Chapter.insertMany(
    chs.map((title, j) => ({
      subject: s._id,
      title,
      chapterNumber: j + 1,
      description: `Learn ${title} in ${name}.`,
      content: chapterText(name, title, j + 1),
    })),
  );
}
for (let grade = 1; grade <= 12; grade++) {
  for (const [idx, name] of ["Mathematics", "Science", "English"].entries()) {
    const s = await Subject.create({
      name,
      description: `Grade ${grade} ${name} learning path.`,
      education: em[`Grade ${grade}`]._id,
      course: null,
      order: idx + 1,
    });
    await Chapter.insertMany(
      ["Foundations", "Core Concepts", "Practice and Review"].map(
        (title, j) => ({
          subject: s._id,
          title: `${title}`,
          chapterNumber: j + 1,
          description: `${name}: ${title}`,
          content: chapterText(`${name} - Grade ${grade}`, title, j + 1),
        }),
      ),
    );
  }
}
console.log("Seed complete");
await mongoose.disconnect();
