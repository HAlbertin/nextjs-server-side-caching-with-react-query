import { useEffect } from "react";

export const useIntersectionObserver = (
  ref: React.RefObject<Element | null>,
  callback: () => void,
  options?: IntersectionObserverInit,
) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry.isIntersecting) callback();
      },
      { threshold: 0, ...options },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [ref, callback, options]);
};
