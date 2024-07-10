import { HiSolidMagnifyingGlass } from "solid-icons/hi";
import { Accessor, Setter } from "solid-js";

export interface SearchProps {
  query: Accessor<string>;
  setQuery: Setter<string>;
  latency: Accessor<number | null>;
}

export const Search = (props: SearchProps) => {
  return (
    <div>
      <div
        class="flex justify-center items-center mx-2 p-2 rounded-md mb-5 border border-stone-300 active:border-stone-500 focus-within:border-stone-500
    "
      >
        <HiSolidMagnifyingGlass class="text-gray-500 w-5 h-5" />
        <input
          type="text"
          class="w-full bg-transparent active:outline-none focus:outline-none ml-2"
          placeholder="Search"
          value={props.query()}
          onInput={(e) => props.setQuery(e.currentTarget.value)}
        />
      </div>
      {props.latency() !== null && (
        <div class="text-center text-gray-500">
          Query Latency: {props.latency()} ms
        </div>
      )}
    </div>
  );
};
