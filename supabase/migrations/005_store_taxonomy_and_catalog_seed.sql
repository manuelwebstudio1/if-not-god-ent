-- Align live catalog with the store: 3 categories, aliases, brands, products

alter table public.categories
  add column if not exists sort_order integer not null default 0;

insert into public.categories (name, slug, image, sort_order) values
  (
    'Building Materials',
    'building-materials',
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
    1
  ),
  (
    'Water Pump',
    'water-pump',
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
    2
  ),
  (
    'Machines',
    'machines',
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=600&q=80',
    3
  )
on conflict (slug) do update
  set name = excluded.name,
      image = excluded.image,
      sort_order = excluded.sort_order;

update public.subcategories s
set category_id = (select id from public.categories where slug = 'machines')
where s.category_id in (
  select id from public.categories where slug in ('power-tools', 'hand-tools')
);

update public.subcategories s
set category_id = (select id from public.categories where slug = 'building-materials')
where s.slug <> 'water-pumps'
  and s.category_id in (
    select id from public.categories
    where slug in ('electrical', 'plumbing-supplies', 'safety-equipment')
  );

update public.subcategories s
set category_id = (select id from public.categories where slug = 'water-pump')
where s.slug = 'water-pumps';

delete from public.categories
where slug not in ('building-materials', 'water-pump', 'machines');

insert into public.subcategories (category_id, name, slug)
select c.id, v.name, v.slug
from public.categories c
join (
  values
    ('water-pump', 'Centrifugal', 'centrifugal'),
    ('water-pump', 'Submersible', 'submersible'),
    ('water-pump', 'Booster', 'booster'),
    ('machines', 'Mixers', 'mixers')
) as v(category_slug, name, slug) on c.slug = v.category_slug
on conflict (category_id, slug) do nothing;

insert into public.brands (name, slug) values
  ('BOSCH', 'bosch'),
  ('DEWALT', 'dewalt'),
  ('HILTI', 'hilti'),
  ('INGCO', 'ingco'),
  ('MAKITA', 'makita'),
  ('STANLEY', 'stanley'),
  ('TOTAL', 'total'),
  ('KOSHIN', 'koshin'),
  ('TOLSEN', 'tolsen'),
  ('MILWAUKEE', 'milwaukee'),
  ('CATERPILLAR', 'caterpillar')
on conflict (slug) do update set name = excluded.name;

create table if not exists public.category_aliases (
  slug text primary key,
  category_id uuid not null references public.categories(id) on delete cascade
);

alter table public.category_aliases enable row level security;

drop policy if exists "Public read category aliases" on public.category_aliases;
create policy "Public read category aliases"
  on public.category_aliases for select using (true);

insert into public.category_aliases (slug, category_id)
select v.slug, c.id
from public.categories c
join (
  values
    ('building-materials', 'building-materials'),
    ('water-pump', 'water-pump'),
    ('water-pumps', 'water-pump'),
    ('machines', 'machines'),
    ('power-tools', 'machines'),
    ('hand-tools', 'machines'),
    ('generators', 'machines'),
    ('industrial-equipment', 'machines'),
    ('engineering-equipment', 'machines'),
    ('construction-machines', 'machines'),
    ('plumbing-supplies', 'building-materials'),
    ('safety-equipment', 'building-materials'),
    ('electrical', 'building-materials'),
    ('electrical-supplies', 'building-materials'),
    ('hardware', 'building-materials'),
    ('construction-accessories', 'building-materials')
) as v(slug, category_slug) on c.slug = v.category_slug
on conflict (slug) do update set category_id = excluded.category_id;

insert into public.products (
  name, slug, sku, category_id, subcategory_id, brand_id,
  price, compare_at_price, stock, images, short_description, description,
  features, specifications, warranty, shipping_info,
  is_featured, is_available, is_new, is_best_seller, rating, review_count
)
select
  v.name, v.slug, v.sku, c.id, s.id, b.id,
  v.price, v.compare_at_price, v.stock, v.images, v.short_description, v.description,
  v.features, v.specifications, v.warranty, v.shipping_info,
  v.is_featured, true, v.is_new, v.is_best_seller, v.rating, v.review_count
from (
  values
    (
      'Impact Drill 850W',
      'ingco-impact-drill-850w',
      'ID8508',
      'machines',
      'drills',
      'ingco',
      420.00,
      495.00,
      24,
      array[
        'https://images.unsplash.com/photo-1572981779307-38bfe4d3a3f8?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1504148455328-c376ef8136c3?auto=format&fit=crop&w=800&q=80'
      ]::text[],
      'Professional 850W impact drill with variable speed for masonry, steel and wood.',
      'The INGCO Impact Drill 850W delivers reliable torque for professional construction sites. Built with a robust motor, ergonomic grip and precision chuck for daily heavy-duty use.',
      array['850W high-torque motor', 'Variable speed control', 'Impact & drill modes', 'Auxiliary handle included', 'Professional-grade chuck']::text[],
      '{"Power":"850W","No-load speed":"0–3000 RPM","Chuck":"13mm keyless","Weight":"2.1 kg","Voltage":"220–240V"}'::jsonb,
      '12 months manufacturer warranty',
      'Nationwide delivery within 2–5 business days',
      true,
      false,
      true,
      4.70,
      128
    ),
    (
      'Water Pump 2"',
      'koshin-water-pump-2in',
      'KP200X',
      'water-pump',
      'water-pumps',
      'koshin',
      1850.00,
      null,
      12,
      array['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80']::text[],
      'High-flow 2-inch centrifugal water pump for construction and irrigation.',
      'KOSHIN 2-inch water pump engineered for reliable dewatering and transfer applications on job sites across Ghana.',
      array['2-inch inlet/outlet', 'Durable cast iron body', 'High flow rate', 'Easy maintenance design']::text[],
      '{"Inlet":"2\"","Max flow":"600 L/min","Engine":"Petrol 5.5HP compatible","Weight":"18 kg"}'::jsonb,
      '12 months warranty',
      'Bulky item — delivery quote on checkout',
      true,
      false,
      false,
      4.80,
      64
    ),
    (
      'Angle Grinder 4.5"',
      'total-angle-grinder-4-5',
      'TAG115',
      'machines',
      'grinders',
      'total',
      285.00,
      340.00,
      35,
      array['https://images.unsplash.com/photo-1504148455328-c376ef8136c3?auto=format&fit=crop&w=800&q=80']::text[],
      'Compact 710W angle grinder for cutting and grinding metal.',
      'TOTAL 4.5-inch angle grinder with side handle and safety guard for professional metalwork and fabrication.',
      array['710W motor', 'Spindle lock', 'Adjustable guard', 'Soft grip']::text[],
      '{"Power":"710W","Disc":"115mm (4.5\")","Speed":"11000 RPM"}'::jsonb,
      '6 months warranty',
      'Standard nationwide delivery',
      true,
      false,
      false,
      4.50,
      89
    ),
    (
      'Combination Spanner Set',
      'tolsen-combination-spanner-set',
      'TS8140',
      'machines',
      'wrenches',
      'tolsen',
      165.00,
      null,
      50,
      array['https://images.unsplash.com/photo-1581244277943-fe4c9d3d9f44?auto=format&fit=crop&w=800&q=80']::text[],
      '14-piece chrome vanadium combination spanner set.',
      'TOLSEN professional spanner set for mechanical, plumbing and engineering applications.',
      array['Chrome vanadium steel', '14 sizes', 'Organizer roll']::text[],
      '{"Pieces":"14","Material":"Cr-V steel","Finish":"Polished"}'::jsonb,
      'Limited lifetime on manufacturing defects',
      'Ships within 24 hours',
      true,
      true,
      false,
      4.60,
      42
    ),
    (
      'Measuring Tape 8m',
      'stanley-measuring-tape-8m',
      'STHT36031',
      'building-materials',
      null,
      'stanley',
      45.00,
      null,
      120,
      array['https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80']::text[],
      'STANLEY FatMax 8m tape with standout blade.',
      'Industry-standard measuring tape trusted on construction sites worldwide.',
      array['8m length', 'Blade lock', 'Belt clip', 'Impact-resistant case']::text[],
      '{"Length":"8m","Width":"25mm","Standout":"2.5m"}'::jsonb,
      'Manufacturer warranty',
      'Standard delivery',
      true,
      false,
      true,
      4.90,
      210
    ),
    (
      'Gasoline Generator 3.0kW',
      'ingco-gasoline-generator-3kw',
      'IG3000',
      'machines',
      'generators',
      'ingco',
      3200.00,
      3599.00,
      8,
      array['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80']::text[],
      '3.0kW portable generator for sites and backup power.',
      'INGCO gasoline generator with stable output for tools, lighting and essential equipment on remote job sites.',
      array['3.0kW rated output', 'Low oil shutdown', 'Easy start', 'Fuel gauge']::text[],
      '{"Output":"3.0 kW","Tank":"15L","Runtime":"Up to 8 hours"}'::jsonb,
      '12 months warranty',
      'Delivery & setup support available',
      true,
      false,
      false,
      4.40,
      37
    ),
    (
      'Professional Safety Helmet',
      'ing-safety-helmet-pro',
      'SH100',
      'building-materials',
      'helmets',
      'ingco',
      55.00,
      null,
      200,
      array['https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80']::text[],
      'ANSI-rated safety helmet with adjustable suspension.',
      'Essential head protection for construction and industrial environments.',
      array['Adjustable fit', 'Ventilation slots', 'Chin strap']::text[],
      '{"Standard":"EN397","Color":"Yellow"}'::jsonb,
      '6 months',
      'Standard delivery',
      false,
      false,
      false,
      4.30,
      76
    ),
    (
      'Cordless Drill Driver 20V',
      'dewalt-cordless-drill-20v',
      'DCD777',
      'machines',
      'drills',
      'dewalt',
      890.00,
      null,
      18,
      array['https://images.unsplash.com/photo-1572981779307-38bfe4d3a3f8?auto=format&fit=crop&w=800&q=80']::text[],
      '20V MAX compact drill/driver with LED work light.',
      'DEWALT cordless drill for professional carpentry and installation work.',
      array['20V MAX platform', '2-speed transmission', 'LED light']::text[],
      '{"Voltage":"20V MAX","Chuck":"13mm","Torque":"65 Nm"}'::jsonb,
      '3 year limited warranty',
      'Express delivery available in Accra',
      false,
      true,
      false,
      4.80,
      95
    ),
    (
      'PVC Pipe Cutter',
      'tolsen-pvc-pipe-cutter',
      'TS5123',
      'building-materials',
      'pipes',
      'tolsen',
      78.00,
      null,
      45,
      array['https://images.unsplash.com/photo-1607472586893-a037c0a546a8?auto=format&fit=crop&w=800&q=80']::text[],
      'Ratchet PVC pipe cutter up to 42mm.',
      'Clean cuts for plumbing installations with minimal burr.',
      array['Ratchet action', 'Sharp SK5 blade', 'Ergonomic grip']::text[],
      '{"Max cut":"42mm","Material":"Aluminum body"}'::jsonb,
      '12 months',
      'Standard delivery',
      false,
      false,
      false,
      4.40,
      33
    ),
    (
      'Industrial Extension Cable 50m',
      'ingco-extension-cable-50m',
      'IEC50',
      'building-materials',
      'cables',
      'ingco',
      320.00,
      null,
      30,
      array['https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80']::text[],
      'Heavy-duty 50m extension reel for site power.',
      'Industrial-grade cable reel with thermal protection for construction sites.',
      array['50m cable', '4 outlets', 'Thermal overload protection']::text[],
      '{"Length":"50m","Rating":"16A","Outlets":"4"}'::jsonb,
      '12 months',
      'Nationwide delivery',
      false,
      false,
      false,
      4.50,
      51
    ),
    (
      'Concrete Mixer 350L',
      'industrial-concrete-mixer-350l',
      'CM350',
      'machines',
      'mixers',
      'total',
      12500.00,
      null,
      3,
      array['https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80']::text[],
      '350L drum concrete mixer for medium-scale projects.',
      'Reliable mixing capacity for contractors and block manufacturing.',
      array['350L drum', 'Steel frame', 'Easy dump mechanism']::text[],
      '{"Capacity":"350L","Power":"Electric 2.2kW option"}'::jsonb,
      '12 months on-site support',
      'Freight delivery — quote required',
      false,
      false,
      false,
      4.60,
      12
    ),
    (
      'Rotary Hammer 1050W',
      'bosch-rotary-hammer-1050w',
      'GBH2-26',
      'machines',
      'drills',
      'bosch',
      1450.00,
      1620.00,
      14,
      array['https://images.unsplash.com/photo-1504148455328-c376ef8136c3?auto=format&fit=crop&w=800&q=80']::text[],
      'BOSCH SDS-plus rotary hammer for concrete drilling.',
      'Professional demolition and drilling tool for structural work.',
      array['SDS-plus', 'Anti-vibration', '3 modes']::text[],
      '{"Power":"1050W","Impact":"2.7J","Weight":"2.9kg"}'::jsonb,
      '24 months Bosch warranty',
      'Insured delivery',
      false,
      false,
      true,
      4.90,
      67
    )
) as v(
  name, slug, sku, category_slug, subcategory_slug, brand_slug,
  price, compare_at_price, stock, images, short_description, description,
  features, specifications, warranty, shipping_info,
  is_featured, is_new, is_best_seller, rating, review_count
)
join public.categories c on c.slug = v.category_slug
join public.brands b on b.slug = v.brand_slug
left join public.subcategories s
  on s.slug = v.subcategory_slug
 and s.category_id = c.id
on conflict (sku) do nothing;
