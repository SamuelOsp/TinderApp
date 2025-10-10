import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, query, where, orderBy, doc, docData } from '@angular/fire/firestore';
import { map, switchMap, combineLatestAll } from 'rxjs/operators';
import { Observable, of, from } from 'rxjs';
import { getAuth } from 'firebase/auth';

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: string;
  lastAt?: any; 
  lastSender?: string;
  unread?: Record<string, number>;
}

export interface UserProfile {
  uid: string;
  name?: string;
  lastName?: string;
  photoUrl?: string;
  city?: string;
}

export interface ConversationVM {
  id: string;
  other: UserProfile;
  lastMessage?: string;
  lastAt?: any;
  unread?: number;
}

@Injectable({ providedIn: 'root' })
export class ChatsService {
  constructor(private afs: Firestore) {}

  private me(): string {
    return getAuth().currentUser?.uid ?? '';
  }

  
  conversations$(): Observable<ConversationVM[]> {
    const uid = this.me();
    if (!uid) return of([]);

    const q = query(
      collection(this.afs, 'conversations'),
      where('participants', 'array-contains', uid),
      orderBy('lastAt', 'desc')
    );

    return collectionData(q, { idField: 'id' }).pipe(
      switchMap((rows: any[]) => {
        if (!rows.length) return of([] as ConversationVM[]);

        const items$ = rows.map(row => {
          const otherUid: string = (row.participants as string[]).find(x => x !== uid) || '';
          if (!otherUid) {
            const vm: ConversationVM = { id: row.id, other: { uid: '' }, lastMessage: row.lastMessage, lastAt: row.lastAt, unread: row.unread?.[uid] ?? 0 };
            return of(vm);
          }
          const ref = doc(this.afs, 'users', otherUid);
          return docData(ref, { idField: 'uid' }).pipe(
            map((u: any) => {
              const other: UserProfile = {
                uid: otherUid,
                name: u?.name,
                lastName: u?.lastName,
                photoUrl: (u?.photos && u.photos[0]) || u?.photoUrl || '',
                city: u?.city
              };
              const vm: ConversationVM = {
                id: row.id,
                other,
                lastMessage: row.lastMessage,
                lastAt: row.lastAt,
                unread: row.unread?.[uid] ?? 0
              };
              return vm;
            })
          );
        });

        return from(items$).pipe(combineLatestAll());
      })
    );
  }

  
  convoId(a: string, b: string) {
    return [a, b].sort().join('_');
  }
}
