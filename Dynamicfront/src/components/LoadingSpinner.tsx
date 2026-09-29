const LoadingSpinner = ({ text = "Loading..." }: { text?: string }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    <p className="text-gray-400 text-sm mt-4">{text}</p>
  </div>
);

export default LoadingSpinner;
