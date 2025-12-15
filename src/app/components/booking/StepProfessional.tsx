type Professional = {
  id: number;
  name: string;
};

type StepProfessionalProps = {
  professionals: Professional[];
  booking: {
    professional: string;
  };
  setBooking: React.Dispatch<React.SetStateAction<any>>;
  onNext: () => void;
  onBack: () => void;
};

const StepProfessional = ({
  professionals,
  booking,
  setBooking,
  onNext,
  onBack,
}: StepProfessionalProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Escolha o profissional</h2>

      <div className="grid gap-3">
        {professionals.map((pro) => (
          <button
            key={pro.id}
            onClick={() =>
              setBooking((prev) => ({
                ...prev,
                professional: pro.name,
              }))
            }
            className={`p-4 border rounded-md text-left ${
              booking.professional === pro.name
                ? "border-black bg-gray-100"
                : "border-gray-300"
            }`}
          >
            {pro.name}
          </button>
        ))}
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="border px-4 py-2 rounded-md">
          Voltar
        </button>

        <button
          onClick={onNext}
          disabled={!booking.professional}
          className="bg-black text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default StepProfessional;
