export function injectWidget(
  doc: Document,
  src: string | undefined,
  token: string | undefined
): boolean {
  if (!src || !token) return false;
  const script = doc.createElement("script");
  script.src = src;
  script.async = true;
  script.dataset.skillfaberToken = token;
  doc.body.appendChild(script);
  return true;
}
