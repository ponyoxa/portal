// worker.ts
type Fetcher = {
  fetch: (req: Request) => Promise<Response>;
};

export interface Env {
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: Env) {
    // まずは静的アセットをそのまま返す
    const res = await env.ASSETS.fetch(request);
    if (res.status !== 404) return res;
    return res;
  },
};
