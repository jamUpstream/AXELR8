-- Editable homepage copy. Run after schema.sql.
-- Re-runnable: upserts by key.
insert into site_content (key, value) values
  ('hero_headline_line1',  'AUTOMATE YOUR BUSINESS.'),
  ('hero_headline_line2',  'ACCELERATE YOUR SUCCESS.'),
  ('hero_subheadline',     'Precision-engineered workflows designed for high-stakes scalability. We remove the friction from your operations so you can focus on the mission.'),
  ('value_prop_eyebrow',   'Our Core Mission'),
  ('value_prop_statement', 'We build high-performance automations. Rigorously engineered to run faster, cleaner, and exactly how your business needs it.'),
  ('services_eyebrow',     'Automation—Handled End-to-End.'),
  ('services_subheadline', 'Our modular service suite provides everything your operation needs to achieve orbital velocity.'),
  ('closing_cta_quote',    'Why didn''t we do this earlier?'),
  ('closing_cta_attribution', '~ You, next week.'),
  ('closing_cta_button',   'Let''s Build Your System →')
on conflict (key) do update set value = excluded.value, updated_at = now();
