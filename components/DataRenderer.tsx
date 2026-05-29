import React from "react";

type DataRendererProps<T> = {
  success: boolean;
  data: T[];
  errorMessage?: string;
  render: (data: T[]) => React.ReactNode;
};

function DataRenderer<T>({
  success,
  data,
  errorMessage,
  render,
}: DataRendererProps<T>) {
  if (!success) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <h3 className="text-lg font-semibold text-white mb-2">
          Oops! Something went wrong
        </h3>

        <p className="text-gray-600 text-center max-w-md">
          {errorMessage ||
            "We encountered an unexpected error. Please try again later."}
        </p>
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <h3 className="text-lg font-semibold text-white mb-2">
          No results found
        </h3>

        <p className="text-gray-600 text-center max-w-md">
          We couldn't find any data matching your criteria.
        </p>
      </div>
    );
  }

  return <div>{render(data)}</div>;
}

export default DataRenderer;
