"use server";

import { getSupabaseServer } from "@/lib/supabase-server";

export async function subscribeAction(
  prevState: unknown,
  formData: FormData
) {
  const contactInfo = formData.get("contactInfo")?.toString();
  const sourcePage = formData.get("sourcePage")?.toString() || "unknown";

  if (!contactInfo) {
    return { error: "Please provide an email or WhatsApp number." };
  }

  // Basic validation to check if it's at least vaguely an email or phone number
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo);
  const isPhone = /^[\d\s\-\+\(\)]+$/.test(contactInfo);

  if (!isEmail && !isPhone) {
    return { error: "Please enter a valid email or WhatsApp number." };
  }

  try {
    const supabase = await getSupabaseServer();

    // Insert into Supabase
    const { error } = await supabase.from("leads").insert({
      contact_info: contactInfo.trim(),
      source_page: sourcePage,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return { error: "Something went wrong. Please try again later." };
    }

    // Send email notification via Resend
    if (process.env.RESEND_API_KEY) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: process.env.RESEND_MAILERS_FROM_EMAIL || "Alex (HabitCal) <alex@habitcal.app>",
            to: ["alex@aimhuge.com"],
            subject: `New Lead: ${contactInfo.trim()}`,
            html: `
              <p>A new lead has subscribed to the AimHuge mailing list.</p>
              <p><strong>Contact Info:</strong> ${contactInfo.trim()}</p>
              <p><strong>Source Page:</strong> ${sourcePage}</p>
            `,
          }),
        });
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
        // Don't fail the action if email fails, since the lead was saved
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Subscription action error:", error);
    return { error: "Internal server error. Please try again." };
  }
}
