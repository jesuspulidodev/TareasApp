import { Text, View, StyleSheet, TouchableOpacity, TextInput, FlatList } from "react-native";
import { useState, useEffect } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { servicioTareas, Tarea, Paso } from '../servicios/servicioTareas';

export default function DetalleTarea() {
  const { tareaId } = useLocalSearchParams();
  const [tarea, setTarea] = useState<Tarea | null>(null);
  const [textoPaso, setTextoPaso] = useState('');

  useEffect(() => {
    cargarTarea();
  }, []);

  const cargarTarea = async () => {
    const tareas = await servicioTareas.obtenerTareas();
    const tareaEncontrada = tareas.find(t => t.id === tareaId);
    setTarea(tareaEncontrada || null);
  };

  const agregarPaso = async () => {
    if (!textoPaso.trim() || !tarea) return;
    
    await servicioTareas.agregarPaso(tarea.id, textoPaso.trim());
    setTextoPaso('');
    cargarTarea();
  };

  const alternarPaso = async (pasoId: string) => {
    if (!tarea) return;
    await servicioTareas.alternarPaso(tarea.id, pasoId);
    cargarTarea();
  };

  const renderizarPaso = ({ item }: { item: Paso }) => (
    <TouchableOpacity 
      style={[estilos.itemPaso, item.completada && estilos.pasoCompletado]}
      onPress={() => alternarPaso(item.id)}
    >
      <Text style={[estilos.textoPaso, item.completada && estilos.textoCompletado]}>
        {item.texto}
      </Text>
    </TouchableOpacity>
  );

  if (!tarea) return <Text>Cargando...</Text>;

  return (
    <View style={estilos.contenedor}>
      <View style={[estilos.header, tarea.completada && estilos.headerCompletado]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#8B5CF6" />
        </TouchableOpacity>
        <Text style={[estilos.tituloHeader, tarea.completada && estilos.tituloCompletado]}>{tarea.titulo}</Text>
        <View style={estilos.espaciador} />
      </View>

      <View style={estilos.contenidoPrincipal}>
        <View style={estilos.inputContainer}>
          <TextInput
            style={estilos.input}
            placeholder="Agregar paso..."
            value={textoPaso}
            onChangeText={setTextoPaso}
            onSubmitEditing={agregarPaso}
          />
          <TouchableOpacity style={estilos.botonAgregar} onPress={agregarPaso}>
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={tarea.pasos}
          renderItem={renderizarPaso}
          keyExtractor={(item) => item.id}
          style={estilos.listaPasos}
          ListEmptyComponent={
            <Text style={estilos.textoVacio}>No hay pasos aún</Text>
          }
        />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },

  tituloHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  headerCompletado: {
    backgroundColor: '#f0f0f0',
  },
  tituloCompletado: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  espaciador: {
    width: 24,
  },
  contenidoPrincipal: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    borderWidth: 0,
  } as any,
  botonAgregar: {
    marginLeft: 10,
    backgroundColor: '#22c55e',
    borderRadius: 8,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  listaPasos: {
    flex: 1,
  },
  itemPaso: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
  },
  pasoCompletado: {
    backgroundColor: '#f0f0f0',
  },
  textoPaso: {
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
});