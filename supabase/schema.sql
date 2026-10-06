-- Tabel profile (data diri)
create table if not exists profile (
  id bigint primary key generated always as identity,
  name text,
  title text,
  bio text,
  email text,
  avatar_url text
);

-- Tabel link sosial media
create table if not exists social_links (
  id bigint primary key generated always as identity,
  github text,
  linkedin text,
  gitlab text,
  twitter text,
  instagram text,
  youtube text,
  website text
);

-- Tabel skills
create table if not exists skills (
  id bigint primary key generated always as identity,
  name text not null,
  level int default 80
);

-- Tabel projects
create table if not exists projects (
  id bigint primary key generated always as identity,
  title text not null,
  description text,
  tech_stack text,
  live_url text,
  repo_url text,
  image_url text
);

-- Tabel experience
create table if not exists experiences (
  id bigint primary key generated always as identity,
  year text,
  position text,
  workplace text
);

-- Tabel education
create table if not exists education (
  id bigint primary key generated always as identity,
  university text,
  degree text,
  year text,
  location text
);

-- Tabel certifications
create table if not exists certifications (
  id bigint primary key generated always as identity,
  title text,
  issuer text,
  year text,
  issuer_logo_url text,
  title_en text,
  title_ja text,
  issuer_en text,
  issuer_ja text,
  image_url text
);

alter table certifications add column if not exists issuer_logo_url text;
alter table certifications add column if not exists title_en text;
alter table certifications add column if not exists title_ja text;
alter table certifications add column if not exists issuer_en text;
alter table certifications add column if not exists issuer_ja text;

-- Aktifkan Row Level Security
alter table profile enable row level security;
alter table social_links enable row level security;
alter table skills enable row level security;
alter table projects enable row level security;
alter table experiences enable row level security;
alter table education enable row level security;
alter table certifications enable row level security;

-- Baca publik
create policy "public read profile" on profile for select using (true);
create policy "public read social_links" on social_links for select using (true);
create policy "public read skills" on skills for select using (true);
create policy "public read projects" on projects for select using (true);
create policy "public read experiences" on experiences for select using (true);
create policy "public read education" on education for select using (true);
create policy "public read certifications" on certifications for select using (true);

-- Tulis hanya admin (login)
create policy "admin write profile" on profile for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write social_links" on social_links for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write skills" on skills for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write projects" on projects for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write experiences" on experiences for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write education" on education for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write certifications" on certifications for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Storage bucket untuk foto profil
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "public read avatars" on storage.objects for select using (bucket_id = 'avatars');
create policy "admin upload avatars" on storage.objects for insert with check (bucket_id = 'avatars' and auth.role() = 'authenticated');

-- Kolom terjemahan
alter table profile add column if not exists title_en text;
alter table profile add column if not exists title_ja text;
alter table profile add column if not exists bio_en text;
alter table profile add column if not exists bio_ja text;

alter table experiences add column if not exists position_en text;
alter table experiences add column if not exists position_ja text;
alter table experiences add column if not exists workplace_en text;
alter table experiences add column if not exists workplace_ja text;

alter table education add column if not exists university_en text;
alter table education add column if not exists university_ja text;
alter table education add column if not exists degree_en text;
alter table education add column if not exists degree_ja text;
alter table education add column if not exists location_en text;
alter table education add column if not exists location_ja text;

alter table projects add column if not exists title_en text;
alter table projects add column if not exists title_ja text;
alter table projects add column if not exists description_en text;
alter table projects add column if not exists description_ja text;
alter table projects add column if not exists image_url text;

alter table certifications add column if not exists image_url text;

-- Storage bucket untuk screenshot project/sertifikat
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

create policy "public read portfolio" on storage.objects for select using (bucket_id = 'portfolio');
create policy "admin upload portfolio" on storage.objects for insert with check (bucket_id = 'portfolio' and auth.role() = 'authenticated');

