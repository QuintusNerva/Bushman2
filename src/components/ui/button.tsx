import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

const buttonVariants = (props: { variant?: string; size?: string }) => {
  const { variant = "default", size = "default" } = props;
  return cn(
    "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1419] disabled:pointer-events-none disabled:opacity-50",
    {
      "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl hover:scale-[1.02]": variant === "default",
      "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl": variant === "destructive",
      "border border-white/20 bg-white/5 hover:bg-white/10 text-white backdrop-blur-xl": variant === "outline",
      "bg-white/10 text-white hover:bg-white/20 backdrop-blur-xl": variant === "secondary",
      "hover:bg-white/10 text-slate-300 hover:text-white": variant === "ghost",
      "text-blue-400 underline-offset-4 hover:underline": variant === "link",
      "h-10 px-4 py-2": size === "default",
      "h-9 rounded-lg px-3": size === "sm",
      "h-11 rounded-lg px-8": size === "lg",
      "h-10 w-10 p-0": size === "icon",
    }
  );
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
