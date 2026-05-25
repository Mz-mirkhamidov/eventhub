ALTER TABLE bookings ADD COLUMN IF NOT EXISTS order_type VARCHAR(50) DEFAULT 'VENUE_BOOKING';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS content_format VARCHAR(100);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS publication_date DATE;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS brief_description TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS blogger_profile_id UUID;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS event_city VARCHAR(100);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS guests_count INTEGER;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;

ALTER TABLE venue_profiles ADD COLUMN IF NOT EXISTS advance_payment_percent INTEGER DEFAULT 30;
ALTER TABLE artist_profiles ADD COLUMN IF NOT EXISTS advance_payment_percent INTEGER DEFAULT 30;
ALTER TABLE blogger_profiles ADD COLUMN IF NOT EXISTS advance_payment_percent INTEGER DEFAULT 30;

CREATE TABLE IF NOT EXISTS event_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_type VARCHAR(50),
    city VARCHAR(100),
    event_date DATE,
    guests_count INTEGER,
    budget NUMERIC(14, 2),
    selected_services TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
