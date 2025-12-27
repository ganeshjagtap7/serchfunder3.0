export default function LeftSidebar() {
  return (
    <div className="hidden md:block md:col-span-3 lg:col-span-2 space-y-2 sticky top-24 h-fit">
      <a
        className="flex items-center gap-3 px-4 py-3 text-[#0d121b] hover:bg-gray-100 rounded-xl transition-colors"
        href="/posts/saved"
      >
        <span className="material-symbols-outlined text-xl">bookmark_border</span>
        <span className="font-medium">All Saved</span>
      </a>
      <a
        className="flex items-center gap-3 px-4 py-3 text-[#0d121b] hover:bg-gray-100 rounded-xl transition-colors"
        href="#"
      >
        <span className="material-symbols-outlined text-xl">folder_open</span>
        <span className="font-medium">Collections</span>
      </a>
      <a
        className="flex items-center gap-3 px-4 py-3 text-[#0d121b] hover:bg-gray-100 rounded-xl transition-colors"
        href="#"
      >
        <span className="material-symbols-outlined text-xl">history</span>
        <span className="font-medium">History</span>
      </a>
    </div>
  );
}
