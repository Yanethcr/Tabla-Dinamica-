import { Usuario } from "../types/usuario";
import { useState } from "react";

interface Props {
    usuarios: Usuario[];
    onEliminar: (id: number) => void;
}

export default function TablaBasic({ usuarios, onEliminar }: Props) {

    const [busqueda, setBusqueda] = useState("");
    const [modoOscuro, setModoOscuro] = useState(false);
    const [ordenColumna, setOrdenColumna] = useState<string | null>(null);
    const [ordenDireccion, setOrdenDireccion] = useState<"asc" | "desc">("asc");
    const [paginaActual, setPaginaActual] = useState<number>(1);

    const elemPaginas = 10;

    const usuariosFiltrados = usuarios.filter(usuario =>
        usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        usuario.correo.toLowerCase().includes(busqueda.toLowerCase())
    );

    const handleOrden = (columna: string) => {
        if (ordenColumna === columna) {
            setOrdenDireccion(prev => prev === "asc" ? "desc" : "asc");
        } else {
            setOrdenColumna(columna);
            setOrdenDireccion("asc");
        }
    };

    const usuariosOrdenados = [...usuariosFiltrados].sort((a, b) => {
        if (!ordenColumna) return 0;
        const valA = String(a[ordenColumna as keyof Usuario]).toLowerCase();
        const valB = String(b[ordenColumna as keyof Usuario]).toLowerCase();
        if (valA < valB) return ordenDireccion === "asc" ? -1 : 1;
        if (valA > valB) return ordenDireccion === "asc" ? 1 : -1;
        return 0;
    });

    const totalPaginas = Math.ceil(usuariosFiltrados.length / elemPaginas);
    const inicio = (paginaActual - 1) * elemPaginas;
    const fin = inicio + elemPaginas;
    const usupPagina = usuariosOrdenados.slice(inicio, fin);

    const tdClase = `border px-3 py-2 text-center ${modoOscuro ? "border-gray-600" : "border-gray-300"}`;

    return (
        <div className={`relative flex flex-col items-center min-h-screen p-8 transition duration-300 ${modoOscuro ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>

            {/* Botón modo oscuro */}
            <button
                onClick={() => setModoOscuro(prev => !prev)}
                className={`absolute top-4 left-4 px-4 py-2 rounded-full transition duration-150 ease-in-out hover:-translate-y-1 hover:shadow-lg ${modoOscuro ? "bg-yellow-400 text-gray-900" : "bg-gray-800 text-white"}`}
            >
                {modoOscuro ? "☀️ Modo Claro" : "🌙 Modo Oscuro"}
            </button>

            {/* Buscador */}
            <input
                type="text"
                placeholder="Buscar..."
                className={`border-2 p-2 mb-4 w-80 rounded-full outline-none transition duration-150 ease-in-out ${modoOscuro ? "bg-gray-700/50 border-purple-400 text-white placeholder-gray-400" : "bg-purple-100/50 border-purple-500 text-gray-900"}`}
                value={busqueda}
                onChange={(e) => {
                    setBusqueda(e.target.value);
                    setPaginaActual(1);
                }}
            />

            {/* Tabla */}
            <table className="border-collapse rounded-lg overflow-hidden w-full max-w-4xl shadow-md">
                <thead>
                    <tr className={modoOscuro ? "bg-violet-800 text-white" : "bg-violet-300"}>
                        {[
                            { label: "Nombre", key: "nombre" },
                            { label: "Correo", key: "correo" },
                            { label: "Rol_Sistema", key: "rolSistema" },
                            { label: "Fecha_Registro", key: "fechaRegistro" },
                            { label: "Acciones", key: "acciones" },
                        ].map(({ label, key }) => (
                            <th
                                key={key}
                                onClick={() => handleOrden(key)}
                                className="cursor-pointer select-none px-3 py-2"
                            >
                                {label} {ordenColumna === key ? (ordenDireccion === "asc" ? "▲" : "▼") : ""}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {usupPagina.map(usuario => (
                        <tr key={usuario.id} className={modoOscuro ? "bg-gray-800 hover:bg-gray-700" : "hover:bg-gray-50"}>
                            <td className={tdClase}>{usuario.nombre}</td>
                            <td className={tdClase}>{usuario.correo}</td>
                            <td className={tdClase}>{usuario.rolSistema}</td>
                            <td className={tdClase}>{usuario.fechaRegistro}</td>
                            <td className={tdClase}>
                                <button
                                    onClick={() => {
                                        if (confirm(`¿Estás seguro de eliminar a ${usuario.nombre}?`)) {
                                            onEliminar(usuario.id);
                                        }
                                    }}
                                    className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded transition duration-150 ease-in-out hover:-translate-y-1 hover:shadow-lg"
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Botones paginación */}
            <div className="flex justify-center gap-2 mt-4">
                <button
                    onClick={() => setPaginaActual(prev => Math.max(1, prev - 1))}
                    disabled={paginaActual === 1}
                    className={paginaActual === 1
                        ? "opacity-50 cursor-not-allowed bg-gray-300 px-3 py-1 rounded transition duration-150 ease-in-out"
                        : "bg-violet-400 hover:bg-violet-600 text-white px-3 py-1 rounded transition duration-150 ease-in-out hover:-translate-y-1 hover:shadow-lg"
                    }
                >Anterior</button>

                {[...Array(totalPaginas)].map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setPaginaActual(index + 1)}
                        className={paginaActual === index + 1
                            ? "bg-violet-600 text-white px-3 py-1 rounded transition duration-150 ease-in-out"
                            : "bg-violet-400 hover:bg-violet-600 text-white px-3 py-1 rounded transition duration-150 ease-in-out hover:-translate-y-1 hover:shadow-lg"
                        }
                    >{index + 1}</button>
                ))}

                <button
                    onClick={() => setPaginaActual(prev => Math.min(totalPaginas, prev + 1))}
                    disabled={paginaActual === totalPaginas}
                    className={paginaActual === totalPaginas
                        ? "opacity-50 cursor-not-allowed bg-gray-300 px-3 py-1 rounded transition duration-150 ease-in-out"
                        : "bg-violet-400 hover:bg-violet-600 text-white px-3 py-1 rounded transition duration-150 ease-in-out hover:-translate-y-1 hover:shadow-lg"
                    }
                >Siguiente</button>
            </div>

        </div>
    );
}