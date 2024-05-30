import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import './App.css';
import axios from 'axios';
import { format } from 'date-fns';

function App() {
  const { register, handleSubmit, reset, setValue } = useForm();

  const url = "http://127.0.0.1:8000/api/prestamos/";
  const [apiData, setApiData] = useState([]);
  const [usuarios, setUsuarios] = useState({});
  const [libros, setLibros] = useState({});
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    axios.get(url)
      .then(res => setApiData(res.data))
      .catch(error => console.log(error));
  }, []);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/usuarios/')
      .then(res => {
        const usuariosObj = {};
        res.data.forEach(usuario => {
          usuariosObj[usuario.id] = usuario.nombre;
        });
        setUsuarios(usuariosObj);
      })
      .catch(error => console.log(error));
  }, []);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/libros/')
      .then(res => {
        const librosObj = {};
        res.data.forEach(libro => {
          librosObj[libro.id] = libro.titulo;
        });
        setLibros(librosObj);
      })
      .catch(error => console.log(error));
  }, []);

  const onSubmit = (data) => {
    if (!edit) {
      axios.post(url, data)
        .then(res => {
          axios.get(url)
            .then(res => setApiData(res.data))
            .catch(error => console.log(error));
          reset();
        })
        .catch(error => console.log(error));
    } else {
      putApi(editId, data);
    }
  };

  const deleteApi = (id) => {
    axios.delete(`http://127.0.0.1:8000/api/prestamos/${id}`)
      .then(res => {
        console.log(res.data);
        setApiData(apiData.filter((item) => item.id !== id));
      })
      .catch(err => {
        console.log(err);
      });
  };

  const putApi = (id, data) => {
    console.log(data);
    axios.put(`http://127.0.0.1:8000/api/prestamos/${id}/`, data)
      .then(res => {
        setApiData(apiData.map(item => item.id === id ? res.data : item));
        setEdit(false);
        setEditId(null);
        reset();
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleEdit = (prestamo) => {
    setEdit(true);
    setEditId(prestamo.id);
    setValue("usuario", prestamo.usuario);
    setValue("libro", prestamo.libro);
    setValue("fec_prestamo", format(new Date(prestamo.fec_prestamo), 'yyyy-MM-dd'));
    setValue("fec_devolucion", format(new Date(prestamo.fec_devolucion), 'yyyy-MM-dd'));
  };
  

  return (
    <div className="container mt-5">
      <h2>{edit ? "Editar Préstamo" : "Crear Nuevo Préstamo"}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="usuario">Usuario</label>
          <select
            className="form-control"
            id="usuario"
            {...register("usuario", { required: true })}
          >
            <option value="">Seleccione un usuario</option>
            {Object.keys(usuarios).map(id => (
              <option key={id} value={id}>
                {usuarios[id]}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="libro">Libro</label>
          <select
            className="form-control"
            id="libro"
            {...register("libro", { required: true })}
          >
            <option value="">Seleccione un libro</option>
            {Object.keys(libros).map(id => (
              <option key={id} value={id}>
                {libros[id]}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="fec_prestamo">Fecha de Préstamo</label>
          <input
            type="date"
            className="form-control"
            id="fec_prestamo"
            {...register("fec_prestamo", { required: true })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="fec_devolucion">Fecha de Devolución</label>
          <input
            type="date"
            className="form-control"
            id="fec_devolucion"
            {...register("fec_devolucion", { required: true })}
          />
        </div>
        <button type="submit" className="btn btn-primary">{edit ? "Editar Prestamo" : "Crear Prestamo"}</button>
      </form>
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Ejemplar</th>
            <th scope="col">Libro</th>
            <th scope="col">Cliente</th>
            <th scope="col">Inicio</th>
            <th scope="col">Fin</th>
            <th scope="col">Editar</th>
            <th scope="col">Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {apiData?.map((x, index) => (
            <tr key={x.id}>
              <td>{index + 1}</td>
              <td>{x.id}</td>
              <td>{libros[x.libro]}</td>
              <td>{usuarios[x.usuario]}</td>
              <td>{format(new Date(x.fec_prestamo), 'dd/MM/yyyy')}</td>
              <td>{format(new Date(x.fec_devolucion), 'dd/MM/yyyy')}</td>
              <td>
                <button onClick={() => handleEdit(x)} className="btn btn-primary">Editar</button>
              </td>
              <td>
                <button onClick={() => deleteApi(x.id)} className="btn btn-secondary">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
