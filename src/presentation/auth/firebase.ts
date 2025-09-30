import * as admin from 'firebase-admin';

// Inicializa el SDK de Admin de Firebase.
// El SDK buscará automáticamente las credenciales de la variable de entorno
// GOOGLE_APPLICATION_CREDENTIALS que configuraste.
admin.initializeApp();

export const firebaseAuth = admin.auth();