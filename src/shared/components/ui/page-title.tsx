import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const pageTitleVariants = cva("font-['Montserrat',sans-serif] font-normal", {
  variants: {
    variant: {
      h1: "text-black text-[24px] font-normal leading-9",
      h2: "text-black text-base font-normal leading-6",
      h3: "text-[#111827] text-lg font-semibold leading-[27px]",
    },
  },
  defaultVariants: {
    variant: "h1",
  },
});

export interface PageTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof pageTitleVariants> {
  asChild?: boolean;
}

const variantToElement = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
} as const;

const PageTitle = React.forwardRef<HTMLHeadingElement, PageTitleProps>(
  ({ className, variant = "h1", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : variantToElement[variant ?? "h1"];

    return (
      <Comp
        ref={ref}
        className={cn(pageTitleVariants({ variant }), className)}
        {...props}
      />
    );
  }
);
PageTitle.displayName = "PageTitle";

export { PageTitle, pageTitleVariants };
