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
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'gradient-shift': {
					'0%': { backgroundPosition: '0% 50%' },
					'25%': { backgroundPosition: '100% 25%' },
					'50%': { backgroundPosition: '0% 75%' },
					'75%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' }
				},
				'fade-in-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'scale-fade-in': {
					'0%': {
						opacity: '0',
						transform: 'scale(0.95)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0px)'
					},
					'50%': {
						transform: 'translateY(-5px)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'gradient-shift': 'gradient-shift 10s ease-in-out infinite',
				'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
				'scale-fade-in': 'scale-fade-in 0.4s ease-out forwards',
				'float': 'float 3s ease-in-out infinite',
				'fade-in-up-delay-1': 'fade-in-up 0.6s ease-out 0.3s forwards',
				'fade-in-up-delay-2': 'fade-in-up 0.6s ease-out 0.6s forwards',
				'fade-in-up-delay-3': 'fade-in-up 0.6s ease-out 0.9s forwards',
				'fade-in-up-delay-4': 'fade-in-up 0.6s ease-out 1.2s forwards',
				'fade-in-up-delay-5': 'fade-in-up 0.6s ease-out 1.5s forwards',
				'fade-in-up-delay-6': 'fade-in-up 0.6s ease-out 1.8s forwards',
				'scale-fade-in-delay': 'scale-fade-in 0.4s ease-out 0.6s forwards'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
