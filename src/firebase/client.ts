import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
// Kept initialized for technical compatibility with Firebase SDK services; public UI requires no sign-in.
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function testFirestoreConnection(): Promise<{ connected: boolean; message: string }> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return { connected: true, message: 'Kết nối cơ sở dữ liệu công khai Firestore thành công.' };
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      return {
        connected: false,
        message: 'Không thể kết nối Firestore ở chế độ ngoại tuyến. Vui lòng kiểm tra kết nối mạng.',
      };
    }
    return {
      connected: true,
      message: 'Đã thiết lập phiên liên kết dữ liệu di sản công khai.',
    };
  }
}
