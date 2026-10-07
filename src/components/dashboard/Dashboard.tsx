import { AnimatedHero } from "@/components/dashboard/AnimatedHero";
import { AVAILABLE_TOOLS } from "@/config/tools";

export default function Dashboard() {
  return (
    <div className="nexa-home min-w-0 overflow-x-clip">
      <AnimatedHero toolCount={AVAILABLE_TOOLS.length} />
    </div>
  );
}
