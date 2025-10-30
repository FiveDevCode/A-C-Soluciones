import { useEffect, useState } from "react";

const useItemsPerPage = () => {
  const [itemsPerPage, setItemsPerPage] = useState(getItemsCount());

  function getItemsCount() {
    const height = window.innerHeight;
    if (height < 600) return 5; // pantallas pequeñas
    if (height < 800) return 6; // laptops medianas
    if (height < 1000) return 8; // monitores normales
    return 10; // pantallas grandes
  }

  useEffect(() => {
    const handleResize = () => setItemsPerPage(getItemsCount());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return itemsPerPage;
};

export default useItemsPerPage;