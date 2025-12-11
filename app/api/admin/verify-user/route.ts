import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Admin API to verify a user by email
 * This requires the service role key to bypass RLS
 * 
 * Usage: POST /api/admin/verify-user
 * Body: { "email": "user@example.com" }
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Use service role key for admin operations
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
      return NextResponse.json(
        { error: "Service role key not configured" },
        { status: 500 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      return NextResponse.json(
        { error: "Supabase URL not configured" },
        { status: 500 }
      );
    }

    // Create admin client with service role key
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Find user by email
    const { data: users, error: userError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (userError) {
      return NextResponse.json(
        { error: userError.message },
        { status: 500 }
      );
    }

    const user = users.users.find((u) => u.email === email);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Update profile to set is_verified = true
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .update({ is_verified: true })
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      // If profile doesn't exist, create it
      if (error.code === "PGRST116") {
        const { data: newProfile, error: insertError } = await supabaseAdmin
          .from("profiles")
          .insert({
            id: user.id,
            full_name: user.email,
            is_verified: true,
          })
          .select()
          .single();

        if (insertError) {
          return NextResponse.json(
            { error: insertError.message },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          message: "User verified successfully",
          profile: newProfile,
        });
      }

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User verified successfully",
      profile: data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
