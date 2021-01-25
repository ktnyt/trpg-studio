import { HSLA } from '@/utils/color'

import { createPalette } from './palette'

export const nord = createPalette(
  {
    night: new HSLA(220, 16, 22),
    snow: new HSLA(218, 27, 98),
    red: '#bf616a',
    orange: '#d08770',
    yellow: '#ebcb8b',
    green: '#a3be8c',
    teal: '#8fbcbb',
    cyan: '#88c0d0',
    blue: '#81a1c1',
    indigo: '#5e81ac',
    magenta: '#b48ead',
  },
  {
    primary: ['indigo', 'snow'],
    secondary: ['cyan', 'night'],
    tertiary: ['blue', 'night'],
    success: ['green', 'night'],
    warning: ['yellow', 'night'],
    danger: ['red', 'snow'],
    dark: ['night', 'snow'],
    medium: [['snow', 'night', 50], 'snow'],
    light: ['indigo', 'night'],
    text: 'night',
    background: 'snow',
  }
)
