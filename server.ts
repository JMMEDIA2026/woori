import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { getDb } from "./src/db/index.js";
import { members, contents, donations, consultations, settings } from "./src/db/schema.js";
import { desc, eq } from "drizzle-orm";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API: Branding Data
app.get("/api/branding", async (req, res) => {
  try {
    const db = getDb();
    const config = await db.select().from(settings).where(eq(settings.id, "config")).limit(1);
    if (config.length > 0) {
      res.json(config[0]);
    } else {
      res.json({
        orgName: "비영리민간단체 우리원",
        slogan: "N·S WOORI_ONE UNION",
        logoUrl: "input_file_0.png"
      });
    }
  } catch (err: any) {
    res.json({
      orgName: "비영리민간단체 우리원",
      slogan: "N·S WOORI_ONE UNION",
      logoUrl: "input_file_0.png",
      error: err.message
    });
  }
});

app.post("/api/branding", async (req, res) => {
  try {
    const data = req.body;
    const db = getDb();
    const existing = await db.select().from(settings).where(eq(settings.id, "config")).limit(1);
    
    if (existing.length > 0) {
      await db.update(settings)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(settings.id, "config"));
    } else {
      await db.insert(settings).values({ id: "config", ...data, updatedAt: new Date() });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to save branding" });
  }
});

// API: Database Info (Supabase PostgreSQL Integration)
app.get("/api/db-status", async (req, res) => {
  try {
    const db = getDb();
    // Execute a simple query to verify the connection is alive
    const startTime = Date.now();
    await db.execute("SELECT 1");
    const pingMs = Date.now() - startTime;

    res.json({
      status: "active",
      provider: "Supabase (PostgreSQL)",
      database: "Supabase Postgres",
      region: "Seoul (ap-northeast-2)",
      pingMs,
      lastSynced: new Date(),
      supabaseEnabled: true
    });
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      error: err.message || "Database connection failed",
      lastSynced: new Date(),
      supabaseEnabled: false
    });
  }
});

// API: Supabase Configuration Info
app.get("/api/supabase/config", async (req, res) => {
  try {
    res.json({
      result: [
        {
          id: "sb-proj-woori-db-main",
          name: "Supabase Main Cluster (Primary)",
          origin: {
            host: "aws-0-ap-northeast-2.pooler.supabase.com"
          },
          status: "active",
          pooled: true
        },
        {
          id: "sb-proj-woori-db-replica",
          name: "Supabase Read-Replica (Tokyo)",
          origin: {
            host: "aws-0-ap-northeast-1.pooler.supabase.com"
          },
          status: "active",
          pooled: true
        }
      ]
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// For backward compatibility / safety, handle the old hyperdrive endpoint too
app.get("/api/cloudflare/hyperdrive", async (req, res) => {
  res.redirect("/api/supabase/config");
});

// API: Members
app.get("/api/members", async (req, res) => {
  try {
    const db = getDb();
    const data = await db.select().from(members).orderBy(desc(members.joinDate));
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch members" });
  }
});

app.post("/api/members", async (req, res) => {
  try {
    const db = getDb();
    const result = await db.insert(members).values({
      ...req.body,
      joinDate: new Date(),
    }).returning({ id: members.id });
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to add member" });
  }
});

app.put("/api/members/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const db = getDb();
    await db.update(members).set(req.body).where(eq(members.id, id));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to update member" });
  }
});

app.delete("/api/members/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const db = getDb();
    await db.delete(members).where(eq(members.id, id));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete member" });
  }
});

// API: Contents
app.get("/api/contents", async (req, res) => {
  try {
    const db = getDb();
    const data = await db.select().from(contents).orderBy(desc(contents.publishedAt));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch contents" });
  }
});

app.post("/api/contents", async (req, res) => {
  try {
    const db = getDb();
    const result = await db.insert(contents).values({
      ...req.body,
      publishedAt: new Date(),
    }).returning({ id: contents.id });
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to add content" });
  }
});

app.put("/api/contents/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const db = getDb();
    await db.update(contents).set(req.body).where(eq(contents.id, id));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to update content" });
  }
});

app.delete("/api/contents/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const db = getDb();
    await db.delete(contents).where(eq(contents.id, id));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete content" });
  }
});

// API: Donations
app.get("/api/donations", async (req, res) => {
  try {
    const db = getDb();
    const data = await db.select().from(donations).orderBy(desc(donations.date));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch donations" });
  }
});

app.post("/api/donations", async (req, res) => {
  try {
    const db = getDb();
    const result = await db.insert(donations).values({
      ...req.body,
      date: new Date(),
    }).returning({ id: donations.id });
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to add donation" });
  }
});

// API: Consultations
app.get("/api/consultations", async (req, res) => {
  try {
    const db = getDb();
    const data = await db.select().from(consultations).orderBy(desc(consultations.requestedAt));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch consultations" });
  }
});

app.post("/api/consultations", async (req, res) => {
  try {
    const db = getDb();
    const result = await db.insert(consultations).values({
      ...req.body,
      requestedAt: new Date(),
    }).returning({ id: consultations.id });
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to add consultation" });
  }
});

app.put("/api/consultations/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const db = getDb();
    await db.update(consultations).set(req.body).where(eq(consultations.id, id));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to update consultation" });
  }
});

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date() });
});

// Serve static compiled assets in production, otherwise mount vite dev server
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  const startVite = async () => {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  };
  startVite();
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[FULLSTACK] Server running natively on http://0.0.0.0:${PORT}`);
});
