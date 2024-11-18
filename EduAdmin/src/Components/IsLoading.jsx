export default function IsLoading() {
  return (
    <div className="flex items-center justify-center h-full absolute top-0 left-0 w-full z-[300]">
      <div className="flex flex-col items-center space-x-2">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-lg font-semibold text-gray-700">Loading...</span>
      </div>
    </div>
  );
}
