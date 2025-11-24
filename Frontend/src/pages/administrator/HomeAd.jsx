import { Divider } from "@mui/material";
import CategoryRecomendAd from "../../components/administrator/CategoryRecomendAd";
import styled from "styled-components";
import ActivityFilterAd from "../../components/administrator/ActivityFilterAd";
import ActivityListAd from "../../components/administrator/ActivityListAd";
import { useEffect, useState } from "react";
import { handleGetListRequest } from "../../controllers/administrator/getListRequestAd.controller";



const ContainerHome = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`
const HomeAd = () => {

  const [requests, setRequests] = useState({})

  useEffect(() => {
      handleGetListRequest().then((res) => {
        setRequests(res.data)
      }).catch((err) => {
        console.log("No se pudo obtener el listado de solicitudes", err)
      })


  }, [])



  return (
    <ContainerHome>
      <CategoryRecomendAd />
      <Divider />
      <ActivityFilterAd />
      {requests.length === 0 ? (
        <p style={{textAlign: "center"}}>No tienes ninguna solicitud asignada por el momento.</p>
      ) : (
        <ActivityListAd requests={requests} />
      )}

    </ContainerHome>
  )
}


export default HomeAd;