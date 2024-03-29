import { Config } from "@stencil/core";

export const config: Config = {
  namespace: "webpresscore",
  outputTargets: [
    {
      type: "dist",
      esmLoaderPath: "../loader",
      copy: [{ src: "theme-overlay" }],
    },
  ],
};
