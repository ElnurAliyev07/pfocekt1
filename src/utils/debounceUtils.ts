export const debounce = <Args extends unknown[]>(
    func: (...args: Args) => void,
    delay: number
  ): ((...args: Args) => void) => {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: Args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
};
  