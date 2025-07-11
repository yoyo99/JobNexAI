-- Active le RLS sur la table profiles
alter table profiles enable row level security;

-- Autorise chaque utilisateur à lire/modifier uniquement son profil
create policy "Users can read their own profile" on profiles
  for select using (auth.uid() = id);
create policy "Users can update their own profile" on profiles
  for update using (auth.uid() = id);

-- (Optionnel) Autorise les admins à lire/modifier tous les profils
-- create policy "Admins can manage all profiles" on profiles
--   for all using (EXISTS (select 1 from auth.users u where u.id = auth.uid() and u.role = 'admin'));
