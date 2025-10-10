import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, setDoc, doc } from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root'
})
export class Query {
  constructor(private readonly fst: Firestore) { }

  async create(collectionName: string, data: any) {
    try {
      const reference = collection(this.fst, collectionName);
     const res = await addDoc(reference, data);
     console.log(res.toJSON());
    } catch (error) {
      throw error;
    }
  }

  async set(collectionName: string, uid: string, data: any){
    try {
      const newDoc = doc(this.fst, collectionName, uid);
      await setDoc(newDoc, data);
    } catch (error) {
      console.log(error);
    }
  }


}
