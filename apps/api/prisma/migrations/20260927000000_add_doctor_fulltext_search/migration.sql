-- Add full-text search capability to DoctorProfile
-- This migration adds a tsvector column, GIN index, and trigger for auto-updating

-- 1. Add search_vector column to doctor_profile table
ALTER TABLE "doctor_profile" ADD COLUMN "search_vector" tsvector;

-- 2. Create GIN index on search_vector for fast full-text search
CREATE INDEX "doctor_profile_search_vector_idx" ON "doctor_profile" USING GIN ("search_vector");

-- 3. Create function to update search_vector
CREATE OR REPLACE FUNCTION update_doctor_search_vector()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.specialty, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.designation, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.bio, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.license_no, '')), 'B');
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

-- 4. Create trigger to auto-update search_vector on INSERT and UPDATE
DROP TRIGGER IF EXISTS "doctor_profile_search_vector_trigger" ON "doctor_profile";
CREATE TRIGGER "doctor_profile_search_vector_trigger"
  BEFORE INSERT OR UPDATE ON "doctor_profile"
  FOR EACH ROW EXECUTE FUNCTION update_doctor_search_vector();

-- 5. Populate search_vector for existing records
UPDATE "doctor_profile"
SET "search_vector" =
  setweight(to_tsvector('english', COALESCE(specialty, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(designation, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(bio, '')), 'B') ||
  setweight(to_tsvector('english', COALESCE(license_no, '')), 'B');

-- 6. Create materialized view for optimized doctor search
CREATE MATERIALIZED VIEW "doctor_search_view" AS
SELECT
  dp.id,
  dp.user_id,
  dp.specialty,
  dp.designation,
  dp.license_no,
  dp.bio,
  dp.fee,
  dp.is_verified,
  dp.search_vector,
  u.email,
  u.first_name,
  u.last_name,
  u.phone,
  u.email_verified
FROM "doctor_profile" dp
JOIN "user" u ON dp.user_id = u.id
WHERE u.user_type = 'DOCTOR';

-- 7. Create indexes on materialized view
CREATE INDEX "doctor_search_view_specialty_idx" ON "doctor_search_view" (specialty);
CREATE INDEX "doctor_search_view_search_vector_idx" ON "doctor_search_view" USING GIN (search_vector);
CREATE INDEX "doctor_search_view_fee_idx" ON "doctor_search_view" (fee);
CREATE INDEX "doctor_search_view_user_idx" ON "doctor_search_view" (user_id);

-- 8. Create function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_doctor_search_view()
RETURNS trigger AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY "doctor_search_view";
  RETURN NULL;
END
$$ LANGUAGE plpgsql;

-- 9. Create trigger to refresh materialized view on doctor_profile changes
DROP TRIGGER IF EXISTS "doctor_profile_mv_refresh_trigger" ON "doctor_profile";
CREATE TRIGGER "doctor_profile_mv_refresh_trigger"
  AFTER INSERT OR UPDATE OR DELETE ON "doctor_profile"
  FOR EACH STATEMENT EXECUTE FUNCTION refresh_doctor_search_view();