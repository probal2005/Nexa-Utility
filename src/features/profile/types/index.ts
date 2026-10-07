export type ProfileSocials = {
  github: string;
  linkedin: string;
  website: string;
};

export type ProfileData = {
  displayName: string;
  username: string;
  headline: string;
  bio: string;
  location: string;
  education: string;
  avatar: string;
  cover: string;
  socials: ProfileSocials;
  skills: string[];
  joinedLabel: string;
};

export const DEFAULT_PROFILE: ProfileData = {
  displayName: "Probal Dhali",
  username: "probal2005",
  headline: "AIML Student • Web Developer",
  bio: "Building practical web applications with modern technologies, while exploring AI and machine learning.",
  location: "India",
  education: "Artificial Intelligence & Machine Learning",
  avatar: "",
  cover: "",
  socials: {
    github: "https://github.com/probal2005",
    linkedin: "https://linkedin.com/in/probal-dhali-a7569934a",
    website: "https://probaldhali.vercel.app/",
  },
  skills: [
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Python",
    "AI/ML",
  ],
  joinedLabel: "Nexa Utility member",
};
