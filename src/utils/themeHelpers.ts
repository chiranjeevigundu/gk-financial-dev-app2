// Maps common tailwind colors to their hex values for CSS variable injection
export const tailwindColorScales = {
    indigo: [
        '#eef2ff', // 50
        '#e0e7ff', // 100
        '#c7d2fe', // 200
        '#a5b4fc', // 300
        '#818cf8', // 400
        '#6366f1', // 500
        '#4f46e5', // 600
        '#4338ca', // 700
        '#3730a3', // 800
        '#312e81', // 900
        '#1e1b4b', // 950
    ],
    emerald: [
        '#ecfdf5',
        '#d1fae5',
        '#a7f3d0',
        '#6ee7b7',
        '#34d399',
        '#10b981',
        '#059669',
        '#047857',
        '#065f46',
        '#064e3b',
        '#022c22',
    ],
    amber: [
        '#fffbeb',
        '#fef3c7',
        '#fde68a',
        '#fcd34d',
        '#fbbf24',
        '#f59e0b',
        '#d97706',
        '#b45309',
        '#92400e',
        '#78350f',
        '#451a03',
    ],
    rose: [
        '#fff1f2',
        '#ffe4e6',
        '#fecdd3',
        '#fda4af',
        '#fb7185',
        '#f43f5e',
        '#e11d48',
        '#be123c',
        '#9f1239',
        '#881337',
        '#4c0519',
    ],
    sky: [
        '#f0f9ff',
        '#e0f2fe',
        '#bae6fd',
        '#7dd3fc',
        '#38bdf8',
        '#0ea5e9',
        '#0284c7',
        '#0369a1',
        '#075985',
        '#0c4a6e',
        '#082f49',
    ],
    violet: [
        '#f5f3ff',
        '#ede9fe',
        '#ddd6fe',
        '#c4b5fd',
        '#a78bfa',
        '#8b5cf6',
        '#7c3aed',
        '#6d28d9',
        '#5b21b6',
        '#4c1d95',
        '#2e1065',
    ]
};

export function getTailwindColorScale(color: string): string[] {
    return tailwindColorScales[color as keyof typeof tailwindColorScales] || tailwindColorScales.indigo;
}
