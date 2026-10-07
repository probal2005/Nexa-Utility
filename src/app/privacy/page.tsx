import type { Metadata } from "next";

import { PrivacyCenter } from "@/features/privacy/components/PrivacyCenter";

export const metadata: Metadata = {
  title: "Privacy Center",
  description:
    "Manage Nexa Utility permissions and privacy controls.",
};

export default function PrivacyPage() {
  return <PrivacyCenter />;
}
