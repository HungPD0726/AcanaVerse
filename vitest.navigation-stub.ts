export function usePathname() {
  return "/en/reading/daily-insight";
}

export function useRouter() {
  return {
    push: () => undefined,
    replace: () => undefined,
    prefetch: () => undefined,
    back: () => undefined,
    forward: () => undefined,
    refresh: () => undefined,
  };
}

export function redirect() {
  return undefined;
}

export function permanentRedirect() {
  return undefined;
}

export function notFound() {
  return undefined;
}
