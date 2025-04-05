import { useState, useEffect } from "react";
import { db } from "./firebaseConfig"; // Archivo de configuración de Firebase
import { collection, addDoc, query, orderBy, limit, getDocs } from "firebase/firestore";


export default function Formulario() {
  const [formData, setFormData] = useState({
    folio: "",
    fecha: "",
    cliente: "",
    vehiculo: "",
    eco: "",
    placa: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const obtenerUltimoFolio = async () => {
    try {
      const registrosRef = collection(db, "registros");
      const q = query(registrosRef, orderBy("folio", "desc"), limit(1));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const ultimo = querySnapshot.docs[0].data();
        const nuevoFolio = parseInt(ultimo.folio, 10) + 1;
        setFormData((prev) => ({ ...prev, folio: nuevoFolio.toString() }));
      } else {
        setFormData((prev) => ({ ...prev, folio: "1" }));
      }
    } catch (error) {
      console.error("Error al obtener el último folio:", error);
    }
  };

  useEffect(() => {
    obtenerUltimoFolio();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
        console.log("Enviando datos:", formData);
        // Enviar datos a la API
        const response = await fetch("/api/GenerarPDF", {
        method: "POST",
        headers: { "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error("Error al enviar datos a la API");

        // Convertir respuesta a blob y abrir PDF
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        // Asignar nombre al documento usando folio y placa
        const fileName = `${formData.folio}-${formData.placa}.pdf`;
        
        // Crear un enlace para descargar el PDF automáticamente
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Guardar en Firebase Firestore
        await addDoc(collection(db, "registros"), formData);
        alert("Datos guardados correctamente");

        // Limpiar campos excepto el folio, que debe aumentar
        setFormData({ folio: "", fecha: "", cliente: "", vehiculo: "", eco: "", placa: "" });
        await obtenerUltimoFolio();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header">
          <h2>Registro de Datos</h2>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            {Object.keys(formData).map((key) => (
              <div className="mb-3" key={key}>
                <label className="form-label">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                <input
                  type={key === "fecha" ? "date" : "text"}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="form-control text-center"
                  required
                  readOnly={key === "folio"}
                />
              </div>
            ))}
            <button
              type="submit"
              className="btn btn-success w-100"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
