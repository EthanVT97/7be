CREATE TABLE IF NOT EXISTS lottery_numbers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    number TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('2D', '3D')),
    date DATE NOT NULL,
    time_period TEXT NOT NULL CHECK (time_period IN ('morning', 'evening')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'won')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_lottery_numbers_date ON lottery_numbers(date);
CREATE INDEX IF NOT EXISTS idx_lottery_numbers_type ON lottery_numbers(type);
CREATE UNIQUE INDEX IF NOT EXISTS idx_lottery_unique_draw ON lottery_numbers(date, time_period, type); 