"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

// Services & types
import { loadProjects, searchFilterSort, ALLOWED_SLOTS } from "@/lib/projects-local";
import type { Project, ProjectFilter, ProjectSort } from "@/types/domain";
import { buildProjectPath, buildShotlistPath, buildSchedulePath, buildCallsheetPath } from "@/lib/paths";

// Hub components (assumed default exports)
import Toolbar from "@/features/hub/components/Toolbar";
import UsageBar from "@/features/hub/components/UsageBar";
import ProjectGrid from "@/features/hub/components/ProjectGrid";
import ManageSlotsModal from "@/features/hub/components/ManageSlotsModal";
import NewProjectModal from "@/features/hub/components/NewProjectModal";
import ImportProject from "@/features/hub/components/ImportProject";
import EmptyState from "@/features/hub/components/EmptyState";

export default function HubPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<ProjectFilter>("all");
  const [sort, setSort] = useState<ProjectSort>("recent");

  // Modals
  const [showManage, setShowManage] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showImport, setShowImport] = useState(false);

  useEffect(() => {
    setProjects(loadProjects());
    // เผื่อมีการแก้ไขจากแท็บอื่น
    const onStorage = (e: StorageEvent) => {
      if (e.key === "filmProductionProjects") setProjects(loadProjects());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const activeCount = useMemo(() => projects.filter(p => p.active && !p.archived).length, [projects]);
  const allowed = ALLOWED_SLOTS;

  const visible = useMemo(
    () => searchFilterSort(projects, q, filter, sort),
    [projects, q, filter, sort]
  );

  // หลังปิดโมดัลให้ refresh รายการ
  const refresh = () => setProjects(loadProjects());

  return (
    <main style={{ background: "var(--neutral-900)", color: "white", minHeight: "100vh" }}>
      {/* Top bar */}
      <div style={{ position: "sticky", top: 0, zIndex: 20, borderBottom: "1px solid var(--neutral-700)", background: "var(--neutral-900)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontWeight: 600, letterSpacing: 0.2 }}>Claqueta</div>
          <div style={{ flex: 1 }}>
            <Toolbar
              query={q}
              onQueryChange={setQ}
              filter={filter}
              onFilterChange={setFilter}
              sort={sort}
              onSortChange={setSort}
              onNewClick={() => setShowNew(true)}
              onImportClick={() => setShowImport(true)}
              onTemplatesClick={() => {/* TODO: template picker */}}
            />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {/* เผื่อพื้นที่ Avatar / Sign in (ภายหลัง) */}
          </div>
        </div>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "6px 20px 12px" }}>
          <UsageBar activeCount={activeCount} allowed={allowed} onManage={() => setShowManage(true)} />
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px" }}>
        {visible.length === 0 ? (
          <EmptyState
            onCreateTemplate={() => setShowNew(true)}
            onImport={() => setShowImport(true)}
          />
        ) : (
          <ProjectGrid
            projects={visible}
            // ลิงก์ด่วนไปหน้าในโปรเจกต์
            buildOpen={(id) => buildProjectPath(id)}
            buildShotlist={(id) => buildShotlistPath(id)}
            buildSchedule={(id) => buildSchedulePath(id)}
            buildCallsheet={(id) => buildCallsheetPath(id)}
            onAfterAction={refresh}
          />
        )}
      </div>

      {/* Modals */}
      {showManage && (
        <ManageSlotsModal
          open={showManage}
          onClose={() => setShowManage(false)}
          onChanged={refresh}
        />
      )}
      {showNew && (
        <NewProjectModal
          open={showNew}
          onClose={() => setShowNew(false)}
          onCreated={refresh}
        />
      )}
      {showImport && (
        <ImportProject
          open={showImport}
          onClose={() => setShowImport(false)}
          onImported={refresh}
        />
      )}
    </main>
  );
}
