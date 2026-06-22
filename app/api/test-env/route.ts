import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    node_env: process.env.NODE_ENV,
    has_anthropic: !!process.env.ANTHROPIC_API_KEY,
    has_supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    has_service_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    anthropic_prefix: process.env.ANTHROPIC_API_KEY?.slice(0, 10),
    supabase_url_prefix: process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(0, 30),
  });
}
