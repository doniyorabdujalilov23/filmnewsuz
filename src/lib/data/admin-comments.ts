import { collection, query, orderBy, limit, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { Comment, CommentStatus } from "@/types";
import { mapCommentDoc } from "@/lib/data/mappers";

export async function getAllComments(count = 200): Promise<Comment[]> {
  const q = query(collection(db, "comments"), orderBy("createdAt", "desc"), limit(count));
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapCommentDoc(d.id, d.data()));
}

export async function updateCommentStatus(id: string, status: CommentStatus): Promise<void> {
  await updateDoc(doc(db, "comments", id), { status });
}

export async function deleteComment(id: string): Promise<void> {
  await deleteDoc(doc(db, "comments", id));
}
