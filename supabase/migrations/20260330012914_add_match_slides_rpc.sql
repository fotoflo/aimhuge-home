create or replace function match_slides (
  query_embedding vector(768),
  match_threshold float,
  match_count int,
  p_deck_slug text,
  p_exclude_slide_id uuid
)
returns table (
  id uuid,
  deck_slug text,
  slide_order int,
  frontmatter jsonb,
  mdx_content text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    deck_slides.id,
    deck_slides.deck_slug,
    deck_slides.slide_order,
    deck_slides.frontmatter,
    deck_slides.mdx_content,
    1 - (deck_slides.embedding <=> query_embedding) as similarity
  from deck_slides
  where deck_slides.embedding is not null
    and deck_slides.deck_slug = p_deck_slug
    and (p_exclude_slide_id is null or deck_slides.id != p_exclude_slide_id)
    and deck_slides.deleted_at is null
    and 1 - (deck_slides.embedding <=> query_embedding) > match_threshold
  order by deck_slides.embedding <=> query_embedding
  limit match_count;
end;
$$;
