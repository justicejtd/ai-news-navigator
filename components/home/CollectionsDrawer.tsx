"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Download, FolderPlus, X } from "lucide-react";
import { useSavedCollections } from "@context/SavedCollectionsContext";

export type CollectionsDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultCollectionId: string;
};

export function CollectionsDrawer({ open, onOpenChange, defaultCollectionId }: CollectionsDrawerProps) {
  const { collections, items, createCollection, removeFromCollection, exportCollection } = useSavedCollections();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>(defaultCollectionId);

  useEffect(() => {
    if (!open) return;
    setSelectedCollectionId(defaultCollectionId);
  }, [open, defaultCollectionId]);

  const selectedCollection = useMemo(
    () => collections.find((collection) => collection.id === selectedCollectionId) ?? collections[0],
    [collections, selectedCollectionId]
  );

  const savedItems = useMemo(() => {
    if (!selectedCollection) return [];
    return selectedCollection.itemIds
      .map((id) => items[id])
      .filter(Boolean)
      .sort((a, b) => b.savedAt - a.savedAt);
  }, [items, selectedCollection]);

  const handleCreateCollection = () => {
    if (!name.trim()) return;
    const collection = createCollection({ name, description });
    setSelectedCollectionId(collection.id);
    setName("");
    setDescription("");
  };

  const handleExport = () => {
    if (!selectedCollection) return;
    const result = exportCollection(selectedCollection.id);
    if (!result) return;
    const blob = new Blob([result.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = result.filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onOpenChange}>
        <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-slate-950/70" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 sm:items-center sm:p-6">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="translate-y-10 opacity-0"
              enterTo="translate-y-0 opacity-100"
              leave="ease-in duration-150"
              leaveFrom="translate-y-0 opacity-100"
              leaveTo="translate-y-10 opacity-0"
            >
              <Dialog.Panel className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-slate-950/95 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
                  <Dialog.Title className="text-lg font-semibold text-white">Collections</Dialog.Title>
                  <button
                    type="button"
                    onClick={() => onOpenChange(false)}
                    className="rounded-full border border-white/10 p-2 text-slate-300 transition hover:border-brand-400 focus-visible:ring-brand-400"
                    aria-label="Close collections"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid gap-6 p-6 sm:grid-cols-12">
                  <div className="space-y-4 sm:col-span-4">
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400">Your collections</h3>
                      <div className="mt-3 space-y-2">
                        {collections.map((collection) => (
                          <button
                            key={collection.id}
                            onClick={() => setSelectedCollectionId(collection.id)}
                            className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${
                              selectedCollection?.id === collection.id
                                ? "border-brand-400 bg-brand-500/10 text-brand-100"
                                : "border-white/10 bg-white/5 text-slate-200 hover:border-brand-400"
                            }`}
                          >
                            <p className="font-medium">{collection.name}</p>
                            <p className="text-xs text-slate-400">{collection.itemIds.length} saved</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <h4 className="flex items-center gap-2 text-sm font-semibold text-white">
                        <FolderPlus className="h-4 w-4" /> New collection
                      </h4>
                      <div className="mt-3 space-y-3">
                        <input
                          value={name}
                          onChange={(event) => setName(event.target.value)}
                          placeholder="Name"
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400"
                        />
                        <textarea
                          value={description}
                          onChange={(event) => setDescription(event.target.value)}
                          placeholder="Optional description"
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400"
                          rows={2}
                        />
                        <button
                          type="button"
                          onClick={handleCreateCollection}
                          className="w-full rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-400 focus-visible:ring-brand-200"
                        >
                          Create
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 sm:col-span-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-white">{selectedCollection?.name}</h3>
                        <p className="text-xs text-slate-400">
                          {selectedCollection?.description || "Organize your saved briefings and exports."}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleExport}
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs text-slate-200 transition hover:border-brand-400 focus-visible:ring-brand-400"
                      >
                        <Download className="h-4 w-4" /> Export
                      </button>
                    </div>

                    <div className="space-y-3">
                      {savedItems.length === 0 && (
                        <p className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
                          No saved stories yet — tap the save icon on any card to add it here.
                        </p>
                      )}
                      {savedItems.map((entry) => (
                        <div
                          key={entry.article.id}
                          className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div>
                            <p className="text-sm font-semibold text-white">{entry.article.title}</p>
                            <p className="text-xs text-slate-400">
                              {entry.article.source.name} • saved {new Date(entry.savedAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <a
                              href={entry.article.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-200 transition hover:border-brand-400 focus-visible:ring-brand-400"
                            >
                              Open
                            </a>
                            <button
                              type="button"
                              onClick={() => removeFromCollection(entry.article.id, selectedCollection?.id)}
                              className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-200 transition hover:border-brand-400 focus-visible:ring-brand-400"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
