/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "resume",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: { aws: { region: "us-east-1" } },
    };
  },
  async run() {
    // Set RESUME_DOMAIN=jhorlin.com only after the Route 53 transfer completes
    // (No-IP ticket #1065257) and the hosted zone exists in this account.
    const domain = process.env.RESUME_DOMAIN;
    const enableRum = process.env.ENABLE_RUM === "true";

    let rumEnvironment: Record<string, $util.Input<string>> = {};
    if (enableRum) {
      const identityPool = new aws.cognito.IdentityPool("RumIdentityPool", {
        identityPoolName: `resume-rum-${$app.stage}`,
        allowUnauthenticatedIdentities: true,
      });
      const guestRole = new aws.iam.Role("RumGuestRole", {
        assumeRolePolicy: identityPool.id.apply((id) =>
          JSON.stringify({
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Principal: { Federated: "cognito-identity.amazonaws.com" },
                Action: "sts:AssumeRoleWithWebIdentity",
                Condition: {
                  StringEquals: { "cognito-identity.amazonaws.com:aud": id },
                  "ForAnyValue:StringLike": {
                    "cognito-identity.amazonaws.com:amr": "unauthenticated",
                  },
                },
              },
            ],
          })
        ),
      });
      new aws.cognito.IdentityPoolRoleAttachment("RumRoleAttachment", {
        identityPoolId: identityPool.id,
        roles: { unauthenticated: guestRole.arn },
      });
      const monitor = new aws.rum.AppMonitor("SiteMonitor", {
        name: `resume-${$app.stage}`,
        domain: domain ?? "*.cloudfront.net",
        appMonitorConfiguration: {
          allowCookies: false,
          enableXray: false,
          sessionSampleRate: 1,
          telemetries: ["performance", "errors", "http"],
          guestRoleArn: guestRole.arn,
          identityPoolId: identityPool.id,
        },
      });
      new aws.iam.RolePolicy("RumGuestPolicy", {
        role: guestRole.id,
        policy: monitor.arn.apply((arn) =>
          JSON.stringify({
            Version: "2012-10-17",
            Statement: [{ Effect: "Allow", Action: "rum:PutRumEvents", Resource: arn }],
          })
        ),
      });
      rumEnvironment = {
        VITE_RUM_APP_MONITOR_ID: monitor.appMonitorId,
        VITE_RUM_REGION: "us-east-1",
        VITE_RUM_IDENTITY_POOL_ID: identityPool.id,
        VITE_RUM_GUEST_ROLE_ARN: guestRole.arn,
      };
    }

    const site = new sst.aws.StaticSite("Site", {
      build: { command: "npm run build", output: "dist" },
      errorPage: "index.html",
      domain: domain ? { name: domain, redirects: [`www.${domain}`] } : undefined,
      environment: {
        VITE_SKILLFABER_WIDGET_SRC:
          process.env.SKILLFABER_WIDGET_SRC ?? "https://skillfaber.com/embed.js",
        VITE_SKILLFABER_WIDGET_TOKEN: process.env.SKILLFABER_WIDGET_TOKEN ?? "",
        ...rumEnvironment,
      },
    });

    return { url: site.url };
  },
});
