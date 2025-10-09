-- Function to get event counts by type
create or replace function get_event_counts()
returns table (event_type text, count bigint)
language sql
security definer
as $$
  select event_type, count(*) as count
  from public.events
  group by event_type
  order by count desc;
$$;

-- Function to get user activity summary
create or replace function get_user_activity_summary(user_uuid uuid)
returns table (
  total_events bigint,
  last_activity timestamptz,
  most_common_event text
)
language sql
security definer
as $$
  select
    count(*) as total_events,
    max(created_at) as last_activity,
    (
      select event_type
      from public.events
      where user_id = user_uuid
      group by event_type
      order by count(*) desc
      limit 1
    ) as most_common_event
  from public.events
  where user_id = user_uuid;
$$;

-- Function to get daily active users
create or replace function get_daily_active_users(days_back integer default 30)
returns table (date date, active_users bigint)
language sql
security definer
as $$
  select
    date(created_at) as date,
    count(distinct user_id) as active_users
  from public.events
  where created_at >= now() - (days_back || ' days')::interval
    and user_id is not null
  group by date(created_at)
  order by date desc;
$$;

-- Function to get popular releases
create or replace function get_popular_releases(limit_count integer default 10)
returns table (
  release_id uuid,
  release_slug text,
  view_count bigint
)
language sql
security definer
as $$
  select
    (event_data->>'release_id')::uuid as release_id,
    event_data->>'release_slug' as release_slug,
    count(*) as view_count
  from public.events
  where event_type = 'release_view'
    and event_data->>'release_id' is not null
  group by release_id, release_slug
  order by view_count desc
  limit limit_count;
$$;
