const DateTimeDropdown: React.FC = () => {
  return (
    <div className="grid place-items-center">
      <p className="text-2xl font-extrabold text-slate-900">Date & Time</p>
      <div className="grid place-items-center">
        <p className="text-xl font-extrabold text-slate-900">Date</p>
        <input
          className="border-1 border border-slate-400 p-2 font-extrabold text-slate-900 outline-none"
          type="date"
        />
      </div>
      <div className="grid place-items-center">
        <p className="text-xl font-extrabold text-slate-900">Time</p>
        <input
          className="border-1 border border-slate-400 p-2 font-extrabold text-slate-900 outline-none"
          type="time"
        />
      </div>
    </div>
  );
};
