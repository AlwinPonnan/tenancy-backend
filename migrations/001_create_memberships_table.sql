CREATE TABLE memberships (
    id UUID PRIMARY KEY,
    organization_id UUID NOT NULL,
    user_id UUID NOT NULL,
    role VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE UNIQUE INDEX uniq_org_user_active
ON memberships (organization_id, user_id)
WHERE deleted_at IS NULL;

CREATE INDEX idx_membership_user
ON memberships (user_id);

CREATE INDEX idx_membership_org
ON memberships (organization_id);