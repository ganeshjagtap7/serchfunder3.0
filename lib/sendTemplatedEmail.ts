import { supabase } from "@/lib/supabaseClient";
import { sendEmail } from "@/lib/email";

interface EmailTemplate {
  key: string;
  subject: string;
  body: string;
}

export async function sendTemplatedEmail({
  templateKey,
  to,
  variables,
}: {
  templateKey: string;
  to: string;
  variables: Record<string, string>;
}) {
  const { data: template, error } = await supabase
    .from("email_templates")
    .select("*")
    .eq("key", templateKey)
    .single<EmailTemplate>();

  if (error || !template) {
    throw new Error("Email template not found");
  }

  let body = template.body;

  Object.entries(variables).forEach(([key, value]) => {
    body = body.replaceAll(`{{${key}}}`, value);
  });

  await sendEmail({
    to,
    subject: template.subject,
    html: body.replace(/\n/g, "<br/>"),
  });
}
