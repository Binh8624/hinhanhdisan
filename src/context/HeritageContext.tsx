import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import {
  db,
  OperationType,
  handleFirestoreError,
  testFirestoreConnection,
} from '../firebase/client';
import { INITIAL_OFFICIAL_SOURCES } from '../data/officialSourcesAndLegal';
import {
  VERIFIED_CONSENT_RECORDS,
  VERIFIED_HERITAGE_RECORDS,
  VERIFIED_PERMISSIONS,
  VERIFIED_RECORD_FILES,
  VERIFIED_RECORD_HOLDERS,
  VERIFIED_RECORD_VERSIONS,
  VERIFIED_RELATIONSHIPS,
  VERIFIED_RIGHTS_HOLDERS,
} from '../data/verifiedHeritageRecords';
import type {
  ConsentRecord,
  HeritageRecord,
  PermissionRecord,
  PermissionScope,
  RecordFile,
  RecordHolder,
  RecordRelationship,
  RecordSourceLink,
  RecordVersion,
  RightsHolder,
  SourceReference,
  TakedownRequest,
  UsageRequest,
  VerificationLog,
} from '../types/heritage';

interface HeritageContextValue {
  connectionStatus: { connected: boolean; message: string };
  loading: boolean;
  error: string | null;

  // Public Data Collections
  records: HeritageRecord[];
  recordVersions: RecordVersion[];
  recordFiles: RecordFile[];
  recordHolders: RecordHolder[];
  rightsHolders: RightsHolder[];
  permissions: PermissionRecord[];
  permissionScopes: PermissionScope[];
  sources: SourceReference[];
  recordSources: RecordSourceLink[];
  verificationLogs: VerificationLog[];
  consentRecords: ConsentRecord[];
  recordRelationships: RecordRelationship[];

  // Public Citizen Request Actions (Write-Only PII protection)
  submitUsageRequest: (
    input: Omit<UsageRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>
  ) => Promise<string>;
  submitTakedownRequest: (
    input: Omit<TakedownRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>
  ) => Promise<string>;
}

const HeritageContext = createContext<HeritageContextValue | null>(null);

function makeId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now()}_${rand}`;
}

function mergeById<T extends { id: string }>(curated: T[], remote: T[]): T[] {
  const map = new Map<string, T>();
  for (const item of curated) {
    map.set(item.id, item);
  }
  for (const item of remote) {
    map.set(item.id, item);
  }
  return Array.from(map.values());
}

export function HeritageProvider({ children }: { children: React.ReactNode }) {
  const [connectionStatus, setConnectionStatus] = useState({
    connected: true,
    message: 'Đang kiểm tra kết nối dữ liệu công khai...',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [firestoreRecords, setFirestoreRecords] = useState<HeritageRecord[]>([]);
  const [firestoreVersions, setFirestoreVersions] = useState<RecordVersion[]>([]);
  const [firestoreFiles, setFirestoreFiles] = useState<RecordFile[]>([]);
  const [firestoreHolders, setFirestoreHolders] = useState<RecordHolder[]>([]);
  const [firestoreRightsHolders, setFirestoreRightsHolders] = useState<RightsHolder[]>([]);
  const [firestorePermissions, setFirestorePermissions] = useState<PermissionRecord[]>([]);
  const [permissionScopes, setPermissionScopes] = useState<PermissionScope[]>([]);
  const [firestoreSources, setFirestoreSources] = useState<SourceReference[]>([]);
  const [recordSources, setRecordSources] = useState<RecordSourceLink[]>([]);
  const [verificationLogs, setVerificationLogs] = useState<VerificationLog[]>([]);
  const [firestoreConsents, setFirestoreConsents] = useState<ConsentRecord[]>([]);
  const [firestoreRelationships, setFirestoreRelationships] = useState<RecordRelationship[]>([]);

  const lastSubmitTimestampsRef = useRef<number[]>([]);

  useEffect(() => {
    void testFirestoreConnection().then(setConnectionStatus);
  }, []);

  // Subscribe strictly to publicly readable collections (zero admin/staff/PII queries)
  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribers: Array<() => void> = [];

    const recordsQuery = query(
      collection(db, 'heritage_records'),
      where('visibilityStatus', '==', 'public')
    );

    unsubscribers.push(
      onSnapshot(
        recordsQuery,
        (snap) => {
          setFirestoreRecords(snap.docs.map((d) => d.data() as HeritageRecord));
          setLoading(false);
        },
        () => {
          // Gracefully degrade to curated verified records if remote collection rules deny or network fails
          setLoading(false);
        }
      )
    );

    const filesQuery = query(
      collection(db, 'record_files'),
      where('isPubliclyReadable', '==', true),
      where('fileCategory', 'in', ['access_copy', 'preservation_copy', 'display_web', 'copy_file'])
    );

    unsubscribers.push(
      onSnapshot(
        filesQuery,
        (snap) => {
          setFirestoreFiles(snap.docs.map((d) => d.data() as RecordFile));
        },
        () => {
          // Graceful fallback
        }
      )
    );

    const publicCollections: Array<{
      name: string;
      setter: (items: never[]) => void;
    }> = [
      { name: 'record_versions', setter: setFirestoreVersions as (items: never[]) => void },
      { name: 'record_holders', setter: setFirestoreHolders as (items: never[]) => void },
      { name: 'rights_holders', setter: setFirestoreRightsHolders as (items: never[]) => void },
      { name: 'permissions', setter: setFirestorePermissions as (items: never[]) => void },
      { name: 'permission_scopes', setter: setPermissionScopes as (items: never[]) => void },
      { name: 'source_references', setter: setFirestoreSources as (items: never[]) => void },
      { name: 'record_sources', setter: setRecordSources as (items: never[]) => void },
      { name: 'verification_logs', setter: setVerificationLogs as (items: never[]) => void },
      { name: 'consent_records', setter: setFirestoreConsents as (items: never[]) => void },
      { name: 'record_relationships', setter: setFirestoreRelationships as (items: never[]) => void },
    ];

    for (const col of publicCollections) {
      unsubscribers.push(
        onSnapshot(
          collection(db, col.name),
          (snap) => {
            col.setter(snap.docs.map((d) => d.data() as never));
          },
          () => {
            // Graceful fallback
          }
        )
      );
    }

    return () => {
      unsubscribers.forEach((u) => u());
    };
  }, []);

  // Merge non-destructively: preserve any existing public Firestore documents and complement with verified dataset
  const records = useMemo(() => {
    const map = new Map<string, HeritageRecord>();
    for (const rec of VERIFIED_HERITAGE_RECORDS) {
      map.set(rec.dcIdentifier.toUpperCase(), rec);
    }
    for (const remote of firestoreRecords) {
      if (remote.visibilityStatus === 'public') {
        map.set((remote.dcIdentifier || remote.id).toUpperCase(), remote);
      }
    }
    return Array.from(map.values()).sort((a, b) =>
      a.dcIdentifier.localeCompare(b.dcIdentifier, 'vi')
    );
  }, [firestoreRecords]);

  const recordFiles = useMemo(() => {
    const safeRemote = firestoreFiles.filter(
      (f) => f.fileCategory !== 'original_master' && f.fileCategory !== 'rights_evidence'
    );
    return mergeById(VERIFIED_RECORD_FILES, safeRemote);
  }, [firestoreFiles]);

  const recordVersions = useMemo(
    () => mergeById(VERIFIED_RECORD_VERSIONS, firestoreVersions),
    [firestoreVersions]
  );

  const recordHolders = useMemo(
    () => mergeById(VERIFIED_RECORD_HOLDERS, firestoreHolders),
    [firestoreHolders]
  );

  const rightsHolders = useMemo(
    () => mergeById(VERIFIED_RIGHTS_HOLDERS, firestoreRightsHolders),
    [firestoreRightsHolders]
  );

  const permissions = useMemo(
    () => mergeById(VERIFIED_PERMISSIONS, firestorePermissions),
    [firestorePermissions]
  );

  const consentRecords = useMemo(
    () => mergeById(VERIFIED_CONSENT_RECORDS, firestoreConsents),
    [firestoreConsents]
  );

  const recordRelationships = useMemo(
    () => mergeById(VERIFIED_RELATIONSHIPS, firestoreRelationships),
    [firestoreRelationships]
  );

  const sources: SourceReference[] = useMemo(() => {
    return mergeById(INITIAL_OFFICIAL_SOURCES, firestoreSources);
  }, [firestoreSources]);

  function enforceSubmitCooldown() {
    const now = Date.now();
    lastSubmitTimestampsRef.current = lastSubmitTimestampsRef.current.filter(
      (ts) => now - ts < 60_000
    );
    if (lastSubmitTimestampsRef.current.length >= 3) {
      throw new Error('Bạn vừa gửi nhiều biểu mẫu liên tiếp. Vui lòng chờ 1 phút trước khi gửi tiếp.');
    }
    lastSubmitTimestampsRef.current.push(now);
  }

  async function submitUsageRequest(
    input: Omit<UsageRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    enforceSubmitCooldown();
    const id = makeId('ureq');
    const now = new Date().toISOString();
    const docData: UsageRequest = {
      requesterName: input.requesterName.trim().slice(0, 160),
      organization: input.organization.trim().slice(0, 200),
      contactInfo: input.contactInfo.trim().slice(0, 200),
      recordIdentifier: input.recordIdentifier.trim().slice(0, 100),
      purpose: input.purpose.trim().slice(0, 500),
      scope: input.scope.trim().slice(0, 300),
      usageFormat: input.usageFormat.trim().slice(0, 200),
      duration: input.duration.trim().slice(0, 120),
      pledgeAccepted: Boolean(input.pledgeAccepted),
      additionalNotes: (input.additionalNotes ?? '').trim().slice(0, 1000),
      id,
      status: 'Mới tiếp nhận',
      createdAt: now,
      updatedAt: now,
    };
    try {
      await setDoc(doc(db, 'usage_requests', id), docData);
      return id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `usage_requests/${id}`);
    }
  }

  async function submitTakedownRequest(
    input: Omit<TakedownRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    enforceSubmitCooldown();
    const id = makeId('treq');
    const now = new Date().toISOString();
    const docData: TakedownRequest = {
      requestCategory: input.requestCategory,
      requesterName: input.requesterName.trim().slice(0, 160),
      requesterRole: input.requesterRole.trim().slice(0, 160),
      contactInfo: input.contactInfo.trim().slice(0, 200),
      recordIdentifier: input.recordIdentifier.trim().slice(0, 100),
      reason: input.reason.trim().slice(0, 1000),
      affectedScope: input.affectedScope.trim().slice(0, 300),
      ...(input.rightsBasisDescription
        ? { rightsBasisDescription: input.rightsBasisDescription.trim().slice(0, 600) }
        : {}),
      ...(input.supportingUrl ? { supportingUrl: input.supportingUrl.trim().slice(0, 500) } : {}),
      ...(input.attachmentMeta ? { attachmentMeta: input.attachmentMeta } : {}),
      id,
      status: 'Tiếp nhận khẩn',
      createdAt: now,
      updatedAt: now,
    };
    try {
      await setDoc(doc(db, 'takedown_requests', id), docData);
      return id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `takedown_requests/${id}`);
    }
  }

  const value: HeritageContextValue = {
    connectionStatus,
    loading,
    error,
    records,
    recordVersions,
    recordFiles,
    recordHolders,
    rightsHolders,
    permissions,
    permissionScopes,
    sources,
    recordSources,
    verificationLogs,
    consentRecords,
    recordRelationships,
    submitUsageRequest,
    submitTakedownRequest,
  };

  return <HeritageContext.Provider value={value}>{children}</HeritageContext.Provider>;
}

export function useHeritage() {
  const ctx = useContext(HeritageContext);
  if (!ctx) {
    throw new Error('useHeritage must be used inside HeritageProvider');
  }
  return ctx;
}
