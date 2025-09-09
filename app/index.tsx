import { Text, View, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { useState, useEffect } from "react";
import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { Ionicons } from '@expo/vector-icons';
import { servicioTareas } from '../servicios/servicioTareas';
import ModalNuevaTarea from '../componentes/ModalNuevaTarea';

interface Tarea {
  id: string;
  titulo: string;
  completada: boolean;
  pasos: any[];
}

export default function MisTareas() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      cargarTareas();
    }, [])
  );

  const cargarTareas = async () => {
    const tareasGuardadas = await servicioTareas.obtenerTareas();
    setTareas(tareasGuardadas);
  };

  const guardarTarea = async (titulo: string) => {
    const nuevaTarea = await servicioTareas.crearTarea(titulo);
    setTareas(prev => [nuevaTarea, ...prev]);
    setModalVisible(false);
  };

  const alternarCompletada = async (id: string) => {
    const tareaActualizada = await servicioTareas.alternarCompletada(id);
    setTareas(prev => prev.map(tarea => 
      tarea.id === id ? tareaActualizada : tarea
    ));
  };

  const abrirDetalle = (tareaId: string) => {
    router.push(`/detalle-tarea?tareaId=${tareaId}`);
  };

  const renderizarTarea = ({ item }: { item: Tarea }) => (
    <View style={[estilos.itemTarea, item.completada && estilos.tareaCompletada]}>
      <TouchableOpacity 
        style={estilos.contenidoTarea}
        onPress={() => abrirDetalle(item.id)}
      >
        <Text style={[estilos.textoTarea, item.completada && estilos.textoCompletado]}>
          {item.titulo}
        </Text>
        <Text style={estilos.contadorPasos}>
          {item.pasos?.length || 0} pasos
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>Mis Tareas</Text>
      
      <FlatList
        data={tareas}
        renderItem={renderizarTarea}
        keyExtractor={(item) => item.id}
        style={estilos.listaTareas}
        ListEmptyComponent={
          <Text style={estilos.textoVacio}>No hay tareas aún</Text>
        }
      />

      <TouchableOpacity 
        style={estilos.botonAgregar} 
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <ModalNuevaTarea
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={guardarTarea}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  listaTareas: {
    flex: 1,
  },
  itemTarea: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
    alignItems: 'center',
  },
  contenidoTarea: {
    flex: 1,
  },
  contadorPasos: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  tareaCompletada: {
    backgroundColor: '#f0f0f0',
  },
  textoTarea: {
    fontSize: 16,
    color: '#333',
  },
  textoCompletado: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  textoVacio: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 50,
  },
  botonAgregar: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
  },

});
