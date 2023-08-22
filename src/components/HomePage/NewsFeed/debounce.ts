type DebounceFunction<T extends (...args: any[]) => Promise<any>> = (
  ...args: Parameters<T>
) => Promise<ReturnType<T>>;

export function debounce<T extends (...args: any[]) => Promise<any>>(
  func: T,
  delay: number,
): DebounceFunction<T> {
  let timerId: ReturnType<typeof setTimeout>;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timerId);

    return new Promise<ReturnType<T>>((resolve) => {
      timerId = setTimeout(async () => {
        resolve(await func.apply(this, args));
      }, delay);
    });
  };
}
