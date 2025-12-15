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
  function handleSelectTime(time: string) {
    setBooking((prev: any) => ({
      ...prev,
      time,
    }));
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Escolha o horário</h2>

      <div className="grid grid-cols-3 gap-3">
        {times.map((time) => (
          <button
            key={time}
            onClick={() => handleSelectTime(time)}
            className={`p-3 border rounded-md transition
              ${
                booking.time === time
                  ? "border-black bg-gray-100"
                  : "border-gray-300"
              }`}
          >
            {time}
          </button>
        ))}
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          className="w-1/2 border border-black py-2 rounded-md"
        >
          Voltar
        </button>

        <button
          disabled={!booking.time}
          onClick={onNext}
          className="w-1/2 bg-black text-white py-2 rounded-md disabled:opacity-50"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default StepTime;
