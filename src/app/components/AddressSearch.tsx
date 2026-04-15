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
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
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

  // Atualiza o input se o valor externo mudar (ex: ao carregar dados do banco)
  useEffect(() => {
    setQuery(value);
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
    }, 500); // espera 500ms depois que o usuário parar de digitar
  };

  const handleSelect = (suggestion: Suggestion) => {
    const endereco = suggestion.display_name;

    // Monta a URL do iframe do OpenStreetMap com as coordenadas
    const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
      parseFloat(suggestion.lon) - 0.005
    },${
      parseFloat(suggestion.lat) - 0.005
    },${
      parseFloat(suggestion.lon) + 0.005
    },${
      parseFloat(suggestion.lat) + 0.005
    }&layer=mapnik&marker=${suggestion.lat},${suggestion.lon}`;

    setQuery(endereco);
    setSuggestions([]);
    setOpen(false);
    onChange(endereco, embedUrl); // devolve os dois valores pro componente pai
  };

  return (
    <div ref={wrapperRef} className="relative space-y-1">
      <label className="text-[9px] text-zinc-400 uppercase font-black">
        Endereço da Barbearia
      </label>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            buscarSugestoes(e.target.value);
          }}
          placeholder="Ex: Rua das Flores, 123, Fortaleza"
          className="w-full bg-black border border-zinc-800 p-3 text-xs text-white rounded-lg outline-none focus:border-amber-500 pr-8"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-3 h-3 border border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

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

      {/* Preview do endereço selecionado */}
      {query && !open && (
        <p className="text-[10px] text-zinc-500 pt-1">
          📍 {query}
        </p>
      )}
    </div>
  );
}