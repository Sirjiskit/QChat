import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { IChatsList } from "../../interface/chats.list";

export const myChartList = () => {
    return new Promise(async (resolve, reject) => {
        const list: Array<any> = [];
        const q = query(collection(db, "ChatList"), where("myId", "==", `${auth.currentUser?.email}`));
        const q2 = query(collection(db, "ChatList"), where("userId", "==", `${auth.currentUser?.email}`));
        const qs1 = await getDocs(q);
        const qs2 = await getDocs(q2);
        if (qs1.empty && qs2.empty) {
            resolve(list);
        }
        let count = 0;
        qs1.forEach(async (doc: { id: any; data: () => any; }) => {
            const user = await users(doc.data());
            const obj: IChatsList = {
                chatId: doc.data().chatId,
                userId: doc.data().userId,
                myId: doc.data().myId,
                unread: await unread([`${doc.data().userId}${doc.data().myId}`, `${doc.data().myId}${doc.data().userId}`]),
                avatar: user.avatar,
                lastName: user.lastName,
                firstName: user.firstName,
                email: doc.data().myId == auth.currentUser?.email ? doc.data().userId : doc.data().myId
            };;
            list.push(obj);
            count++;
        });
        qs2.forEach(async (doc: { id: any; data: () => any; }) => {
            const user = await users(doc.data());
            const obj: IChatsList = {
                chatId: doc.data().chatId,
                userId: doc.data().userId,
                myId: doc.data().myId,
                unread: await unread([`${doc.data().userId}${doc.data().myId}`, `${doc.data().myId}${doc.data().userId}`]),
                avatar: user.avatar,
                lastName: user.lastName,
                firstName: user.firstName,
                email: doc.data().myId == auth.currentUser?.email ? doc.data().userId : doc.data().myId
            };
            list.push(obj);
            count++;
            if (count == (qs1.size + qs2.size)) {
                resolve(list);
            }
        });
    });
}
const unread = (clause: Array<any>): Promise<number> => {
    return new Promise(async (resolve, reject) => {
        const q = query(collection(db, "chats"), where("chatId", "in", clause));
        const qs = await getDocs(q);
        if (qs.empty) {
            resolve(0);
        }
        let i = 0;
        let count = 0;
        qs.forEach(async (doc: { id: any; data: () => any; }) => {
            if (!doc.data().read || doc.data().read == false || doc.data().read == 'false') {
                count++;
            };
            i++;
            if (i == qs.size) {
                resolve(count);
            }
        });
    });
}
const users = (data: any) => {
    let email = '';
    if (data.myId == auth.currentUser?.email) {
        email = data.userId;
    } else {
        email = data.myId;
    }
    const docRef = doc(db, "users", email);
    return new Promise<any>(async (r, j) => {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            r(docSnap.data() as any);
        } else {
            j(false);
        }
    });
};