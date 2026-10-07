"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ArrowDown,
  ArrowUp,
  Command as CommandIcon,
  CornerDownLeft,
  History,
  Search,
  Sparkles,
  Timer,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { on } from "@/lib/events";

import {
  AVAILABLE_TOOLS,
  searchTools,
} from "@/config/tools";

import {
  executeCommand,
} from "@/features/command-center/lib/executor";

import {
  parseCommand,
} from "@/features/command-center/lib/parser";

import {
  localStorageAdapter,
  STORAGE_KEYS,
} from "@/lib/storage";

const RECENT_TOOLS_KEY =
  STORAGE_KEYS.recentTools;

const MAX_RECENT_TOOLS = 6;

type CommandPaletteProps = {
  showLauncher?: boolean;
};

export function CommandPalette({
  showLauncher = true,
}: CommandPaletteProps) {
  const router = useRouter();

  const inputRef =
    useRef<HTMLInputElement>(null);

  const [open, setOpen] =
    useState(false);

  const [query, setQuery] =
    useState("");

  const [selectedIndex, setSelectedIndex] =
    useState(0);

  const [recentTools, setRecentTools] =
    useState<string[]>([]);

  useEffect(() => {
    const stored =
      localStorageAdapter.get<unknown>(
        RECENT_TOOLS_KEY,
      );

    if (Array.isArray(stored)) {
      setRecentTools(
        stored.filter(
          (value): value is string =>
            typeof value === "string",
        ),
      );
    }
  }, []);

  useEffect(
    () => on("command:center:open", () => setOpen(true)),
    [],
  );

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();

        setOpen(
          (current) => !current,
        );

        return;
      }

      if (!open) {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();

        setSelectedIndex(
          (current) =>
            Math.min(
              current + 1,
              Math.max(
                results.length - 1,
                0,
              ),
            ),
        );

        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();

        setSelectedIndex(
          (current) =>
            Math.max(
              current - 1,
              0,
            ),
        );

        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();

        handleEnter();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  });

  useEffect(() => {
    if (!open) {
      setQuery("");
      setSelectedIndex(0);

      return;
    }

    window.setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, [open]);

  const searchResults = useMemo(() => {
    if (!query.trim()) {
      return AVAILABLE_TOOLS;
    }

    return searchTools(query);
  }, [query]);

  const recentToolObjects = useMemo(() => {
    return recentTools
      .map((id) =>
        AVAILABLE_TOOLS.find(
          (tool) => tool.id === id,
        ),
      )
      .filter(
        (
          tool,
        ): tool is (typeof AVAILABLE_TOOLS)[number] =>
          Boolean(tool),
      );
  }, [recentTools]);

  const results = useMemo(() => {
    if (query.trim()) {
      return searchResults;
    }

    const recentIds =
      new Set(recentTools);

    const remaining =
      AVAILABLE_TOOLS.filter(
        (tool) =>
          !recentIds.has(tool.id),
      );

    return [
      ...recentToolObjects,
      ...remaining,
    ];
  }, [
    query,
    searchResults,
    recentTools,
    recentToolObjects,
  ]);

  useEffect(() => {
    setSelectedIndex(
      (current) =>
        Math.min(
          Math.max(current, 0),
          Math.max(
            results.length - 1,
            0,
          ),
        ),
    );
  }, [results.length]);

  const rememberTool = useCallback(
    (toolId: string) => {
      setRecentTools((current) => {
        const updated = [
          toolId,
          ...current.filter(
            (id) => id !== toolId,
          ),
        ].slice(
          0,
          MAX_RECENT_TOOLS,
        );

        localStorageAdapter.set(
          RECENT_TOOLS_KEY,
          updated,
        );

        return updated;
      });
    },
    [],
  );

  const openTool = useCallback(
    (
      tool: (typeof AVAILABLE_TOOLS)[number],
    ) => {
      rememberTool(tool.id);

      setOpen(false);
      setQuery("");
      setSelectedIndex(0);

      router.push(tool.href);
    },
    [rememberTool, router],
  );

  function handleEnter() {
    const parsed =
      parseCommand(query);

    /*
     * Executable command.
     */
    if (
      parsed.action !==
      "search-tool"
    ) {
      const executed =
        executeCommand(
          parsed,
          router,
        );

      if (executed) {
        setOpen(false);
        setQuery("");
        setSelectedIndex(0);

        if (parsed.tool) {
          rememberTool(
            parsed.tool.id,
          );
        }

        return;
      }
    }

    /*
     * Normal tool search.
     */
    const selectedTool =
      results[selectedIndex];

    if (selectedTool) {
      openTool(selectedTool);
    }
  }

  useEffect(() => {
    if (!open) {
      return;
    }

    const element =
      document.querySelector(
        `[data-command-index="${selectedIndex}"]`,
      );

    element?.scrollIntoView({
      block: "nearest",
    });
  }, [
    selectedIndex,
    open,
  ]);

  const parsedCommand =
    useMemo(
      () =>
        query.trim()
          ? parseCommand(query)
          : null,
      [query],
    );

  const isExecutable =
    parsedCommand &&
    parsedCommand.action !==
      "search-tool" &&
    parsedCommand.action !==
      "unknown";

  return (
    <>
      {showLauncher && <button
        type="button"
        onClick={() =>
          setOpen(true)
        }
        className="
          group
          fixed
          left-1/2
          top-3
          z-[60]
          flex
          w-[calc(100%-7rem)]
          max-w-xl
          -translate-x-1/2
          items-center
          gap-3
          rounded-2xl
          border
          border-white/10
          bg-white/[0.045]
          px-4
          py-2.5
          text-left
          text-sm
          text-zinc-400
          shadow-[0_8px_30px_rgba(0,0,0,0.12)]
          backdrop-blur-xl
          transition
          hover:border-white/20
          hover:bg-white/[0.07]
          hover:text-zinc-300
          sm:w-[calc(100%-10rem)]
          md:w-[calc(100%-14rem)]
          lg:left-[calc(50%+8rem)]
          lg:w-[calc(100%-18rem)]
        "
      >
        <Search className="h-4 w-4 shrink-0" />

        <span className="flex-1">
          Search tools, utilities,
          features...
        </span>

        <span
          className="
            hidden
            items-center
            gap-1
            rounded-lg
            border
            border-white/10
            bg-black/20
            px-2
            py-1
            text-[11px]
            text-zinc-500
            sm:flex
          "
        >
          <CommandIcon className="h-3 w-3" />
          K
        </span>
      </button>}

      {open && (
        <div className="fixed inset-0 z-[100]">
          <button
            type="button"
            aria-label="Close command center"
            onClick={() =>
              setOpen(false)
            }
            className="
              absolute
              inset-0
              cursor-default
              bg-black/65
              backdrop-blur-md
            "
          />

          <div
            className="
              absolute
              left-1/2
              top-[8vh]
              w-[calc(100%-2rem)]
              max-w-3xl
              -translate-x-1/2
              overflow-hidden
              rounded-3xl
              border
              border-white/10
              bg-zinc-950/90
              shadow-[0_30px_100px_rgba(0,0,0,0.55)]
              backdrop-blur-2xl
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
                border-b
                border-white/10
                px-5
              "
            >
              <Search className="h-5 w-5 shrink-0 text-zinc-500" />

              <input
                ref={inputRef}
                autoFocus
                value={query}
                onChange={(event) => {
                  setQuery(
                    event.target.value,
                  );

                  setSelectedIndex(0);
                }}
                onKeyDown={(event) => {
                  if (
                    event.key ===
                    "Enter"
                  ) {
                    event.preventDefault();
                    handleEnter();
                  }
                }}
                placeholder="What do you want to do?"
                className="
                  h-16
                  min-w-0
                  flex-1
                  bg-transparent
                  text-base
                  text-white
                  outline-none
                  placeholder:text-zinc-600
                "
              />

              <button
                type="button"
                onClick={() =>
                  setOpen(false)
                }
                className="
                  rounded-xl
                  p-2
                  text-zinc-500
                  transition
                  hover:bg-white/10
                  hover:text-white
                "
                aria-label="Close command center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {isExecutable && (
              <div
                className="
                  border-b
                  border-white/[0.06]
                  bg-white/[0.025]
                  px-5
                  py-3
                "
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06]">
                    {parsedCommand.action ===
                    "timer" ? (
                      <Timer className="h-4 w-4 text-zinc-300" />
                    ) : (
                      <Sparkles className="h-4 w-4 text-zinc-300" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-zinc-300">
                      Executable command
                    </p>

                    <p className="truncate text-[11px] text-zinc-600">
                      Press Enter to execute
                    </p>
                  </div>

                  <CornerDownLeft className="h-4 w-4 text-zinc-600" />
                </div>
              </div>
            )}

            <div className="max-h-[60vh] overflow-y-auto p-3">
              {results.length === 0 ? (
                <div className="px-4 py-16 text-center">
                  <Search className="mx-auto mb-4 h-7 w-7 text-zinc-700" />

                  <p className="text-sm font-medium text-zinc-300">
                    No tools found
                  </p>

                  <p className="mt-1 text-xs text-zinc-600">
                    Try another search term.
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {!query.trim() &&
                    recentToolObjects.length >
                      0 && (
                      <div className="px-3 pb-2 pt-1">
                        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
                          <History className="h-3 w-3" />
                          Recent
                        </div>
                      </div>
                    )}

                  {results.map(
                    (
                      tool,
                      index,
                    ) => {
                      const Icon =
                        tool.icon;

                      const selected =
                        index ===
                        selectedIndex;

                      return (
                        <button
                          key={tool.id}
                          type="button"
                          data-command-index={
                            index
                          }
                          onMouseEnter={() =>
                            setSelectedIndex(
                              index,
                            )
                          }
                          onClick={() =>
                            openTool(
                              tool,
                            )
                          }
                          className={`
                            group
                            flex
                            w-full
                            items-center
                            gap-3
                            rounded-2xl
                            border
                            px-3
                            py-3
                            text-left
                            transition
                            ${
                              selected
                                ? "border-white/10 bg-white/[0.08]"
                                : "border-transparent hover:bg-white/[0.05]"
                            }
                          `}
                        >
                          <div
                            className={`
                              flex
                              h-11
                              w-11
                              shrink-0
                              items-center
                              justify-center
                              rounded-xl
                              border
                              ${
                                selected
                                  ? "border-white/10 bg-white/[0.08]"
                                  : "border-white/[0.06] bg-white/[0.04]"
                              }
                            `}
                          >
                            <Icon
                              className="
                                h-5
                                w-5
                                text-zinc-300
                              "
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <span
                              className={`
                                block
                                truncate
                                text-sm
                                font-medium
                                ${
                                  selected
                                    ? "text-white"
                                    : "text-zinc-300"
                                }
                              `}
                            >
                              {tool.name}
                            </span>

                            <p className="mt-0.5 truncate text-xs text-zinc-500">
                              {tool.description}
                            </p>
                          </div>

                          <span className="hidden rounded-md border border-white/[0.06] bg-black/10 px-2 py-1 text-[9px] uppercase tracking-wider text-zinc-600 sm:block">
                            {tool.category}
                          </span>

                          {selected && (
                            <CornerDownLeft className="hidden h-3.5 w-3.5 text-zinc-600 sm:block" />
                          )}
                        </button>
                      );
                    },
                  )}
                </div>
              )}
            </div>

            <div
              className="
                flex
                flex-wrap
                items-center
                justify-between
                gap-3
                border-t
                border-white/10
                px-5
                py-3
              "
            >
              <div className="flex items-center gap-3 text-[11px] text-zinc-600">
                <span>
                  {results.length} tools
                </span>

                <span className="hidden items-center gap-1 sm:flex">
                  <ArrowUp className="h-3 w-3" />
                  <ArrowDown className="h-3 w-3" />
                  navigate
                </span>

                <span className="hidden items-center gap-1 sm:flex">
                  <CornerDownLeft className="h-3 w-3" />
                  execute
                </span>
              </div>

              <span className="flex items-center gap-1 text-[11px] text-zinc-600">
                <kbd className="rounded border border-white/10 bg-white/[0.03] px-1.5 py-0.5">
                  Esc
                </kbd>
                close
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CommandPalette;
