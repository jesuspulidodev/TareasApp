import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (titulo: string) => void;
}

export default function ModalNuevaTarea({ visible, onClose, onSave }: Props) {
  const [titulo, setTitulo] = useState('');

  const guardar = () => {
    if (!titulo.trim()) return;
    onSave(titulo.trim());
    setTitulo('');
  };

  const cerrar = () => {
    onClose();
    setTitulo('');
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={cerrar}>
      <View style={estilos.fondo}>
        <View style={estilos.contenido}>
          <Text style={estilos.titulo}>Nueva Tarea</Text>
          
          <TextInput
            style={estilos.input}
            placeholder="Escribe tu tarea..."
            value={titulo}
            onChangeText={setTitulo}
            onSubmitEditing={guardar}
            autoFocus
          />
          
          <View style={estilos.botones}>
            <TouchableOpacity style={estilos.botonCancelar} onPress={cerrar}>
              <Text style={estilos.textoCancelar}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={estilos.botonGuardar} onPress={guardar}>
              <Text style={estilos.textoGuardar}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  fondo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  contenido: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxWidth: 400,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    borderWidth: 0,
  } as any,
  botones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  botonCancelar: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginRight: 5,
    backgroundColor: '#f0f0f0',
  },
  botonGuardar: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginLeft: 5,
    backgroundColor: '#22c55e',
  },
  textoCancelar: {
    textAlign: 'center',
    color: '#666',
    fontWeight: 'bold',
  },
  textoGuardar: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
});