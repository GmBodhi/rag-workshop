import { ReactNode } from "react";

export default function Slide({
  children,
  title = "sdfjkhsdfkjh",
  subtitle = "adasdkjdhsjasdhjadshkjh",
}: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="w-full h-screen bg-transparent p-12 flex flex-col">
      {/* Header section */}
      <header className="mb-8">
        {title && (
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
        )}
        {subtitle && <h2 className="text-2xl text-gray-700">{subtitle}</h2>}
      </header>

      {/* Main content area */}
      <main className="flex-1 text-xl text-gray-800">{children}</main>
    </div>
  );
}
