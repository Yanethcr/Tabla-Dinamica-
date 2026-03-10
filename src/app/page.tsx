'use client';

import dynamic from "next/dynamic";
import { useState } from "react";
import { datos } from "@/data/usuarioData";
import { Usuario } from "@/types/usuario";

const TableBasic = dynamic(() => import("@/componentes/tablaBasic"), {
  ssr: false,
  loading: () => <div>Cargando tabla...</div>
});

export default function Home() {

  const [listaUsuarios, setListaUsuarios] = useState<Usuario[]>(datos);

  const handleEliminar = (id: number) => {
    setListaUsuarios(prev => prev.filter(u => u.id !== id));
  };

  return (
    <>
      <TableBasic usuarios={listaUsuarios} onEliminar={handleEliminar} />
    </>
  );
}