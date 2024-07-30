import { FaSolidChevronDown } from "solid-icons/fa";
import { Accessor, createEffect, createSignal, onMount, Setter, Show } from "solid-js";
import { SetStoreFunction } from "solid-js/store";
import { SearchOptions } from "../../types";
import DatePicker, { PickerValue } from "@rnwonder/solid-date-picker";
import "@rnwonder/solid-date-picker/dist/style.css";

export interface FiltersProps {
  selectedStoryType: Accessor<string>;
  setSelectedStoryType: Setter<string>;
  sortBy: Accessor<string>;
  setSortBy: Setter<string>;
  dateRange: Accessor<string>;
  setDateRange: Setter<string>;
  searchType: Accessor<string>;
  setSearchType: Setter<string>;
  latency: Accessor<number | null>;
  setSearchOptions: SetStoreFunction<SearchOptions>;
  searchOptions: SearchOptions;
  setAuthorNames: Setter<string[]>;
  authorNames: Accessor<string[]>;
}

export default function Filters(props: FiltersProps) {
  const [open, setOpen] = createSignal(false);
  const [rangeDate, setRangeDate] = createSignal<PickerValue>({
    label: "",
    value: {},
  });

  onMount(() => {
    if (props.dateRange().startsWith("{")) {
      const date_range = JSON.parse(props.dateRange());
      setRangeDate({
        label: "Custom Range",
        value: {
          start: new Date(date_range.gt).toISOString(),
          end: new Date(date_range.lt).toISOString(),
        },
      });
    }
  });

  createEffect(() => {
    if (!props.dateRange().startsWith("{")) {
      setRangeDate({
        label: "",
        value: {
        },
      });
    }
  });

  createEffect(() => {
    if (rangeDate().value.start) {
      props.setDateRange(
        JSON.stringify({
          gt: rangeDate().value.start?.toString(),
          lt: rangeDate().value.end?.toString(),
        })
      );
    }
  });
  return (
    <div class="p-2 flex items-center gap-2">
      <div class="flex flex-wrap gap-2 text-black items-center">
        <span>Search</span>
        <div>
          <label for="stories" class="sr-only">
            Stories
          </label>
          <select
            id="stories"
            class="form-select text-zinc-600 p-1 border border-stone-300 w-fit bg-hn"
            onChange={(e) => props.setSelectedStoryType(e.currentTarget.value)}
            value={props.selectedStoryType()}
          >
            <option value="all">All</option>
            <option selected value="story">
              Stories
            </option>
            <option value="comment">Comments</option>
            <option value="ask">Ask HN</option>
            <option value="show">Show HN</option>
            <option value="job">Jobs</option>
            <option value="poll">Polls</option>
          </select>
        </div>
        <span>by</span>
        <div>
          <label for="popularity" class="sr-only">
            Popularity
          </label>
          <select
            id="popularity"
            class="form-select text-zinc-600 p-1 border border-stone-300 bg-hn"
            onChange={(e) => props.setSortBy(e.currentTarget.value)}
            value={props.sortBy()}
          >
            <option>Relevance</option>
            <option>Popularity</option>
            <option>Date</option>
          </select>
        </div>
        <span>for</span>
        <div class="flex-col">
          <label for="date-range" class="sr-only">
            Date Range
          </label>
          <DatePicker
            value={rangeDate}
            setValue={setRangeDate}
            renderInput={({ showDate }) => (
              <select
                id="date-range"
                class="form-select text-zinc-600 p-1 border border-stone-300 bg-hn"
                onClick={(e) => {
                  e.preventDefault();
                  if (e.currentTarget.value === "custom") {
                    showDate();
                  } else {
                    props.setDateRange(e.currentTarget.value);
                  }
                }}
                value={
                  props.dateRange().startsWith("{")
                    ? "custom"
                    : props.dateRange()
                }
              >
                <option value="all">All Time</option>
                <option value="last24h">Last 24h</option>
                <option value="pastWeek">Past Week</option>
                <option value="pastMonth">Past Month</option>
                <option value="pastYear">Past Year</option>
                <option value="custom">{rangeDate().value.start ? rangeDate().value.start?.replace("T07:00:00.000Z", "") + " - " + rangeDate().value.end?.replace("T07:00:00.000Z", "") : "Custom Range"}</option>
              </select>
            )}
            type="range"
          />
        </div>
        <span>with</span>
        <div>
          <select
            id="stories"
            class="form-select text-zinc-600 p-1 border border-stone-300 w-fit bg-hn"
            onChange={(e) => {
              props.setSearchType(e.currentTarget.value);
              props.setSearchOptions("rerankType", undefined);
            }}
            value={props.searchType()}
          >
            <option selected value={"hybrid"}>
              Hybrid
            </option>
            <option value={"semantic"}>Semantic</option>
            <option value={"fulltext"}>Splade</option>
            <option value={"bm25"}>BM25</option>
          </select>
        </div>
        <div class="relative">
          <button
            onClick={() => setOpen(!open())}
            class="form-select text-xs w-fit bg-hn flex items-center gap-1"
          >
            Advanced
            <FaSolidChevronDown size={10} />
          </button>
          <Show when={open()}>
            <div
              class="fixed top-1 left-0 min-h-screen w-full z-5"
              onClick={() => setOpen(false)}
            />
            <div class="absolute bg-hn flex flex-col gap-2 border border-stone-300 top-[1.85rem] p-2 z-10 right-0">
              <div class="flex items-center justify-between space-x-2 p-1 whitespace-nowrap">
                <label>Score Threshold (0.0 to 1.0):</label>
                <input
                  class="w-16 rounded border border-neutral-400 p-0.5 text-black"
                  type="number"
                  step="any"
                  value={props.searchOptions.scoreThreshold ?? 0}
                  onChange={(e) => {
                    props.setSearchOptions(
                      "scoreThreshold",
                      e.target.valueAsNumber
                    );
                  }}
                />
              </div>
              <div class="flex items-center justify-between space-x-2 p-1 whitespace-nowrap">
                <label>Prefetch Amount:</label>
                <input
                  class="w-16 rounded border border-neutral-400 p-0.5 text-black"
                  type="number"
                  step="1"
                  value={props.searchOptions.prefetchAmount ?? 0}
                  onChange={(e) => {
                    props.setSearchOptions(
                      "prefetchAmount",
                      e.target.valueAsNumber
                    );
                  }}
                />
              </div>
              <div class="flex items-center justify-between space-x-2 p-1 whitespace-nowrap">
                <label>Rerank type:</label>
                <select
                  class="rounded border border-neutral-400 p-1 bg-white text-black"
                  onChange={(e) => {
                    const newType = e.currentTarget.value;
                    props.setSearchOptions(
                      "rerankType",
                      newType === "none" ? undefined : newType
                    );
                  }}
                  value={props.searchOptions.rerankType ?? "none"}
                >
                  <option>None</option>
                  <option>Semantic</option>
                  <option>Full Text</option>
                </select>
              </div>
              <div class="flex items-center justify-between space-x-2 p-1 whitespace-nowrap">
                <label>Page size</label>
                <input
                  class="w-16 rounded border border-neutral-400 p-0.5 text-black"
                  type="number"
                  step="any"
                  value={props.searchOptions.pageSize}
                  onChange={(e) => {
                    props.setSearchOptions("pageSize", e.target.valueAsNumber);
                  }}
                />
              </div>
              <div class="flex items-center justify-between space-x-2 p-1 whitespace-nowrap">
                <label>Authors (separated by ',')</label>
                <input
                  class="w-20 rounded border border-neutral-400 p-0.5 text-black"
                  type="text"
                  step="any"
                  value={props.authorNames().join(",")}
                  onChange={(e) => {
                    if (e.target.value.length > 0) {
                      props.setAuthorNames(e.target.value.split(","));
                    } else {
                      props.setAuthorNames([]);
                    }
                  }}
                />
              </div>
              <div class="flex items-center justify-between space-x-2 p-1 whitespace-nowrap">
                <label>Highlight Delimiters (seperated by ',')</label>
                <input
                  class="w-16 rounded border border-neutral-400 p-0.5 text-black"
                  type="text"
                  step="any"
                  value={props.searchOptions.highlightDelimiters.join(",")}
                  onChange={(e) => {
                    props.setSearchOptions(
                      "highlightDelimiters",
                      e.target.value.split(",")
                    );
                  }}
                />
              </div>
              <div class="flex items-center justify-between space-x-2 p-1 whitespace-nowrap">
                <label>Highlight Threshold</label>
                <input
                  class="w-16 rounded border border-neutral-400 p-0.5 text-black"
                  type="number"
                  step="any"
                  value={props.searchOptions.highlightThreshold}
                  onChange={(e) => {
                    props.setSearchOptions(
                      "highlightThreshold",
                      e.target.valueAsNumber
                    );
                  }}
                />
              </div>
              <div class="flex items-center justify-between space-x-2 p-1 whitespace-nowrap">
                <label>Highlight Max Length</label>
                <input
                  class="w-16 rounded border border-neutral-400 p-0.5 text-black"
                  type="number"
                  step="any"
                  value={props.searchOptions.highlightMaxLength}
                  onChange={(e) => {
                    props.setSearchOptions(
                      "highlightMaxLength",
                      e.target.valueAsNumber
                    );
                  }}
                />
              </div>
              <div class="flex items-center justify-between space-x-2 p-1 whitespace-nowrap">
                <label>Highlight Max Number</label>
                <input
                  class="w-16 rounded border border-neutral-400 p-0.5 text-black"
                  type="number"
                  step="any"
                  value={props.searchOptions.highlightMaxNum}
                  onChange={(e) => {
                    props.setSearchOptions(
                      "highlightMaxNum",
                      e.target.valueAsNumber
                    );
                  }}
                />
              </div>
              <div class="flex items-center justify-between space-x-2 p-1 whitespace-nowrap">
                <label>Highlight Results (Latency Penalty)</label>
                <input
                  class="h-4 w-4"
                  type="checkbox"
                  checked={props.searchOptions.highlightResults}
                  onChange={(e) => {
                    props.setSearchOptions(
                      "highlightResults",
                      e.target.checked
                    );
                  }}
                />
              </div>
              <div class="flex items-center justify-between space-x-2 p-1 whitespace-nowrap">
                <label>Use Quote Negated Terms (Latency Penalty)</label>
                <input
                  class="h-4 w-4"
                  type="checkbox"
                  checked={props.searchOptions.useQuoteNegatedTerms}
                  onChange={(e) => {
                    props.setSearchOptions(
                      "useQuoteNegatedTerms",
                      e.target.checked
                    );
                  }}
                />
              </div>
              <div class="flex items-center justify-between space-x-2 p-1 whitespace-nowrap">
                <label>Recency bias (0.0) to (1.0)</label>
                <input
                  class="w-16 rounded border border-neutral-400 p-0.5 text-black"
                  type="number"
                  step="any"
                  value={props.searchOptions.recencyBias}
                  onChange={(e) => {
                    props.setSearchOptions(
                      "recencyBias",
                      e.target.valueAsNumber
                    );
                  }}
                />
              </div>
            </div>
          </Show>
        </div>
        <Show when={props.latency() !== null}>
          <p>({props.latency()}s)</p>
        </Show>
      </div>
    </div>
  );
}
