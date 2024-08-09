/* eslint-disable @typescript-eslint/no-empty-object-type */
import { cva, cx, VariantProps } from "cva";
import { For, JSX, Show, splitProps } from "solid-js";

import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...args: ClassValue[]) {
  return twMerge(clsx(...args));
}

type TRenderFunction<D> = (item: D) => JSX.Element;

interface TableProps<D> extends VariantProps<typeof table> {
  data: D[];
  children: TRenderFunction<D>;
  // Will show if data is an empty array
  fallback?: JSX.Element;
  headers?: JSX.Element;
  class?: string;
  headerClass?: string;
}

const table = cva(["w-full"], {
  variants: {
    spacing: {},
    debug: {
      true: "debug",
      false: "undefined",
    },
    fixed: {
      true: "table-fixed",
      false: "undefined",
    },
  },
  defaultVariants: {
    debug: false,
    fixed: false,
  },
});

export const td = cva([], {
  variants: {
    spacing: {
      md: ["p-1", "px-2"],
    },
    border: {
      none: undefined,
      subtle: ["border-neutral-200"],
      strong: ["border-neutral-400"],
    },
    borderStyle: {
      both: ["border"],
      horizontal: ["border-t", "border-b", "border-l-0", "border-r-0"],
    },
    fullWidth: {
      true: ["w-full"],
      false: [],
    },
  },
  defaultVariants: {
    border: "subtle",
    spacing: "md",
    borderStyle: "horizontal",
    fullWidth: false,
  },
});

export const th = cva(
  ["text-left", "bg-neutral-200", "border border-b-neutral-300"],
  {
    variants: {
      spacing: {
        md: ["p-1", "px-2"],
      },
    },
    defaultVariants: {
      spacing: "md",
    },
  },
);

export const Table = <D,>(props: TableProps<D>) => {
  return (
    <Show when={props.data.length != 0} fallback={props.fallback}>
      <table class={table({ ...props, class: props.class })}>
        {props.headers}
        <tbody>
          <For each={props.data}>{props.children}</For>
        </tbody>
      </table>
    </Show>
  );
};

interface TrProps extends JSX.HTMLAttributes<HTMLTableRowElement> {}
export const Tr = (props: TrProps) => {
  return (
    <tr class={cn("odd:bg-neutral-100 even:bg-white", props.class)} {...props}>
      {props.children}
    </tr>
  );
};

type ExtraTdProps = VariantProps<typeof td> &
  JSX.HTMLAttributes<HTMLTableCellElement>;

interface TdProps extends ExtraTdProps {
  children?: JSX.Element;
  class?: string;
}

export const Td = (props: TdProps) => {
  const [className, styleProps, rest] = splitProps(
    props,
    ["class"],
    ["spacing", "border", "borderStyle", "fullWidth"],
  );

  return (
    <td {...rest} class={td({ ...styleProps, class: className.class })}>
      {rest.children}
    </td>
  );
};

type ExtraThProps = VariantProps<typeof th> &
  JSX.HTMLAttributes<HTMLTableCellElement>;

interface ThProps extends ExtraThProps {
  children?: JSX.Element;
  class?: string;
}

export const Th = (props: ThProps) => {
  const [className, styleProps, rest] = splitProps(
    props,
    ["class"],
    ["spacing"],
  );

  return (
    <th
      {...rest}
      class={cx(th({ ...styleProps }), "font-semibold", className.class)}
    >
      {rest.children}
    </th>
  );
};
