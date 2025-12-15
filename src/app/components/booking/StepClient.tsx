type StepClientProps = {
  booking: {
    name: string;
    phone: string;
  };
  setBooking: React.Dispatch<React.SetStateAction<any>>;
  onBack: () => void;
  onFinish: () => void;
};

const StepClient = ({
  booking,
  setBooking,
  onBack,
  onFinish,
}: StepClientProps) => {
  // Atualiza o nome conforme o usuário digita
  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setBooking((prev) => ({
      ...prev,
      name: e.target.value,
    }));
  }

  // Atualiza o telefone conforme o usuário digita
  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    setBooking((prev) => ({
      ...prev,
      phone: e.target.value,
    }));
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Seus dados</h2>

      {/* Campo Nome */}
      <input
        type="text"
        placeholder="Seu nome"
        value={booking.name}
        onChange={handleNameChange}
        className="w-full border p-2 rounded-md"
      />

      {/* Campo Telefone */}
      <input
        type="tel"
        placeholder="Telefone / WhatsApp"
        value={booking.phone}
        onChange={handlePhoneChange}
        className="w-full border p-2 rounded-md"
      />

      {/* Botões */}
      <div className="flex justify-between gap-4">
        <button
          onClick={onBack}
          className="w-1/2 border px-4 py-2 rounded-md"
        >
          Voltar
        </button>

        <button
          onClick={onFinish}
          disabled={!booking.name || !booking.phone}
          className="w-1/2 bg-black text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          Finalizar agendamento
        </button>
      </div>
    </div>
  );
};

export default StepClient;
