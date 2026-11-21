tailwind.config = {
    theme: {
        extend: {
            colors: {
                ink: '#203247',
                muted: '#748396',
                line: '#e5eaf0',
                bglight: '#f4f7fb',
                violetbrand: '#7658c9',
                vs: '#e7e0f8',
                bluebrand: '#4c85b3',
                bs: '#deedf8',
                redbrand: '#c12633',
                rs: '#ffdfe1',
                greenbrand: '#3d8b78',
                gs: '#e4f9f3',
            },
            // Custom breakpoints for better mobile-first responsive design
            screens: {
                'xs': '320px',   // Extra small phones
                'sm': '640px',   // Small phones and tablets
                'md': '768px',   // Tablets
                'lg': '1024px',  // Large tablets and small desktops
                'xl': '1280px',  // Desktop
                '2xl': '1536px', // Large desktop
            },
            // Spacing improvements
            spacing: {
                '4.5': '1.125rem',
                '8.5': '2.125rem',
            },
            // Font sizes for better scaling
            fontSize: {
                'xs': ['11px', '14px'],
                'sm': ['12px', '16px'],
                'base': ['14px', '20px'],
                'lg': ['16px', '24px'],
                'xl': ['18px', '28px'],
                '2xl': ['20px', '32px'],
                '3xl': ['24px', '36px'],
                '4xl': ['30px', '42px'],
            },
            // Responsive image sizing
            maxWidth: {
                'screen-xs': '320px',
                'screen-sm': '640px',
                'screen-md': '768px',
                'screen-lg': '1024px',
                'screen-xl': '1280px',
            },
            // Safe area insets for notched devices
            padding: {
                'safe': 'max(1rem, env(safe-area-inset-bottom))',
            },
            // Touch target sizing
            minHeight: {
                'touch': '44px', // Recommended minimum for touch targets
            },
            minWidth: {
                'touch': '44px',
            },
        }
    },
    // Responsive variants
    variants: {
        extend: {
            margin: ['responsive'],
            padding: ['responsive'],
            width: ['responsive'],
            height: ['responsive'],
            display: ['responsive'],
            gap: ['responsive'],
            fontSize: ['responsive'],
        }
    }
}