import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  href?: string;
  linkText?: string;
  className?: string;
}

const SectionHeader = ({ title, subtitle, href, linkText = "View All", className }: SectionHeaderProps) => {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8", className)}>
      <div>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">{title}</h2>
        {subtitle && (
          <p className="text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
      {href && (
        <Link 
          href={href} 
          className="group flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          {linkText}
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
};

export default SectionHeader;
