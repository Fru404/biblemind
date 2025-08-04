import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
      <main className="flex-grow ">
        <h1 className="text-4xl font-bold text-blue-600">biblemind</h1>
      </main>

      <footer className="p-4 text-center text-sm text-gray-500">
        BibleMind. All rights reserved.
      </footer>
    </div>
  );
}
