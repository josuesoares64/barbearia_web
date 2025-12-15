type Professional = {
  id: number;
  name: string;
};

type Booking = {
  professional: string;
};

type StepProfessionalProps = {
  professionals: Professional[];
  booking: Booking;
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
  function handleSelectProfessional(name: string) {
    setBooking((prev: any) => ({
      ...prev,
      professional: name,
    }));
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Escolha o profissional</h2>

      <div className="grid gap-3">
        {professionals.map((professional) => (
          <button
            key={professional.id}
            onClick={() => handleSelectProfessional(professional.name)}
            className={`p-4 border rounded-md text-left transition
              ${
                booking.professional === professional.name
                  ? "border-black bg-gray-100"
                  : "border-gray-300"
              }`}
          >
            {professional.name}
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
          disabled={!booking.professional}
          onClick={onNext}
          className="w-1/2 bg-black text-white py-2 rounded-md disabled:opacity-50"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default StepProfessional;
