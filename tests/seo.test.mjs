import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { once } from "node:events";
import { test } from "node:test";

// Exercise the real SSR entry with an anonymous Supabase fixture, no private credentials.
test("catalog SEO is present in SSR and follows published product changes", async () => {
  let unavailable = false;
  const product = {
    custom: true,
    name: "Test Export Coffee",
    tagline: "Washed Ethiopian coffee for wholesale buyers.",
    overview: "Coffee </script><script>alert(1)</script> specifications.",
    image: "/favicon.png",
    categoryId: "coffee",
    regions: ["Guji"],
  };
  const database = createServer((req, res) => {
    assert.equal(req.headers.apikey, "sb_publishable_test");
    if (unavailable) {
      res.writeHead(503);
      res.end();
      return;
    }
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify([
        {
          value: {
            products: {
              "test-export-coffee": product,
              "yirgacheffe-coffee": { deleted: true },
              unfinished: { ...product, name: "New product" },
            },
          },
        },
      ]),
    );
  });
  database.listen(0, "127.0.0.1");
  await once(database, "listening");
  const port = 3198;
  const origin = "https://occ.example";
  const child = spawn(
    process.execPath,
    [
      "node_modules/vite/bin/vite.js",
      "--host",
      "127.0.0.1",
      "--port",
      String(port),
      "--strictPort",
    ],
    {
      env: {
        ...process.env,
        VITE_SITE_URL: origin,
        VITE_SUPABASE_URL: `http://127.0.0.1:${database.address().port}`,
        VITE_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test",
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  let logs = "";
  child.stdout.on("data", (data) => {
    logs += data;
  });
  child.stderr.on("data", (data) => {
    logs += data;
  });
  const get = (path, options) => fetch(`http://127.0.0.1:${port}${path}`, options);
  try {
    let ready = false;
    for (let attempt = 0; attempt < 150; attempt++) {
      try {
        await get("/robots.txt");
        ready = true;
        break;
      } catch {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }
    assert.ok(ready, `Vite did not start:\n${logs}`);
    const schemas = (html) =>
      [
        ...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g),
      ].map((match) => JSON.parse(match[1]));
    for (const path of [
      "/",
      "/partners",
      "/products/test-export-coffee",
      "/products/sidamo-coffee",
    ]) {
      const response = await get(path);
      const html = await response.text();
      assert.equal(response.status, 200, `${path}: ${html.slice(0, 500)}`);
      assert.ok(html.includes(`href="${origin}${path}"`), `absolute canonical for ${path}`);
      assert.equal((html.match(/rel="canonical"/g) ?? []).length, 1);
      assert.ok(html.includes('property="og:image"'));
      assert.ok(html.includes('name="twitter:description"'));
      assert.ok(schemas(html).length > 0, `JSON-LD for ${path}`);
      if (path === "/products/test-export-coffee") {
        assert.match(html, /<h1[^>]*>Test Export Coffee<\/h1>/);
        const structured = schemas(html).find((item) => item["@type"] === "Product");
        assert.equal(structured.name, product.name);
        assert.equal(structured.description, product.overview);
        assert.ok(!("offers" in structured));
        assert.ok(!html.includes(product.overview), "raw script terminator must be escaped");
      }
    }
    for (const path of [
      "/products/missing",
      "/products/yirgacheffe-coffee",
      "/products/unfinished",
      "/missing-page",
    ]) {
      const response = await get(path);
      assert.equal(response.status, 404, path);
      assert.match(response.headers.get("x-robots-tag") ?? "", /noindex/);
    }
    const admin = await get("/admin");
    assert.match(admin.headers.get("x-robots-tag") ?? "", /noindex/);
    const sitemap = await get("/sitemap.xml");
    assert.match(sitemap.headers.get("content-type"), /application\/xml/);
    const xml = await sitemap.text();
    assert.ok(xml.includes(`${origin}/products/test-export-coffee`));
    assert.ok(!/yirgacheffe-coffee|unfinished|\/admin/.test(xml));
    const robots = await (await get("/robots.txt")).text();
    assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`));
    assert.equal(await (await get("/sitemap.xml", { method: "HEAD" })).text(), "");
    unavailable = true;
    assert.equal((await get("/sitemap.xml")).status, 503);
    assert.equal((await get("/products/test-export-coffee")).status, 500);
  } catch (error) {
    console.error(logs.slice(-5000));
    throw error;
  } finally {
    child.kill("SIGTERM");
    database.closeAllConnections();
    await new Promise((resolve) => database.close(resolve));
  }
});
