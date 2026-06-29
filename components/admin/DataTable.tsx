"use client";

import {
  useMemo,
  useState,
  useEffect,
  useTransition,
  type ReactNode,
} from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  X,
} from "lucide-react";
import { useToast } from "@/components/admin/ToastProvider";

export interface SortableConfig {
  /** Persist the new full ordering of row keys. */
  onReorder: (orderedKeys: string[]) => Promise<{ error?: string }>;
}

export interface SelectionConfig {
  /**
   * Renders the bulk-action buttons in the floating bar. `selectedKeys` are the
   * row keys currently selected; call `clear()` after a successful action.
   */
  renderBulkActions: (
    selectedKeys: string[],
    clear: () => void
  ) => ReactNode;
}

export interface Column<T> {
  /** Header label. */
  header: string;
  /** Cell renderer. */
  cell: (row: T) => ReactNode;
  /** Optional width class for the column (e.g. "w-12"). */
  className?: string;
  /** Hide this column on the mobile card layout. */
  hideOnMobile?: boolean;
}

/**
 * Reusable admin data table: client-side search + pagination, responsive
 * (table on desktop, cards on mobile). Generic over the row type.
 */
export function DataTable<T>({
  rows,
  columns,
  getRowKey,
  searchableText,
  searchPlaceholder = "Search…",
  pageSize = 10,
  actions,
  toolbar,
  emptyMessage = "No records.",
  sortable,
  selection,
}: {
  rows: T[];
  columns: Column<T>[];
  getRowKey: (row: T) => string;
  /** Concatenated text used for client-side filtering. */
  searchableText: (row: T) => string;
  searchPlaceholder?: string;
  pageSize?: number;
  /** Right-aligned per-row actions (menu, buttons). */
  actions?: (row: T) => ReactNode;
  /** Optional toolbar content rendered next to the search box (e.g. New btn). */
  toolbar?: ReactNode;
  emptyMessage?: string;
  /** Enable drag-to-reorder (persisted via onReorder). */
  sortable?: SortableConfig;
  /** Enable multi-row selection + a floating bulk-action bar. */
  selection?: SelectionConfig;
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(pageSize);

  // Local ordering for drag-and-drop; synced when the source rows change.
  const [order, setOrder] = useState<T[]>(rows);
  const [dragKey, setDragKey] = useState<string | null>(null);
  const [overKey, setOverKey] = useState<string | null>(null);
  const [reordering, startReorder] = useTransition();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const toast = useToast();

  useEffect(() => {
    setOrder(rows);
  }, [rows]);

  // Drop selections for rows that no longer exist (e.g. after a bulk delete).
  useEffect(() => {
    const valid = new Set(rows.map(getRowKey));
    setSelected((prev) => {
      const next = new Set([...prev].filter((k) => valid.has(k)));
      return next.size === prev.size ? prev : next;
    });
  }, [rows, getRowKey]);

  const sourceRows = sortable ? order : rows;

  // Drag-to-reorder operates within the current page; disabled while a search
  // filter is active (reordering a filtered subset is ambiguous).
  const canDrag = Boolean(sortable) && query.trim() === "";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sourceRows;
    return sourceRows.filter((r) =>
      searchableText(r).toLowerCase().includes(q)
    );
  }, [sourceRows, query, searchableText]);

  // Always paginate; drag-reorder operates within the current page.
  const paginate = true;
  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, pageCount - 1);
  const pageRows = filtered.slice(
    safePage * perPage,
    safePage * perPage + perPage
  );

  function onSearch(value: string) {
    setQuery(value);
    setPage(0);
  }

  // ---- selection ----
  const pageKeys = pageRows.map(getRowKey);
  const allPageSelected =
    pageKeys.length > 0 && pageKeys.every((k) => selected.has(k));
  const somePageSelected = pageKeys.some((k) => selected.has(k));

  function toggleRow(key: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function togglePage() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allPageSelected) pageKeys.forEach((k) => next.delete(k));
      else pageKeys.forEach((k) => next.add(k));
      return next;
    });
  }

  function clearSelection() {
    setSelected(new Set());
  }

  function handleDrop(targetKey: string) {
    if (!sortable || !dragKey || dragKey === targetKey) {
      setDragKey(null);
      setOverKey(null);
      return;
    }
    const keys = order.map(getRowKey);
    const from = keys.indexOf(dragKey);
    const to = keys.indexOf(targetKey);
    if (from === -1 || to === -1) return;

    const next = [...order];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setOrder(next); // optimistic
    setDragKey(null);
    setOverKey(null);

    persistOrder(next);
  }

  function moveByOne(key: string, delta: number) {
    if (!sortable) return;
    const idx = order.findIndex((r) => getRowKey(r) === key);
    const target = idx + delta;
    if (idx === -1 || target < 0 || target >= order.length) return;
    const next = [...order];
    [next[idx], next[target]] = [next[target], next[idx]];
    setOrder(next);
    persistOrder(next);
  }

  function persistOrder(next: T[]) {
    if (!sortable) return;
    const orderedKeys = next.map(getRowKey);
    startReorder(async () => {
      const res = await sortable.onReorder(orderedKeys);
      if (res.error) {
        toast.error(`Reorder failed: ${res.error}`);
        setOrder(rows); // revert
      } else {
        toast.success("Order updated.");
      }
    });
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
          <input
            value={query}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full border border-outline-variant bg-surface-container-lowest py-2.5 pl-10 pr-4 font-body-md text-on-surface placeholder:text-on-surface-variant/40 focus:border-primary focus:outline-none"
          />
        </div>
        {toolbar}
      </div>

      {filtered.length === 0 ? (
        <div className="border border-dashed border-outline-variant p-12 text-center font-geist text-mono-data text-on-surface-variant">
          {query ? `No results for “${query}”.` : emptyMessage}
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden border border-outline-variant/50 md:block">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/50 bg-surface-container-lowest text-left font-geist text-label-caps uppercase tracking-[0.1em] text-on-surface-variant">
                  {selection && (
                    <th className="w-px px-4 py-3">
                      <input
                        type="checkbox"
                        aria-label="Select all on this page"
                        checked={allPageSelected}
                        ref={(el) => {
                          if (el)
                            el.indeterminate =
                              somePageSelected && !allPageSelected;
                        }}
                        onChange={togglePage}
                        className="h-4 w-4 cursor-pointer accent-primary"
                      />
                    </th>
                  )}
                  {canDrag && <th className="w-8 px-2 py-3" />}
                  {columns.map((c) => (
                    <th
                      key={c.header}
                      className={`px-4 py-3 font-medium ${c.className ?? ""}`}
                    >
                      {c.header}
                    </th>
                  ))}
                  {actions && <th className="w-px px-4 py-3" />}
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row) => {
                  const key = getRowKey(row);
                  const isDragging = dragKey === key;
                  const isOver = overKey === key && dragKey !== key;
                  return (
                    <tr
                      key={key}
                      onDragOver={
                        canDrag
                          ? (e) => {
                              e.preventDefault();
                              setOverKey(key);
                            }
                          : undefined
                      }
                      onDrop={canDrag ? () => handleDrop(key) : undefined}
                      className={`border-b border-outline-variant/40 align-top transition-colors last:border-b-0 hover:bg-surface-container-lowest/60 ${
                        isDragging ? "opacity-40" : ""
                      } ${isOver ? "border-t-2 border-t-primary" : ""} ${
                        selected.has(key) ? "bg-primary/5" : ""
                      }`}
                    >
                      {selection && (
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            aria-label="Select row"
                            checked={selected.has(key)}
                            onChange={() => toggleRow(key)}
                            className="h-4 w-4 cursor-pointer accent-primary"
                          />
                        </td>
                      )}
                      {canDrag && (
                        <td className="px-2 py-3">
                          <span
                            draggable
                            onDragStart={() => setDragKey(key)}
                            onDragEnd={() => {
                              setDragKey(null);
                              setOverKey(null);
                            }}
                            aria-label="Drag to reorder"
                            className="flex h-6 w-6 cursor-grab items-center justify-center text-on-surface-variant/50 hover:text-on-surface active:cursor-grabbing"
                          >
                            <GripVertical className="h-4 w-4" />
                          </span>
                        </td>
                      )}
                      {columns.map((c) => (
                        <td
                          key={c.header}
                          className={`px-4 py-3 ${c.className ?? ""}`}
                        >
                          {c.cell(row)}
                        </td>
                      ))}
                      {actions && (
                        <td className="w-px whitespace-nowrap px-4 py-3 text-right">
                          {actions(row)}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-gutter md:hidden">
            {pageRows.map((row, idx) => {
              const [identity, ...rest] = columns;
              const key = getRowKey(row);
              return (
                <div
                  key={key}
                  className={`border border-outline-variant/50 bg-surface-container-lowest p-4 ${
                    selected.has(key) ? "ring-1 ring-primary" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    {selection && (
                      <input
                        type="checkbox"
                        aria-label="Select row"
                        checked={selected.has(key)}
                        onChange={() => toggleRow(key)}
                        className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-primary"
                      />
                    )}
                    {/* Touch-friendly reorder arrows (drag is unreliable on touch) */}
                    {canDrag && (
                      <div className="flex shrink-0 flex-col">
                        <button
                          type="button"
                          aria-label="Move up"
                          disabled={idx === 0}
                          onClick={() => moveByOne(getRowKey(row), -1)}
                          className="text-on-surface-variant disabled:opacity-30"
                        >
                          <ChevronLeft className="h-4 w-4 rotate-90" />
                        </button>
                        <button
                          type="button"
                          aria-label="Move down"
                          disabled={idx === pageRows.length - 1}
                          onClick={() => moveByOne(getRowKey(row), 1)}
                          className="text-on-surface-variant disabled:opacity-30"
                        >
                          <ChevronRight className="h-4 w-4 rotate-90" />
                        </button>
                      </div>
                    )}
                    {/* First column = rich identity cell (thumbnail/title/etc.) */}
                    <div className="min-w-0 flex-1">{identity.cell(row)}</div>
                    {actions && <div className="shrink-0">{actions(row)}</div>}
                  </div>

                  <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 border-t border-outline-variant/30 pt-3">
                    {rest
                      .filter((c) => !c.hideOnMobile)
                      .map((c) => (
                        <div key={c.header} className="contents">
                          <dt className="font-geist text-label-caps uppercase tracking-[0.1em] text-on-surface-variant">
                            {c.header}
                          </dt>
                          <dd className="min-w-0 font-geist text-mono-data text-on-surface">
                            {c.cell(row)}
                          </dd>
                        </div>
                      ))}
                  </dl>
                </div>
              );
            })}
          </div>

          {/* Pagination / status — bar is always shown when paginating. */}
          <div className="mt-4 flex flex-col gap-3 font-geist text-mono-data text-on-surface-variant sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span>
                {reordering
                  ? "Saving order…"
                  : `${filtered.length} result${
                      filtered.length === 1 ? "" : "s"
                    }${query ? ` for “${query}”` : ""}`}
              </span>
              <label className="flex items-center gap-2">
                <span className="text-on-surface-variant/70">Show</span>
                <select
                  value={perPage}
                  onChange={(e) => {
                    setPerPage(Number(e.target.value));
                    setPage(0);
                  }}
                  className="cursor-pointer border border-outline-variant bg-surface-container-lowest px-2 py-1 text-on-surface focus:border-primary focus:outline-none"
                >
                  {[5, 10, 25, 50, 100].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {paginate && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={safePage === 0}
                  className="flex h-8 w-8 items-center justify-center border border-outline-variant text-on-surface transition-colors hover:border-primary disabled:opacity-30 disabled:hover:border-outline-variant"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="px-1 tabular-nums">
                  Page {safePage + 1} of {pageCount}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setPage((p) => Math.min(pageCount - 1, p + 1))
                  }
                  disabled={safePage >= pageCount - 1}
                  className="flex h-8 w-8 items-center justify-center border border-outline-variant text-on-surface transition-colors hover:border-primary disabled:opacity-30 disabled:hover:border-outline-variant"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Floating bulk-action bar */}
      {selection && selected.size > 0 && (
        <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[120] flex justify-center px-4 lg:left-64">
          <div className="animate-fade-up pointer-events-auto flex w-full max-w-2xl flex-wrap items-center gap-3 border border-outline-variant bg-surface-container-lowest px-4 py-3 shadow-2xl">
            <span className="font-geist text-label-caps uppercase tracking-[0.1em] text-primary">
              {selected.size} selected
            </span>
            <div className="ml-auto flex flex-wrap items-center gap-2">
              {selection.renderBulkActions([...selected], clearSelection)}
              <button
                type="button"
                onClick={clearSelection}
                aria-label="Clear selection"
                className="flex h-8 w-8 items-center justify-center text-on-surface-variant transition-colors hover:text-on-surface"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
