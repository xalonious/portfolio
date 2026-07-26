PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;
PRAGMA busy_timeout = 5000;

DROP TABLE IF EXISTS cms_metadata;

CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    image_alt TEXT NOT NULL,
    image_layout TEXT,
    tech_json TEXT NOT NULL DEFAULT '[]',
    repository_url TEXT,
    featured INTEGER NOT NULL DEFAULT 0,
    sort_order INTEGER NOT NULL DEFAULT 0,
    case_study_json TEXT,
    status TEXT NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'published')),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    published_at TEXT
);

CREATE INDEX IF NOT EXISTS projects_status_sort_idx
    ON projects (status, sort_order, title);

CREATE TABLE IF NOT EXISTS project_drafts (
    project_id TEXT PRIMARY KEY,
    document_json TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS project_revisions (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    document_json TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS project_revisions_project_created_idx
    ON project_revisions (project_id, created_at DESC);

CREATE TABLE IF NOT EXISTS media (
    id TEXT PRIMARY KEY,
    storage_key TEXT NOT NULL UNIQUE,
    public_path TEXT NOT NULL UNIQUE,
    original_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    width INTEGER,
    height INTEGER,
    size_bytes INTEGER NOT NULL,
    created_at TEXT NOT NULL
);

DROP VIEW IF EXISTS published_projects;

CREATE VIEW published_projects AS
SELECT
    slug,
    title,
    description,
    image AS image_path,
    image_alt,
    image_layout,
    tech_json AS technologies_json,
    repository_url,
    featured,
    sort_order,
    case_study_json,
    published_at,
    updated_at
FROM projects
WHERE status = 'published';
