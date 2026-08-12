interface RumConfig {
  id?: string;
  region?: string;
  identityPoolId?: string;
  guestRoleArn?: string;
}

export function initRum(
  config: RumConfig = {
    id: import.meta.env.VITE_RUM_APP_MONITOR_ID,
    region: import.meta.env.VITE_RUM_REGION,
    identityPoolId: import.meta.env.VITE_RUM_IDENTITY_POOL_ID,
    guestRoleArn: import.meta.env.VITE_RUM_GUEST_ROLE_ARN,
  }
): boolean {
  const { id, region, identityPoolId, guestRoleArn } = config;
  if (!id || !region || !identityPoolId || !guestRoleArn) return false;

  const w = window as typeof window & {
    AwsRumClient?: unknown;
    cwr?: (command: string, payload: unknown) => void;
  };
  const client = {
    q: [] as Array<{ c: string; p: unknown }>,
    n: "cwr",
    i: id,
    v: "1.0.0",
    r: region,
    c: {
      sessionSampleRate: 1,
      guestRoleArn,
      identityPoolId,
      endpoint: `https://dataplane.rum.${region}.amazonaws.com`,
      telemetries: ["performance", "errors", "http"],
      allowCookies: false,
      enableXRay: false,
    },
  };
  w.AwsRumClient = client;
  w.cwr = (command, payload) => client.q.push({ c: command, p: payload });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://client.rum.${region}.amazonaws.com/1.x/cwr.js`;
  script.dataset.rum = "true";
  document.head.appendChild(script);
  return true;
}
