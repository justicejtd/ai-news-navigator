"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Article, Collection, SavedCollectionsState, SavedItem } from "@lib/types";

const STORAGE_KEY = "ainavigator:saves";

export type SavedCollectionsContextValue = {
  collections: Collection[];
  items: Record<string, SavedItem>;
  defaultCollectionId: string;
  createCollection: (input: { name: string; description?: string }) => Collection;
  saveToCollection: (article: Article, collectionId: string) => void;
  removeFromCollection: (articleId: string, collectionId?: string) => void;
  toggleSave: (article: Article, collectionId: string) => void;
  isSaved: (articleId: string, collectionId?: string) => boolean;
  exportCollection: (collectionId: string) => { filename: string; content: string } | null;
};

const SavedCollectionsContext = createContext<SavedCollectionsContextValue | undefined>(undefined);

function createInitialState(): SavedCollectionsState {
  const baseCollection: Collection = {
    id: "read-later",
    name: "Read Later",
    description: "Quick dropbox for interesting stories.",
    itemIds: [],
    createdAt: Date.now(),
  };

  return {
    collections: [baseCollection],
    items: {},
  };
}

function loadState(): SavedCollectionsState {
  if (typeof window === "undefined") return createInitialState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw) as SavedCollectionsState;
    if (!parsed.collections?.length) {
      return createInitialState();
    }
    return parsed;
  } catch (error) {
    console.error("Failed to parse saved collections", error);
    return createInitialState();
  }
}

export function SavedCollectionsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SavedCollectionsState>(createInitialState);

  useEffect(() => {
    setState(loadState());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const createCollection = useCallback((input: { name: string; description?: string }) => {
    const id = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `collection-${Math.random().toString(36).slice(2, 10)}`;
    const collection: Collection = {
      id,
      name: input.name.trim(),
      description: input.description?.trim(),
      itemIds: [],
      createdAt: Date.now(),
    };
    setState((prev) => ({
      collections: [...prev.collections, collection],
      items: prev.items,
    }));
    return collection;
  }, []);

  const saveToCollection = useCallback((article: Article, collectionId: string) => {
    setState((prev) => {
      const collection = prev.collections.find((c) => c.id === collectionId);
      if (!collection) return prev;
      const items = { ...prev.items };
      const existing = items[article.id];
      const item: SavedItem = existing
        ? { ...existing, collectionIds: Array.from(new Set([...existing.collectionIds, collectionId])) }
        : { article, savedAt: Date.now(), collectionIds: [collectionId] };
      items[article.id] = item;

      const collections = prev.collections.map((c) =>
        c.id === collectionId
          ? { ...c, itemIds: Array.from(new Set([...c.itemIds, article.id])) }
          : c
      );

      return { collections, items };
    });
  }, []);

  const removeFromCollection = useCallback((articleId: string, collectionId?: string) => {
    setState((prev) => {
      const items = { ...prev.items };
      const existing = items[articleId];
      if (!existing) return prev;

      let updatedCollections = prev.collections;
      if (collectionId) {
        updatedCollections = prev.collections.map((collection) =>
          collection.id === collectionId
            ? { ...collection, itemIds: collection.itemIds.filter((id) => id !== articleId) }
            : collection
        );
        const remaining = existing.collectionIds.filter((id) => id !== collectionId);
        if (remaining.length === 0) {
          delete items[articleId];
        } else {
          items[articleId] = { ...existing, collectionIds: remaining };
        }
      } else {
        updatedCollections = prev.collections.map((collection) => ({
          ...collection,
          itemIds: collection.itemIds.filter((id) => id !== articleId),
        }));
        delete items[articleId];
      }

      return {
        collections: updatedCollections,
        items,
      };
    });
  }, []);

  const toggleSave = useCallback(
    (article: Article, collectionId: string) => {
      setState((prev) => {
        const collection = prev.collections.find((c) => c.id === collectionId);
        if (!collection) return prev;
        const existing = prev.items[article.id];
        const isSaved = existing?.collectionIds.includes(collectionId);
        if (isSaved) {
          const items = { ...prev.items };
          const updatedCollectionIds = existing.collectionIds.filter((id) => id !== collectionId);
          if (updatedCollectionIds.length === 0) {
            delete items[article.id];
          } else {
            items[article.id] = { ...existing, collectionIds: updatedCollectionIds };
          }
          const collections = prev.collections.map((c) =>
            c.id === collectionId
              ? { ...c, itemIds: c.itemIds.filter((id) => id !== article.id) }
              : c
          );
          return { collections, items };
        }
        const items = {
          ...prev.items,
          [article.id]: existing
            ? {
                ...existing,
                collectionIds: Array.from(new Set([...existing.collectionIds, collectionId])),
              }
            : { article, savedAt: Date.now(), collectionIds: [collectionId] },
        };
        const collections = prev.collections.map((c) =>
          c.id === collectionId
            ? { ...c, itemIds: Array.from(new Set([...c.itemIds, article.id])) }
            : c
        );
        return { collections, items };
      });
    },
    []
  );

  const isSaved = useCallback(
    (articleId: string, collectionId?: string) => {
      const item = state.items[articleId];
      if (!item) return false;
      if (!collectionId) return item.collectionIds.length > 0;
      return item.collectionIds.includes(collectionId);
    },
    [state.items]
  );

  const exportCollection = useCallback(
    (collectionId: string) => {
      const collection = state.collections.find((c) => c.id === collectionId);
      if (!collection) return null;
      const lines = collection.itemIds
        .map((id) => {
          const item = state.items[id];
          if (!item) return null;
          return `- ${item.article.title} (${item.article.source.name})\n  ${item.article.url}`;
        })
        .filter(Boolean);
      const content = `Collection: ${collection.name}\nGenerated: ${new Date().toISOString()}\n\n${lines.join("\n")}`;
      const filename = `${collection.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "collection"}.txt`;
      return { filename, content };
    },
    [state.collections, state.items]
  );

  const value = useMemo(
    () => ({
      collections: state.collections,
      items: state.items,
      defaultCollectionId: state.collections[0]?.id ?? "read-later",
      createCollection,
      saveToCollection,
      removeFromCollection,
      toggleSave,
      isSaved,
      exportCollection,
    }),
    [state, createCollection, saveToCollection, removeFromCollection, toggleSave, isSaved, exportCollection]
  );

  return <SavedCollectionsContext.Provider value={value}>{children}</SavedCollectionsContext.Provider>;
}

export function useSavedCollections() {
  const ctx = useContext(SavedCollectionsContext);
  if (!ctx) {
    throw new Error("useSavedCollections must be used within SavedCollectionsProvider");
  }
  return ctx;
}
