type StepSummaryProps = {
  booking: {
    date: string;
    time: string;
    service: string;
    professional: string;
    name: string;
    phone: string;
  };
  onBack: () => void;
  onConfirm: () => void;
};

const StepSummary = ({ booking, onBack, onConfirm }: StepSummaryProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Resumo do agendamento</h2>

      <div className="space-y-2 text-sm">
        <p>
          <strong>Data:</strong> {booking.date}
        </p>
        <p>
          <strong>Horário:</strong> {booking.time}
        </p>
        <p>
          <strong>Serviço:</strong> {booking.service}
        </p>
        <p>
          <strong>Profissional:</strong> {booking.professional}
        </p>
        <p>
          <strong>Cliente:</strong> {booking.name}
        </p>
        <p>
          <strong>Telefone:</strong> {booking.phone}
        </p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="w-1/2 border px-4 py-2 rounded-md"
        >
          Voltar
        </button>

        <button
          onClick={onConfirm}
          className="w-1/2 bg-black text-white px-4 py-2 rounded-md"
        >
          Confirmar agendamento
        </button>
      </div>
    </div>
  );
};

export default StepSummary;
