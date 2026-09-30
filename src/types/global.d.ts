export {};

type LenisLike = {
  scrollTo: (
    target: number | string | HTMLElement,
    options?: { offset?: number; immediate?: boolean; duration?: number },
  ) => void;
  stop: () => void;
  start: () => void;
};

declare global {
  interface Window {
    __lenis?: LenisLike;
  }
}
