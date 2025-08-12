import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				bungee: ['Bungee', 'sans-serif'],
				poppins: ['Poppins', 'sans-serif'],
			},
			borderWidth: {
				'3': '3px',
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				'card-border': 'hsl(var(--card-border))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Summons Extended Palette
				'dark-purple': 'hsl(var(--dark-purple))',
				'purple': 'hsl(var(--purple))',
				'light-purple': 'hsl(var(--light-purple))',
				'magenta-2': 'hsl(var(--magenta-2))',
				'magenta': 'hsl(var(--magenta))',
				'pink': 'hsl(var(--pink))',
				'light-pink': 'hsl(var(--light-pink))',
				'lightest-pink': 'hsl(var(--lightest-pink))'
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-hero': 'var(--gradient-hero)',
				'gradient-card': 'var(--gradient-card)'
			},
			boxShadow: {
				'primary': 'var(--shadow-primary)',
				'accent': 'var(--shadow-accent)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				// Accordion animations
				'accordion-down': {
					from: { height: '0', opacity: '0' },
					to: { height: 'var(--radix-accordion-content-height)', opacity: '1' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
					to: { height: '0', opacity: '0' }
				},

				// Entrance animations
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-in-up': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-in-down': {
					'0%': { opacity: '0', transform: 'translateY(-20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-in-left': {
					'0%': { opacity: '0', transform: 'translateX(-20px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				},
				'fade-in-right': {
					'0%': { opacity: '0', transform: 'translateX(20px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				},

				// Scale animations
				'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'scale-in-bounce': {
					'0%': { transform: 'scale(0.3)', opacity: '0' },
					'50%': { transform: 'scale(1.05)', opacity: '0.8' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'scale-out': {
					'0%': { transform: 'scale(1)', opacity: '1' },
					'100%': { transform: 'scale(0.95)', opacity: '0' }
				},

				// Slide animations
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' }
				},
				'slide-in-left': {
					'0%': { transform: 'translateX(-100%)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' }
				},
				'slide-up': {
					'0%': { transform: 'translateY(100%)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},

				// Attention animations
				'bounce-subtle': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' }
				},
				'pulse-glow': {
					'0%, 100%': { opacity: '1', transform: 'scale(1)' },
					'50%': { opacity: '0.8', transform: 'scale(1.02)' }
				},
				'wiggle': {
					'0%, 100%': { transform: 'rotate(0deg)' },
					'25%': { transform: 'rotate(-1deg)' },
					'75%': { transform: 'rotate(1deg)' }
				},
				'shake': {
					'0%, 100%': { transform: 'translateX(0)' },
					'10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
					'20%, 40%, 60%, 80%': { transform: 'translateX(2px)' }
				},

				// Loading animations
				'spin-slow': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' }
				},
				'ping-slow': {
					'75%, 100%': { transform: 'scale(1.1)', opacity: '0' }
				},

				// Progress animations
				'progress-indeterminate': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' }
				},

				// Number counting animation
				'count-up': {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},

				// Floating animations
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'float-delayed': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-8px)' }
				},

				// Gradient animations
				'gradient-x': {
					'0%, 100%': { 'background-size': '200% 200%', 'background-position': 'left center' },
					'50%': { 'background-size': '200% 200%', 'background-position': 'right center' }
				},

				// Heartbeat animation
				'heartbeat': {
					'0%': { transform: 'scale(1)' },
					'14%': { transform: 'scale(1.1)' },
					'28%': { transform: 'scale(1)' },
					'42%': { transform: 'scale(1.1)' },
					'70%': { transform: 'scale(1)' }
				},

				// Typewriter effect
				'typewriter': {
					'0%': { width: '0' },
					'100%': { width: '100%' }
				},

				// Confetti celebration
				'confetti': {
					'0%': { transform: 'rotateZ(0deg) translateY(0px) rotateX(0deg)', opacity: '1' },
					'100%': { transform: 'rotateZ(720deg) translateY(-300px) rotateX(180deg)', opacity: '0' }
				},

				// Stagger reveals
				'stagger-1': { 'animation-delay': '0.1s' },
				'stagger-2': { 'animation-delay': '0.2s' },
				'stagger-3': { 'animation-delay': '0.3s' }
			},
			animation: {
				// Basic animations
				'accordion-down': 'accordion-down 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
				'accordion-up': 'accordion-up 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

				// Entrance animations
				'fade-in': 'fade-in 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
				'fade-in-fast': 'fade-in 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
				'fade-in-slow': 'fade-in 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
				'fade-in-up': 'fade-in-up 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
				'fade-in-down': 'fade-in-down 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
				'fade-in-left': 'fade-in-left 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
				'fade-in-right': 'fade-in-right 0.6s cubic-bezier(0.4, 0, 0.2, 1)',

				// Scale animations
				'scale-in': 'scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
				'scale-in-bounce': 'scale-in-bounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
				'scale-out': 'scale-out 0.2s cubic-bezier(0.4, 0, 0.2, 1)',

				// Slide animations
				'slide-in-right': 'slide-in-right 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
				'slide-in-left': 'slide-in-left 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
				'slide-up': 'slide-up 0.4s cubic-bezier(0.4, 0, 0.2, 1)',

				// Attention animations
				'bounce-subtle': 'bounce-subtle 1s ease-in-out infinite',
				'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'wiggle': 'wiggle 0.5s ease-in-out',
				'shake': 'shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97)',

				// Loading animations
				'spin-slow': 'spin-slow 3s linear infinite',
				'ping-slow': 'ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite',

				// Progress animations
				'progress-indeterminate': 'progress-indeterminate 2s ease-in-out infinite',

				// Counting animations
				'count-up': 'count-up 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

				// Floating animations
				'float': 'float 3s ease-in-out infinite',
				'float-delayed': 'float-delayed 3s ease-in-out infinite 1.5s',

				// Gradient animations
				'gradient-x': 'gradient-x 3s ease infinite',

				// Special animations
				'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
				'typewriter': 'typewriter 3s steps(20, end)',
				'confetti': 'confetti 3s ease-out infinite',

				// Combined animations
				'enter': 'fade-in 0.5s ease-out, scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
				'exit': 'fade-out 0.3s ease-out, scale-out 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
