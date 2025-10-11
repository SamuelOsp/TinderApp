import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  query,
  where,
  orderBy,
  setDoc,
  serverTimestamp
} from '@angular/fire/firestore';
import { map, switchMap, of, combineLatest, tap } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';
import { WidgetUpdater } from 'src/capacitor/widget'; 

export type ConversationVM = {
  id: string;
  other: { uid: string; name?: string; lastName?: string; photoUrl?: string };
  lastText?: string;
  lastAt?: any;
  unread?: number;
};

async function saveWidgetSnapshot(convos: ConversationVM[]) {
  const top3 = (convos || [])
    .slice(0, 3)
    .map(c => ({
      name: ((c?.other?.name || '') + (c?.other?.lastName ? (' ' + c.other.lastName) : '')).trim(),
      last: (c?.lastText || 'Say hi!') + ''
    }));

  try {
    await Preferences.set({ key: 'widget_convos', value: JSON.stringify(top3) });
  } catch {
  }
}

@Injectable({ providedIn: 'root' })
export class ChatsService {
  private db = inject(Firestore);

  conversations$(meUid: string) {
    const col = collection(this.db, 'chats');
    const qy = query(
      col,
      where('participants', 'array-contains', meUid),
      orderBy('lastAt', 'desc')
    );

    return collectionData(qy, { idField: 'id' }).pipe(
      map((threads: any[]) =>
        (threads || []).filter(t =>
          Array.isArray(t?.participants) &&
          (t.participants as string[]).filter(Boolean).length >= 2
        )
      ),
      switchMap((threads: any[]) => {
        const streams = threads.map(t => {
          const arr = (t.participants as string[]).filter(Boolean);
          const otherUid = arr.find(x => x !== meUid);
          if (!otherUid) return of(null);

          return docData(doc(this.db, 'users', otherUid)).pipe(
            map((u: any) => ({
              id: t.id,
              other: {
                uid: otherUid,
                name: u?.name,
                lastName: u?.lastName,
                photoUrl: u?.photos?.[0] || u?.photoUrl
              },
              lastText: t.lastText || '',
              lastAt: t.lastAt,
              unread: 0
            } as ConversationVM))
          );
        });

        const valid = streams.filter(Boolean) as any[];
        if (!valid.length) return of([] as ConversationVM[]);
        return combineLatest(valid);
      }),
      tap(async (convos) => {
        try {
          await saveWidgetSnapshot(convos as ConversationVM[]);
          if (Capacitor.getPlatform() === 'android') {
            await WidgetUpdater.update();
          }
        } catch {
          
        }
      })
    );
  }

  async ensureConversation(meUid: string, otherUid: string) {
    const ids = [meUid, otherUid].sort();
    const id = `${ids[0]}_${ids[1]}`;
    const ref = doc(this.db, 'chats', id);
    await setDoc(ref, { participants: ids, lastAt: serverTimestamp() }, { merge: true });
    return id;
  }

  async sendAutoMessage(meUid: string, otherUid: string, text: string) {
    const ids = [meUid, otherUid].sort();
    const id = `${ids[0]}_${ids[1]}`;
    const ref = doc(this.db, 'chats', id);
    await setDoc(
      ref,
      {
        participants: ids,
        lastText: text,
        lastFrom: meUid,
        lastAt: serverTimestamp()
      },
      { merge: true }
    );
  }
}
