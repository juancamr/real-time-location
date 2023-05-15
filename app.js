const express = require("express");
const Especialista = require("./especialista");
const firebaseDatabase = require("./firebaseDatabase");

const app = express();

app.post("/especialistas/:id/ubicacion", (req, res) => {
  const idEspecialista = req.params.id;
  const ubicacion = req.body.ubicacion;

  const especialistaRef = firebaseDatabase.ref(
    `especialistas/${idEspecialista}`
  );
  especialistaRef
    .update({ ubicacion })
    .then(() => {
      res.status(200).send("Se ha actualizado la ubicacion del especialista");
    })
    .catch((err) => {
      res.status(500).send("Error al actualizar especialista");
    });
});

app.get("/especialistas/cercanos", (req, res) => {
  const coordenadasCliente = [req.query.latitud, req.query.longitud];

  buscarEspecialistasCercanos(coordenadasCliente).then((especialistas) => {
    const especialistasIds = especialistas.map(
      (especialista) => especialista._id
    );
    const especialistasRef = firebaseDatabase.ref("especialistas");
    especialistasRef.once('value').then(snapshot => {
        const especialistasUbicacionActual = [];
        snapshot.forEach(especialistaSnapshot => {
            const especialistaId = especialistaSnapshot.key;
            const especialista = especialistas.find(especialista => especialista._id === especialistaId);
            if (especialista) {
                const ubicacion = especialistaSnapshot.val().ubicacion;
                especialistasUbicacionActual.push({...especialista.toObject(), ubicacion});
            }
        })
    });
    res.json(especialistasUbicacionActual);
  }).catch((error) => {
    res.status(500).send("Error al buscar las ubicaciones del cliente");
  })
});

const especialistasRef = firebaseDatabase.ref("especialistas");
especialistasRef.on("child_changed", (snapshot) => {
  const especialistaId = snapshot.id;
  const ubicacion = snapshot.val().ubicacion;

  Especialista.findByIdAndUpdate(especialistaId, { ubicacion }, { new: true })
    .then((especialista) => {
      console.log(
        `Ubicacion actualizada para el especialista ${especialistaId}`
      );
    })
    .catch((err) => {
      console.log(
        `Error al actualizar la ubicacion del especialista ${especialistaId}`
      );
    });
});

function buscarEspecialistasCercanos(coordenadasCliente) {
  const maxDistancia = 10;

  return Especialista.find({
    ubicacion: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: coordenadasCliente,
        },
        $maxDistance: maxDistancia,
      },
    },
  });
}

app.listen(3000, () => {
  console.log("Servidor corriendo en el puerto 3000");
});
