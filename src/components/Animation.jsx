import React, { useEffect, useRef, useState } from 'react';

/**
 * Custom hook to detect when an element enters the viewport.
 * Uses IntersectionObserver with a gentle threshold and unobserves after triggering once.
 */
export function useInView({ threshold = 0.12, rootMargin = '0px 0px -40px 0px' } = {}) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    // If reduced motion is requested, instantly set visible
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsInView(true);
      return;
    }

    // SSR or no IntersectionObserver support fallback
    if (!('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(element);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [threshold, rootMargin]);

  return [ref, isInView];
}

/**
 * Reusable ScrollReveal wrapper.
 * Directions: 'up' (bottom->center), 'left' (left->center), 'right' (right->center), 'scale', 'none'
 */
export const ScrollReveal = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 650,
  className = '',
  as: Component = 'div',
  threshold = 0.12,
  ...rest
}) => {
  const [ref, isInView] = useInView({ threshold });

  const directionClass = {
    up: 'reveal-up',
    left: 'reveal-left',
    right: 'reveal-right',
    scale: 'reveal-scale',
    none: ''
  }[direction] || 'reveal-up';

  return (
    <Component
      ref={ref}
      className={`reveal-base ${directionClass} ${isInView ? 'reveal-visible' : ''} ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}ms`
      }}
      {...rest}
    >
      {children}
    </Component>
  );
};

/**
 * Convenience shortcuts
 */
export const FadeUp = (props) => <ScrollReveal direction="up" {...props} />;
export const FadeLeft = (props) => <ScrollReveal direction="left" {...props} />;
export const FadeRight = (props) => <ScrollReveal direction="right" {...props} />;

/**
 * Stagger Container & Stagger Item for cards, steps, and lists.
 * Automatically distributes delays (default 80ms increments).
 */
export const StaggerContainer = ({
  children,
  className = '',
  as: Component = 'div',
  staggerMs = 80,
  baseDelay = 0,
  direction = 'up'
}) => {
  return (
    <Component className={className}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        return (
          <ScrollReveal
            direction={child.props.revealDirection || direction}
            delay={baseDelay + index * staggerMs}
            className={child.props.wrapperClassName || ''}
          >
            {child}
          </ScrollReveal>
        );
      })}
    </Component>
  );
};

/**
 * Page Transition Wrapper for smooth route transitions
 */
export const PageTransition = ({ children, className = '' }) => {
  return (
    <div className={`page-enter ${className}`}>
      {children}
    </div>
  );
};

export default ScrollReveal;
