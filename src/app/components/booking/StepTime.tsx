type StepTimeProps = {
  times: string[];
  booking: {
    time: string;
  };
  setBooking: React.Dispatch<React.SetStateAction<any>>;
  onNext: () => void;
  onBack: () => void;
};

const StepTime = ({
  times,
  booking,
  setBooking,
  onNext,
  onBack,
}: StepTimeProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Escolha o horário</h2>

      <div className="grid grid-cols-3 gap-3">
        {times.map((time) => (
          <button
            key={time}
            onClick={() =>
              setBooking((prev) => ({
                ...prev,
                time,
              }))
            }
            className={`p-3 border rounded-md ${
              booking.time === time
                ? "border-black bg-gray-100"
                : "border-gray-300"
            }`}
          >
            {time}
          </button>
        ))}
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="border px-4 py-2 rounded-md">
          Voltar
        </button>

        <button
          onClick={onNext}
          disabled={!booking.time}
          className="bg-black text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default StepTime;
