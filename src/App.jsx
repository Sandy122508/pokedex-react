import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1010');
      const data = await res.json();
      const detailed = await Promise.all(
        data.results.map(async (p) => {
          const r = await fetch(p.url);
          return await r.json();
        })
      );
      setPokemonList(detailed);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filtered = pokemonList.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <h1 className="title">POKÉDEX</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search Pokemon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading? (
        <h2 className="loading">Loading...</h2>
      ) : (
        <div className="pokemon-grid">
          {filtered.map((p) => (
            <div key={p.id} className="pokemon-card" onClick={() => setSelectedPokemon(p)}>
              <img src={p.sprites.other["official-artwork"].front_default} alt={p.name} />
              <h3>#{String(p.id).padStart(3,"0")}</h3>
              <h2>{p.name}</h2>
              <div className="types">
                {p.types.map((t) => (
                  <span key={t.type.name} className={`type ${t.type.name}`}>
                    {t.type.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedPokemon && (
        <div className="modal-overlay" onClick={() => setSelectedPokemon(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedPokemon(null)}>X</button>
            <img src={selectedPokemon.sprites.other["official-artwork"].front_default} alt="" />
            <h1>{selectedPokemon.name}</h1>
            <p>Height: {selectedPokemon.height} | Weight: {selectedPokemon.weight}</p>
            <div className="stats">
              {selectedPokemon.stats.map(s => (
                <p key={s.stat.name}>{s.stat.name}: {s.base_stat}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;