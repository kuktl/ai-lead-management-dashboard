# Website → FlowPilot Lead Capture

Your public website can send its contact form directly into the FlowPilot `leads` table through the Supabase Edge Function below.

## Endpoint

```text
POST https://qvkjzukzfhbpzevqpwqz.supabase.co/functions/v1/website-lead-capture
```

No Supabase login is required for the website visitor. The function validates the form and writes the lead server-side using the Supabase service role key, which never reaches the browser.

## Request body

```json
{
  "name": "Alex Morgan",
  "phone": "+91 98765 43210",
  "email": "alex@company.com",
  "service": "Website Design & Development",
  "details": "We need a new website and automation setup.",
  "company": "Example Pvt Ltd",
  "website": ""
}
```

`website` is a honeypot field. Keep it empty and hidden in the real form.

## Frontend example

```ts
const response = await fetch(
  'https://qvkjzukzfhbpzevqpwqz.supabase.co/functions/v1/website-lead-capture',
  {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'apikey': 'sb_publishable_ck1id-iY6uVhcOK5HXP1UA_DIa6Hy9Y',
      'Authorization': 'Bearer sb_publishable_ck1id-iY6uVhcOK5HXP1UA_DIa6Hy9Y'
    },
    body: JSON.stringify({
      name: fullName,
      phone: whatsappPhone,
      email: workEmail,
      service: desiredService,
      details: projectDetails,
      company: companyName,
      website: '',
    }),
  },
);

const result = await response.json();
if (!response.ok) throw new Error(result.error || 'Unable to submit lead');
```

## Edge Function Deployment (Optional)

The function source code is located in `/supabase/functions/website-lead-capture/index.ts`. To deploy:

```bash
supabase functions deploy website-lead-capture --no-verify-jwt
```

## Result

A successful request returns:

```json
{
  "success": true,
  "lead": {
    "id": "...",
    "name": "Alex Morgan",
    "email": "alex@company.com",
    "phone": "+91 98765 43210",
    "status": "new",
    "score": 0,
    "estimated_value": 0
  }
}
```

The lead is inserted into the same `public.leads` table used by the FlowPilot dashboard. After the user is logged into FlowPilot, the **Leads** page reads that table and the new record appears there.

## Important

Do **not** put the ElevenLabs API key, Supabase service-role key, or any other server secret in the website frontend. The lead-capture endpoint handles database access server-side.
