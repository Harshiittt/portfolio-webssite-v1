import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }

  try {
    const result = await resend.emails.send({
      from: "Harshit Anand <contact@harshitanand.in>",
      to: process.env.CONTACT_EMAIL!,
      replyTo: email,
      subject: `New message from ${name}`,
      html: `
        <div style="font-family:monospace;padding:24px;background:#0d0f14;color:#e2e8f0;border-radius:8px;">
          <h2 style="color:#64ffda;margin-bottom:16px;">New Portfolio Message</h2>
          <p><strong style="color:#ccd6f6;">Name:</strong> ${name}</p>
          <p><strong style="color:#ccd6f6;">Email:</strong> ${email}</p>
          <p><strong style="color:#ccd6f6;">Message:</strong></p>
          <p style="background:#112240;padding:16px;border-radius:6px;border-left:3px solid #64ffda;">${message}</p>
        </div>
      `,
    });

    if (result.error) {
      console.error("[contact] Resend error:", result.error);
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: result.data?.id });
  } catch (e) {
    console.error("[contact] Unexpected error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to send" },
      { status: 500 }
    );
  }
}
