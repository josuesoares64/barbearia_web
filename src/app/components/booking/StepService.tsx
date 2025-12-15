type Service = {
  id: number;
  name: string;
  duration: number;
};

type Booking = {
  service: string;
};

type StepServiceProps = {
  services: Service[];
  booking: Booking;
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
  function handleSelectService(serviceName: string) {
    setBooking((prev: any) => ({
      ...prev,
      service: serviceName,
    }));
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Escolha o serviço</h2>

      <div className="grid gap-3">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => handleSelectService(service.name)}
            className={`p-4 border rounded-md text-left transition
              ${
                booking.service === service.name
                  ? "border-black bg-gray-100"
                  : "border-gray-300"
              }`}
          >
            <p className="font-semibold">{service.name}</p>
            <p className="text-sm text-gray-500">
              Duração: {service.duration} minutos
            </p>
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
          disabled={!booking.service}
          onClick={onNext}
          className="w-1/2 bg-black text-white py-2 rounded-md disabled:opacity-50"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default StepService;
