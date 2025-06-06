import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import serviceAccount from '../service-account.json' assert { type: 'json' };

initializeApp({ credential: cert(serviceAccount as any) });

const db = getFirestore();

async function deleteAllSongs() {
  const snap = await db.collection('songs').get();
  const batch = db.batch();
  snap.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
  console.log(`Deleted ${snap.size} songs`);
}

deleteAllSongs().catch((err) => console.error(err));
