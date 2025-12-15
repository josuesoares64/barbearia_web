type Service = {
  id: number;
  name: string;
  duration: number;
};

type StepServiceProps = {
  services: Service[];
  booking: {
    service: string;
  };
  setBooking: React.Dispatch<React.SetStateAction<any>>;
  onNext: () => void;
  onBack: () => void;
};

const StepService = ({
  services,
  booking,
  setBooking,
  onNext,
  onBack,
}: StepServiceProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Escolha o serviço</h2>

      <div className="grid gap-3">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() =>
              setBooking((prev) => ({
                ...prev,
                service: service.name,
              }))
            }
            className={`p-4 border rounded-md text-left ${
              booking.service === service.name
                ? "border-black bg-gray-100"
                : "border-gray-300"
            }`}
          >
            <p className="font-semibold">{service.name}</p>
            <p className="text-sm text-gray-500">
              {service.duration} minutos
            </p>
          </button>
        ))}
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="border px-4 py-2 rounded-md">
          Voltar
        </button>

        <button
          onClick={onNext}
          disabled={!booking.service}
          className="bg-black text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default StepService;
