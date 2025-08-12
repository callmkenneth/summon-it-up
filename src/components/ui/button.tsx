import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-base font-bungee font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg hover:-translate-y-0.5",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md hover:shadow-lg hover:-translate-y-0.5",
        outline:
          "border border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm shadow-md hover:shadow-lg hover:-translate-y-0.5",
        secondary:
          "bg-light-pink text-primary hover:bg-light-pink/80 shadow-md hover:shadow-lg hover:-translate-y-0.5",
        ghost: "text-white hover:bg-white/10 backdrop-blur-sm hover:scale-105",
        link: "text-primary underline-offset-4 hover:underline hover:scale-105",
        hero: "bg-gradient-primary text-white hover:scale-105 shadow-accent font-bold rounded-[30px] hover:shadow-xl animated-gradient",
        rsvp: "bg-accent text-accent-foreground hover:bg-accent/90 shadow-accent rounded-[30px] hover:shadow-xl hover:scale-105 celebrate",
        reject: "bg-light-pink text-primary hover:bg-light-pink/80 shadow-md rounded-[30px] hover:shadow-lg hover:scale-105",
        waitlist: "bg-primary text-white border-[3px] border-white rounded-[30px] hover:bg-primary/90 hover:scale-105 pulse-ring",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 px-4 py-2",
        lg: "h-14 px-8 py-4 text-lg",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
