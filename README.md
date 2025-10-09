# Research Platform MVP

A production-ready research platform built with Next.js, Supabase, and TypeScript.

## Features

- **Public Pages**: Landing page, research lines, and releases with ISR (Incremental Static Regeneration)
- **Authentication**: Email/password authentication with Supabase
- **Two-Tier Access**: Free users see teasers, members see full content
- **Role-Based Access**: Regular users and admins with different permissions
- **Admin Panel**: Manage users, research lines, releases, and view metrics
- **Audit Logging**: Track all administrative actions
- **Event Tracking**: Analytics for user behavior and engagement
- **ISR Revalidation**: On-demand cache revalidation for content updates

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account and project

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables (already configured in Vercel)

4. Run database migrations:
   - Execute SQL scripts in the `scripts/` folder in order
   - Scripts are numbered: 001, 002, 003, 004

5. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## Database Schema

### Tables

- **users**: User profiles with role and membership tier
- **research_lines**: Research lines/topics
- **releases**: Publications within research lines
- **release_sections**: Three sections per release (Actualidad, Implementación, Académico)
- **audit_logs**: Administrative action history
- **events**: User activity tracking

### Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:
- Public read access for published content
- Admin-only write access
- User-specific access for personal data

## Key Features

### ISR (Incremental Static Regeneration)

Public pages use ISR with 1-hour revalidation:
- Homepage: `/`
- Research lines: `/research-lines`
- Individual research line: `/research-lines/[slug]`
- Release pages: `/research-lines/[slug]/[releaseSlug]`

Admins can manually revalidate cache via the admin panel.

### Event Tracking

Tracked events:
- `page_view`: General page views
- `release_view`: Release page views
- `research_line_view`: Research line views
- `signup`: New user registrations
- `login`: User logins
- `profile_update`: Profile changes
- `upgrade_prompt_shown`: Upgrade CTA displayed
- `upgrade_clicked`: Upgrade CTA clicked

### Admin Panel

Located at `/admin`, accessible only to users with `role = 'admin'`:
- User management (change roles and membership tiers)
- Research line management (create, edit, activate/deactivate)
- Release management (create, edit, publish)
- Audit log viewer
- Metrics dashboard

## API Routes

### `/api/revalidate` (POST)

Manually revalidate ISR cache. Requires admin authentication.

**Body:**
\`\`\`json
{
  "type": "research-line" | "release" | "all",
  "slug": "research-line-slug",
  "researchLineSlug": "research-line-slug",
  "releaseSlug": "release-slug"
}
\`\`\`

## Deployment

The application is configured for Vercel deployment with:
- Automatic deployments from Git
- Environment variables configured
- Supabase integration connected

## Security

- Row Level Security (RLS) on all tables
- Admin-only routes protected by middleware
- Audit logging for all administrative actions
- Secure authentication with Supabase

## License

MIT
