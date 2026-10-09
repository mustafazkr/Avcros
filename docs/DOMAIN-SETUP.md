# Domain Setup — Deferred Task

**Status:** Blocked — waiting to purchase a domain.

**Why this exists:** `*.supabase.co` is blocked by Afghan ISPs. Without
the fix below, every user in Afghanistan needs a VPN to sign up, sign in,
or use any feature that hits the backend.

**When to do this:** As soon as a domain is purchased. Expected cost: ~$10/year.

**Time required:** ~30 minutes.

---

## What this solves

Currently:
- `supabase-config.js` points to `https://asclssstwqbzfyjcqiine.supabase.co`
- Afghan ISPs cannot resolve `supabase.co` → DNS failure → `ERR_NAME_NOT_RESOLVED`
- Users must use VPN to reach the backend

After this task:
- `supabase-config.js` points to `https://api.<domain>.com`
- Cloudflare proxies requests from that domain to Supabase
- Cloudflare is generally reachable from Afghanistan without VPN
- No VPN needed by users, no code changes needed beyond one line

---

## Prerequisites

- A domain purchased (e.g. `avcros.com`)
- The domain added to Cloudflare (free tier)
- Supabase project accessible (VPN on for setup)

---

## Step-by-step

### 1. Buy a domain

Recommended registrars:
- **Cloudflare Registrar** — cheapest, no markup, easy Cloudflare integration
- **Namecheap** — popular, straightforward
- **Porkbun** — good support, clean UI

Recommended: `avcros.com` (~$10/year). If taken, try `.io`, `.dev`, `.app`, or a modifier.

### 2. Add domain to Cloudflare

1. Sign up at cloudflare.com (free)
2. Add the domain → Cloudflare shows two nameservers
3. At your registrar, replace the default nameservers with Cloudflare's
4. Wait 5 min – 24 hours for propagation (usually ~1 hour)

### 3. Configure Supabase custom domain

1. Supabase dashboard → project `avcros` → **Settings** → **Custom Domains**
2. Enter `api.<domain>.com` (e.g. `api.avcros.com`)
3. Supabase returns a CNAME target (something like `xxxxxxxx.supabase.co` or a specific hostname)
4. Copy the CNAME target

### 4. Add the CNAME in Cloudflare

1. Cloudflare dashboard → your domain → **DNS** → **Records** → **Add record**
2. Type: **CNAME**
3. Name: `api`
4. Target: paste the value Supabase gave you
5. Proxy status: **Proxied (orange cloud)** ← important for the block bypass
6. Save

### 5. Wait for SSL

Cloudflare automatically provisions SSL for the subdomain. Takes 1–5 minutes.
Supabase will confirm the domain is active in its Custom Domains panel.

### 6. Update the config file

Open `en/_shared/supabase-config.js` and change the `url:` value:

**From:**
```javascript
url: "https://asclssstwqbzfyjcqiine.supabase.co",

to:

url: "https://api.avcros.com",

> **Note:** `<domain>` is a placeholder. Replace every occurrence with your
> actual purchased domain (e.g. `avcros.com`) when you complete this task.
