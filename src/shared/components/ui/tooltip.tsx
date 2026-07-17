"use client";

import { Tooltip as TooltipPrimitive } from "@base-ui-components/react/tooltip";
import * as React from "react";

import { cn } from "@/src/shared/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

type TooltipContentProps = React.ComponentProps<typeof TooltipPrimitive.Popup> & {
	side?: React.ComponentProps<typeof TooltipPrimitive.Positioner>["side"];
	align?: React.ComponentProps<typeof TooltipPrimitive.Positioner>["align"];
	sideOffset?: number;
};

function TooltipContent({
	className,
	side = "top",
	align = "center",
	sideOffset = 4,
	children,
	...props
}: TooltipContentProps) {
	return (
		<TooltipPrimitive.Portal>
			<TooltipPrimitive.Positioner side={side} align={align} sideOffset={sideOffset}>
				<TooltipPrimitive.Popup
					className={cn(
						"z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
						className,
					)}
					{...props}
				>
					{children}
				</TooltipPrimitive.Popup>
			</TooltipPrimitive.Positioner>
		</TooltipPrimitive.Portal>
	);
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
