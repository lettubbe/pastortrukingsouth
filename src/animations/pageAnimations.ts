export const pageSwing = {
  animate: (isMenuOpen: boolean) => ({
    y: isMenuOpen ? 550 : 0,
    x: 0,
    rotateZ: isMenuOpen ? -8 : 0,
    scale: isMenuOpen ? 1.35 : 1,
    transition: {
      duration: 0.8,
      ease: [0.6, 0, 0.4, 1] as any
    }
  })
};

export const pageEntrance = {
  initial: (isMobile: boolean) => {
    // console.log('PageEntrance initial:', isMobile);
    return {
      y: '900px',
      x: isMobile ? -60 : -120,
      rotateZ: isMobile ? -7 : -8,
      scale: isMobile ? 1.4 : 1.25
    };
  },
  animate: (isMobile: boolean) => ({
    y: 0,
    x: 0,
    rotateZ: 0,
    scale: 1,
    transition: {
      duration: 1.2,
      ease: [0.6, 0, 0.4, 1] as any
    }
  })
};