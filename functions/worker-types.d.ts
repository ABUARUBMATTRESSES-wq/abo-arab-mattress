// Minimal ambient types for Pages Functions so the Next.js type-check passes
// without adding a dependency. Wrangler provides the real types at deploy time.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare type D1Database = any;
declare type PagesFunction<Env = unknown> = (context: {
  request: Request;
  env: Env;
}) => Promise<Response> | Response;
