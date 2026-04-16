"use client";
import { useState, useEffect, useRef } from "react";

interface Suggestion {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
}

interface Props {
  value: string;
  onChange: (endereco: string, embedUrl: string) => void;
}

export function AddressSearch({ value, onChange }: Props) {
  const [query, setQuery] = useState("");
  const [numero, setNumero] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Fecha a lista se clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Quando o valor externo muda (carregando do banco), separa rua e número
  useEffect(() => {
    if (!value) return;
    // Tenta separar o número se vier no formato "Rua X, 123 — ..."
    const matchNumero = value.match(/,\s*(\d+[A-Za-z]?)\s*[,—]/);
    if (matchNumero) {
      setNumero(matchNumero[1]);
    }
    // Mostra só a parte principal no input de busca
    setQuery(value.split(",")[0] || value);
  }, [value]);

  const buscarSugestoes = (texto: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (texto.length < 4) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(texto)}&limit=5&addressdetails=1`,
          { headers: { "Accept-Language": "pt-BR" } }
        );
        const data: Suggestion[] = await res.json();
        setSuggestions(data);
        setOpen(data.length > 0);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  // Monta o endereço final com número e dispara onChange
  const montarEndereco = (suggestion: Suggestion, num: string) => {
    const partes = suggestion.display_name.split(",");
    // Pega as 3 primeiras partes (rua, bairro, cidade) pra não ficar gigante
    const enderecoBase = partes.slice(0, 3).join(",").trim();
    const enderecoFinal = num
      ? `${enderecoBase}, ${num}`
      : enderecoBase;

    const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
      parseFloat(suggestion.lon) - 0.005
    },${
      parseFloat(suggestion.lat) - 0.005
    },${
      parseFloat(suggestion.lon) + 0.005
    },${
      parseFloat(suggestion.lat) + 0.005
    }&layer=mapnik&marker=${suggestion.lat},${suggestion.lon}`;

    onChange(enderecoFinal, embedUrl);
  };

  const handleSelect = (suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion);
    setQuery(suggestion.display_name.split(",")[0]); // mostra só a rua no input
    setSuggestions([]);
    setOpen(false);
    montarEndereco(suggestion, numero);
  };

  const handleNumeroChange = (num: string) => {
    setNumero(num);
    if (selectedSuggestion) {
      montarEndereco(selectedSuggestion, num);
    }
  };

  return (
    <div ref={wrapperRef} className="space-y-2">
      <label className="text-[9px] text-zinc-400 uppercase font-black">
        Endereço da Barbearia
      </label>

      {/* Campo de busca */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedSuggestion(null);
            buscarSugestoes(e.target.value);
          }}
          placeholder="Ex: Rua das Flores, Fortaleza"
          className="w-full bg-black border border-zinc-800 p-3 text-xs text-white rounded-lg outline-none focus:border-amber-500 pr-8"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-3 h-3 border border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Lista de sugestões */}
        {open && suggestions.length > 0 && (
          <ul className="absolute z-50 w-full bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden shadow-xl mt-1">
            {suggestions.map((s) => (
              <li
                key={s.place_id}
                onClick={() => handleSelect(s)}
                className="px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white cursor-pointer border-b border-zinc-800 last:border-0 transition-colors"
              >
                {s.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Campo de número — só aparece depois de selecionar uma rua */}
      {selectedSuggestion && (
        <input
          type="text"
          value={numero}
          onChange={(e) => handleNumeroChange(e.target.value)}
          placeholder="Número (ex: 123, S/N)"
          className="w-full bg-black border border-zinc-800 p-3 text-xs text-white rounded-lg outline-none focus:border-amber-500"
        />
      )}

      {/* Preview do endereço final */}
      {value && !open && (
        <p className="text-[10px] text-zinc-500 pt-1">
          📍 {value}
        </p>
      )}
    </div>
  );
}