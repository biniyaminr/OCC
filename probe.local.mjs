import { createServer } from "vite";
const root = "/Users/biniyamdereje/Benjamin/propro/OCC Global Source";
const server = await createServer({ root, server: { middlewareMode: true }, appType: "custom", logLevel: "error" });
globalThis.window ??= { addEventListener(){}, removeEventListener(){}, dispatchEvent(){return true;}, location:{href:"http://localhost"} };
globalThis.document ??= { cookie: "" };
try {
  const { createClient } = await server.ssrLoadModule("/src/lib/supabase/client.ts");
  const c = createClient();
  console.log("client constructed in node harness:", !!c);
  // Read-only: does the anon key see any messages? (RLS should hide all.)
  const { data, error, count } = await c.from("messages").select("*", { count: "exact", head: true });
  console.log("anon count query -> count:", count, "error:", error?.message ?? "none");
} catch (e) {
  console.log("client construction FAILED in node:", e.message.slice(0,120));
}
await server.close();
