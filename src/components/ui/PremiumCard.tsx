import type { ReactNode } from "react";
import "./premium-card.css";

type PremiumCardProps = {
  children: ReactNode;
  className?: string;
};

export function PremiumCard({
  children,
  className = "",
}: PremiumCardProps) {
  return (
    <div className={`premium-card ${className}`}>
      <div className="premium-card__shine" aria-hidden="true" />

      <div className="premium-card__background" aria-hidden="true">
        {Array.from({ length: 20 }, (_, index) => (
          <span
            key={index}
            className={`premium-card__tile premium-card__tile-${index + 1}`}
          />
        ))}
      </div>

      <div className="premium-card__lines" aria-hidden="true">
        <span className="premium-card__line premium-card__line-1" />
        <span className="premium-card__line premium-card__line-2" />
        <span className="premium-card__line premium-card__line-3" />
        <span className="premium-card__line premium-card__line-4" />
      </div>

      <div className="premium-card__content">
        {children}
      </div>
    </div>
  );
}
