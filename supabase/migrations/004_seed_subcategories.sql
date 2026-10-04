insert into public.subcategories (category_id, name, slug)
select c.id, v.name, v.slug
from public.categories c
join (
  values
    ('building-materials', 'Cement', 'cement'),
    ('building-materials', 'Steel Bars', 'steel-bars'),
    ('building-materials', 'Timber', 'timber'),
    ('building-materials', 'Roofing', 'roofing'),
    ('power-tools', 'Drills', 'drills'),
    ('power-tools', 'Grinders', 'grinders'),
    ('power-tools', 'Saws', 'saws'),
    ('power-tools', 'Generators', 'generators'),
    ('hand-tools', 'Hammers', 'hammers'),
    ('hand-tools', 'Wrenches', 'wrenches'),
    ('hand-tools', 'Measuring Tools', 'measuring-tools'),
    ('plumbing-supplies', 'Pipes', 'pipes'),
    ('plumbing-supplies', 'Fittings', 'fittings'),
    ('plumbing-supplies', 'Water Pumps', 'water-pumps'),
    ('electrical', 'Cables', 'cables'),
    ('electrical', 'Switches', 'switches'),
    ('electrical', 'Lighting', 'lighting'),
    ('safety-equipment', 'Helmets', 'helmets'),
    ('safety-equipment', 'Gloves', 'gloves'),
    ('safety-equipment', 'Safety Boots', 'safety-boots')
) as v(category_slug, name, slug) on c.slug = v.category_slug
on conflict (category_id, slug) do nothing;
