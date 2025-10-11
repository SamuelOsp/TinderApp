import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, query, where, orderBy, setDoc, serverTimestamp } from '@angular/fire/firestore';
import { map, switchMap, of, combineLatest } from 'rxjs';

export type ConversationVM = {
  id: string;
  other: { uid: string; name?: string; lastName?: string; photoUrl?: string };
  lastText?: string;
  lastAt?: any;
  unread?: number;
};

@Injectable({ providedIn: 'root' })
export class ChatsService {
  private db = inject(Firestore);

  conversations$(meUid: string) {
    const col = collection(this.db, 'chats');

    const qy = query(col, where('participants', 'array-contains', meUid), orderBy('lastAt', 'desc'));

    return collectionData(qy, { idField: 'id' }).pipe(
      switchMap((threads: any[]) => {
        if (!threads?.length) return of([] as ConversationVM[]);

        const items$ = threads.map(t => {
          const parts: string[] = Array.isArray(t?.participants) ? t.participants.filter(Boolean) : [];
          const otherUid = parts.find(x => x !== meUid);

          const base = {
            id: t.id,
            lastText: t.lastText || '',
            lastAt: t.lastAt,
            unread: 0,
          };

          if (!otherUid) {
            // Evita path inválido y deja algo visible
            return of({ ...base, other: { uid: '', name: 'Unknown' } } as ConversationVM);
          }

          const otherRef = doc(this.db, 'users', otherUid);
          return docData(otherRef).pipe(
            map((u: any) => ({
              ...base,
              other: {
                uid: otherUid,
                name: u?.name,
                lastName: u?.lastName,
                photoUrl: Array.isArray(u?.photos) ? u.photos?.[0] : (u?.photoUrl || undefined),
              },
            } as ConversationVM))
          );
        });

        return combineLatest(items$);
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
    await setDoc(ref, {
      participants: ids,
      lastText: text,
      lastFrom: meUid,
      lastAt: serverTimestamp()
    }, { merge: true });
  }
}
