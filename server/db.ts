import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Only set websocket constructor in development
if (process.env.NODE_ENV !== 'production') {
  neonConfig.webSocketConstructor = ws;
}

let pool: Pool | null = null;
let dbClient: any = null;

// Validate DATABASE_URL format before attempting connection
function isValidDatabaseUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    const validProtocols = ['postgres:', 'postgresql:'];
    if (!validProtocols.includes(url.protocol)) {
      console.error(`Invalid DATABASE_URL protocol: ${url.protocol}. Must be postgres:// or postgresql://`);
      return false;
    }
    if (!url.hostname) {
      console.error("Invalid DATABASE_URL: missing hostname");
      return false;
    }
    if (!url.pathname || url.pathname === '/') {
      console.error("Invalid DATABASE_URL: missing database name");
      return false;
    }
    return true;
  } catch (error) {
    console.error("Invalid DATABASE_URL format - cannot parse as URL:", error);
    return false;
  }
}

if (process.env.DATABASE_URL) {
  // Trim any whitespace or quotes that might have been accidentally added
  const dbUrl = process.env.DATABASE_URL.trim().replace(/^["']|["']$/g, '');
  
  console.log("DATABASE_URL found, validating format...");
  
  if (isValidDatabaseUrl(dbUrl)) {
    try {
      console.log("DATABASE_URL is valid, connecting to database...");
      pool = new Pool({ 
        connectionString: dbUrl,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
        max: 1,
      });

      pool.on('error', (err) => {
        console.error('Database pool error:', err);
      });

      dbClient = drizzle({ client: pool, schema });
      console.log("Database connection established successfully");
    } catch (error) {
      console.error("Failed to connect to database:", error);
      pool = null;
      dbClient = null;
    }
  } else {
    console.error("DATABASE_URL is invalid! Check the format in Render environment variables.");
    console.error("Expected format: postgresql://username:password@host.neon.tech/dbname?sslmode=require");
    console.error("App will use in-memory storage instead.");
  }
} else {
  console.warn("DATABASE_URL not set. App will use in-memory storage.");
}

export const db = dbClient;
export { pool };
