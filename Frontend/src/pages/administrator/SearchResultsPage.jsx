import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { handleGetListVisitAd } from "../../controllers/administrator/getListVisitAd.controller";
import { handleGetListAdministrator } from "../../controllers/administrator/getAdministratorListAd.controller";
import { handleGetListTechnical } from "../../controllers/administrator/getTechnicalListAd.controller";
import { handleGetListClient } from "../../controllers/common/getListClient.controller";
import { handleGetListServiceAd } from "../../controllers/administrator/getListServiceAd.controller";
import { handleGetListRequest } from "../../controllers/administrator/getListRequestAd.controller";


const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("data")?.toLowerCase() || "";

  const [results, setResults] = useState({
    administradores: [],
    tecnicos: [],
    visitas: [],
    servicios: [],
    solicitudes: [],
    clientes: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [admins, techs, visits, clients, services, requests] = await Promise.all([
          handleGetListAdministrator(),
          handleGetListTechnical(),
          handleGetListVisitAd(),
          handleGetListClient(),
          handleGetListServiceAd(),
          handleGetListRequest()
        ]);

        const filterItems = (items, fields) =>
          items.filter(item =>
            fields.some(field =>
              (item[field] || "").toString().toLowerCase().includes(query)
            )
          );

        setResults({
          administradores: filterItems(admins.data, ["nombre", "correo"]),
          tecnicos: filterItems(techs.data, ["nombre", "correo"]),
          visitas: filterItems(visits.data.data, ["descripcion", "estado"]),
          clientes: filterItems(clients.data, ["nombre", "correo"]),
          servicios: filterItems(services.data, ["nombre", "descripcion"]),
          solicitudes: filterItems(requests.data, ["asunto", "estado"]),
        });
      } catch (err) {
        console.error("Error al buscar:", err);
      }
    };

    fetchData();
  }, [query]);

  const renderResults = (title, items) => (
    <div>
      <h3>{title} ({items.length})</h3>
      {items.length > 0 ? (
        <ul>
          {items.map((item, idx) => (
            <li key={idx}>
              {JSON.stringify(item)}
            </li>
          ))}
        </ul>
      ) : (
        <p>No se encontraron resultados.</p>
      )}
    </div>
  );

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Resultados de búsqueda para: "{query}"</h2>
      {renderResults("Administradores", results.administradores)}
      {renderResults("Técnicos", results.tecnicos)}
      {renderResults("Visitas", results.visitas)}
      {renderResults("Servicios", results.servicios)}
      {renderResults("Solicitudes", results.solicitudes)}
      {renderResults("Clientes", results.clientes)}
    </div>
  );
};

export default SearchResultsPage;
