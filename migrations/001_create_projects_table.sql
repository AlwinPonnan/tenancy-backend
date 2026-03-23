CREATE TABLE
    projects (
        id UUID PRIMARY KEY,
        organization_id UUID NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        due_date TIMESTAMP DEFAULT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'active',
        priority VARCHAR(20) NOT NULL DEFAULT 'medium',
        created_by UUID NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP NULL
    );

CREATE INDEX idx_projects_org_created_active
ON projects (organization_id, created_at DESC)
WHERE deleted_at IS NULL;

CREATE INDEX idx_projects_org_id_active
ON projects (organization_id, id)
WHERE deleted_at IS NULL;

CREATE INDEX idx_projects_org_status_active
ON projects (organization_id, status)
WHERE deleted_at IS NULL;