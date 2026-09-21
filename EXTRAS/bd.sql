docker run --name neon-siege-db -e POSTGRES_PASSWORD=aramysaul -e POSTGRES_USER=user1 -e POSTGRES_DB=neon-siege -v neon-siege-data:/var/lib/postgresql/data -p 5433:5432 -d postgres:17
-- Habilitar extensión para UUIDs v4 (incluida de forma estándar en PostgreSQL)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Tabla de Jugadores (Identidad)
CREATE TABLE IF NOT EXISTS players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(30) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Partidas / Puntuaciones
CREATE TABLE IF NOT EXISTS scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    final_score INTEGER NOT NULL CHECK (final_score >= 0),
    waves_survived INTEGER NOT NULL CHECK (waves_survived >= 0),
    survival_time_seconds INTEGER NOT NULL CHECK (survival_time_seconds >= 0),
    bosses_defeated INTEGER NOT NULL DEFAULT 0 CHECK (bosses_defeated >= 0),
    enemies_killed INTEGER NOT NULL DEFAULT 0 CHECK (enemies_killed >= 0),
    max_combo INTEGER NOT NULL DEFAULT 1 CHECK (max_combo >= 1),
    played_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índice compuesto para el Top 10 (Leaderboard)
-- Ordena primero por puntaje más alto, y en caso de empate, por mayor tiempo sobrevivido
CREATE INDEX IF NOT EXISTS idx_scores_leaderboard 
ON scores (final_score DESC, survival_time_seconds DESC);
