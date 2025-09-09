import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Paso {
  id: string;
  texto: string;
  completada: boolean;
}

export interface Tarea {
  id: string;
  titulo: string;
  completada: boolean;
  pasos: Paso[];
}

const CLAVE_STORAGE = 'tareas';

export const servicioTareas = {
  async obtenerTareas(): Promise<Tarea[]> {
    const data = await AsyncStorage.getItem(CLAVE_STORAGE);
    const tareas = data ? JSON.parse(data) : [];
    
    // Migrar tareas existentes que no tienen pasos
    return tareas.map((tarea: any) => ({
      ...tarea,
      pasos: tarea.pasos || []
    }));
  },

  async crearTarea(titulo: string): Promise<Tarea> {
    const nuevaTarea: Tarea = {
      id: Date.now().toString(),
      titulo,
      completada: false,
      pasos: [],
    };
    
    const tareas = await this.obtenerTareas();
    const tareasActualizadas = [nuevaTarea, ...tareas];
    await AsyncStorage.setItem(CLAVE_STORAGE, JSON.stringify(tareasActualizadas));
    return nuevaTarea;
  },

  async alternarCompletada(id: string): Promise<Tarea> {
    const tareas = await this.obtenerTareas();
    const tarea = tareas.find(t => t.id === id);
    if (tarea) {
      tarea.completada = !tarea.completada;
      await AsyncStorage.setItem(CLAVE_STORAGE, JSON.stringify(tareas));
    }
    return tarea!;
  },

  async agregarPaso(tareaId: string, texto: string): Promise<void> {
    const tareas = await this.obtenerTareas();
    const tarea = tareas.find(t => t.id === tareaId);
    if (tarea) {
      const nuevoPaso: Paso = {
        id: Date.now().toString(),
        texto,
        completada: false,
      };
      tarea.pasos.push(nuevoPaso);
      
      // Desmarcar tarea principal si se agrega un nuevo paso
      tarea.completada = false;
      
      await AsyncStorage.setItem(CLAVE_STORAGE, JSON.stringify(tareas));
    }
  },

  async alternarPaso(tareaId: string, pasoId: string): Promise<void> {
    const tareas = await this.obtenerTareas();
    const tarea = tareas.find(t => t.id === tareaId);
    if (tarea) {
      const paso = tarea.pasos.find(p => p.id === pasoId);
      if (paso) {
        paso.completada = !paso.completada;
        
        // Auto-completar tarea principal si todos los pasos están completados
        if (tarea.pasos.length > 0) {
          tarea.completada = tarea.pasos.every(p => p.completada);
        }
        
        await AsyncStorage.setItem(CLAVE_STORAGE, JSON.stringify(tareas));
      }
    }
  },
};