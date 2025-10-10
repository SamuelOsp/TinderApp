// src/app/core/services/chats/chats.services.ts
import { Injectable } from '@angular/core';
import {
  Firestore, doc, setDoc, collection, addDoc, serverTimestamp,
  collectionData, docData, query, where, orderBy, limit
} from '@angular/fire/firestore';
import { Observable, combineLatest, map, of, switchMap } from 'rxjs';

export interface ConversationVM {
  id: string;
  users: string[];
  updatedAt?: any;          
  lastText?: string;
  lastAuthorId?: string;
  unread?: number;         
  other?: {
    uid: string;
    name?: string;
    lastName?: string;
    photoUrl?: string;
  };
}

@Injectable({ providedIn: 'root' })
export class ChatsService {
  constructor(private afs: Firestore) {}

  private convoId(me: string, other: string) {
    return me < other ? `${me}_${other}` : `${other}_${me}`;
  }

  conversations$(meUid: string, take: number = 50): Observable<ConversationVM[]> {
    const col = collection(this.afs, 'conversations');
    const qy = query(col,
      where('users', 'array-contains', meUid),
      orderBy('updatedAt', 'desc'),
      limit(take)
    );

    return collectionData(qy, { idField: 'id' }).pipe(
      switchMap((rows: any[]) => {
        if (!rows?.length) return of<ConversationVM[]>([]);
        const items$ = rows.map(row => {
          const otherUid = (row?.users || []).find((u: string) => u !== meUid) || '';
          if (!otherUid) {
            return of({
              id: row.id,
              users: row.users || [],
              updatedAt: row.updatedAt,
              lastText: row.lastText,
              lastAuthorId: row.lastAuthorId,
              unread: row?.[`unreadBy_${meUid}`] ?? 0,
              other: { uid: '', name: '', lastName: '', photoUrl: '' }
            } as ConversationVM);
          }
          return docData(doc(this.afs, `users/${otherUid}`)).pipe(
            map((u: any) => ({
              id: row.id,
              users: row.users || [],
              updatedAt: row.updatedAt,
              lastText: row.lastText,
              lastAuthorId: row.lastAuthorId,
              unread: row?.[`unreadBy_${meUid}`] ?? 0,
              other: {
                uid: otherUid,
                name: u?.name || u?.displayName || '',
                lastName: u?.lastName || u?.surname || '',
                photoUrl: u?.photoUrl || u?.avatar || ''
              }
            } as ConversationVM))
          );
        });
        return combineLatest(items$);
      })
    );
  }

  async sendAutoMessage(meUid: string, otherUid: string, text: string) {
    const id = this.convoId(meUid, otherUid);

    
    await setDoc(
      doc(this.afs, `conversations/${id}`),
      { id, users: [meUid, otherUid], updatedAt: serverTimestamp() },
      { merge: true }
    );

   
    await addDoc(
      collection(this.afs, `conversations/${id}/messages`),
      {
        authorId: meUid,
        text,
        sentAt: serverTimestamp(),
        system: true
      }
    );

    await setDoc(
      doc(this.afs, `conversations/${id}`),
      { updatedAt: serverTimestamp(), lastText: text, lastAuthorId: meUid },
      { merge: true }
    );
  }
}
