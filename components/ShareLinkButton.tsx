export default function ShareLinkButton() {
  const handleClick = () => {
    console.log("Clicked!");
  };

  return (
    <button
      className="border px-2 py-1 rounded text-slate-500 text-sm hover:bg-orange-100 hover:text-slate-700"
      onClick={handleClick}
    >
      Share Link
    </button>
  );
}
