import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: ['itsprateekmohanty@gmail.com'],
      replyTo: email,
      subject: `Portfolio Contact: Message from ${name}`,
      html: `
        <div style="font-family: 'Courier New', monospace; background-color: #0a0a0a; color: #e5e5e5; padding: 30px; border-radius: 8px;">
          <div style="border-bottom: 1px solid #333; padding-bottom: 20px; margin-bottom: 20px;">
            <h1 style="color: #39ff14; margin: 0; font-size: 24px;">$ new_message --received</h1>
          </div>

          <div style="margin-bottom: 20px;">
            <p style="color: #00ffff; margin: 0 0 5px 0;">FROM:</p>
            <p style="margin: 0; padding-left: 20px;">${name} &lt;${email}&gt;</p>
          </div>

          <div style="margin-bottom: 20px;">
            <p style="color: #00ffff; margin: 0 0 5px 0;">MESSAGE:</p>
            <div style="background-color: #1a1a1a; padding: 15px; border-left: 3px solid #39ff14; margin-left: 20px;">
              <p style="margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
          </div>

          <div style="border-top: 1px solid #333; padding-top: 20px; margin-top: 20px;">
            <p style="color: #666; font-size: 12px; margin: 0;">
              Sent from your portfolio contact form
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, messageId: data?.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
