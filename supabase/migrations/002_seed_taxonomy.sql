-- Optional starter categories and brands (safe to re-run with ON CONFLICT)

insert into public.categories (name, slug, image) values
  ('Building Materials', 'building-materials', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80'),
  ('Power Tools', 'power-tools', 'https://images.unsplash.com/photo-1572981779307-38bfe4d3a3f8?auto=format&fit=crop&w=600&q=80'),
  ('Hand Tools', 'hand-tools', 'https://images.unsplash.com/photo-1581244277943-fe4c9d3d9f44?auto=format&fit=crop&w=600&q=80'),
  ('Plumbing Supplies', 'plumbing-supplies', 'https://images.unsplash.com/photo-1585705326261-ca242afb3e5e?auto=format&fit=crop&w=600&q=80'),
  ('Electrical', 'electrical', 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80'),
  ('Safety Equipment', 'safety-equipment', 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80')
on conflict (slug) do nothing;

insert into public.brands (name, slug) values
  ('Bosch', 'bosch'),
  ('DeWalt', 'dewalt'),
  ('Makita', 'makita'),
  ('Stanley', 'stanley'),
  ('Hilti', 'hilti'),
  ('Ingco', 'ingco')
on conflict (slug) do nothing;
