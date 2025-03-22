/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
  darkMode: ['class'],
  // important: true,
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    screens: {
      xs: '475px',
      ...defaultTheme.screens
    },
    extend: {
      fontFamily: {
        poppins: ['var(--font-poppins)', 'sans-serif'],
        playfair: ['var(--font-playfair)'],
        oleo: ['var(--font-oleo)', 'sans-serif'],
        nunito: ['var(--font-nunito)', 'sans-serif']
      },
      colors: {
        primary: {
          DEFAULT: '#590d82',
          light: '#6f1d96',
          dark: '#450a68',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: '#9b51e0',
          light: '#ab69e6',
          dark: '#8c39d9',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        arv: '#22c55e',
        'off-white': '#F8F9FA',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))'
        }
      },
      animation: {
        'caret-blink': 'caret-blink 1.25s ease-out infinite',
        fadeDelayed: 'fadeOut 0s 0.5s ease-in-out forwards',
        fade: 'fadeOut 0.3s ease-in-out forwards',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      },
      gradients: {
        'purple-pink': ['45deg', '#3023AE 0%', '#FF0099 100%']
      },
      keyframes: {
        'caret-blink': {
          '0%,70%,100%': { opacity: '1' },
          '20%,50%': { opacity: '0' }
        },
        fadeOut: {
          '0%': {
            opacity: 0
          },
          '100%': {
            opacity: 1
          }
        },
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
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-shine':
          'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
        'hero-pattern': "url('/images/hero-pattern.svg')",
        'purple-gradient': 'linear-gradient(90deg, #590d82 0%, #9b87f5 100%)',
        'blue-purple-gradient':
          'linear-gradient(90deg, #33C3F0 0%, #9b87f5 100%)',
        'pink-purple-gradient':
          'linear-gradient(90deg, #D946EF 0%, #9b87f5 100%)',
        'stepper-line-completed': 'var(--stepper-line-completed)'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};
