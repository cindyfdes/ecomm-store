export const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div
        className="h-12 w-12 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent"
        role="status"
      ></div>
    </div>
  );
};
