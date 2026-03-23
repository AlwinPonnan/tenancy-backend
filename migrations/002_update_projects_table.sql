CREATE UNIQUE INDEX uniq_projects_org_name_active
ON projects (organization_id, name)
WHERE deleted_at IS NULL;