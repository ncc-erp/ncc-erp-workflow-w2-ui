export const buttonTheme = {
  baseStyle: {
    fontWeight: '500',
    borderRadius: '6px',
  },
  sizes: {
    xs: {
      h: '24px',
      fontSize: '12px',
      px: '8px',
    },
    sm: {
      h: '32px',
      fontSize: '14px',
      px: '12px',
    },
    md: {
      h: '40px',
      fontSize: '14px',
      px: '16px',
    },
    lg: {
      h: '48px',
      fontSize: '16px',
      px: '20px',
    },
    xl: {
      h: '56px',
      fontSize: '18px',
      px: '24px',
    },
    full: {
      h: '50px',
      fontSize: '14px',
      px: '16px',
      w: 'full',
    },
  },
  variants: {
    primary: {
      bg: 'primary',
      color: 'white',
      _hover: {
        background: '#B43A3F',
      },
    },
  },
  defaultProps: {
    size: 'md',
  },
};
