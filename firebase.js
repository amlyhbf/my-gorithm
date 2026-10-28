// ==========================================================================
// 맘고리즘 Firebase 연동 모듈 (Firestore & Auth)
// ==========================================================================
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {

  apiKey: "AIzaSyBcmT4HagqGYpo_ZfizIReEIvDPG-LtsJs",

  authDomain: "my-gorithm.firebaseapp.com",

  projectId: "my-gorithm",

  storageBucket: "my-gorithm.firebasestorage.app",

  messagingSenderId: "844754199331",

  appId: "1:844754199331:web:2adf2f89e4cf45e188e296",

  measurementId: "G-SEVD6WLTHP"

};


// 키 입력 여부 확인
export const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY";
};

let app = null;
let db = null;
let auth = null;
let currentUser = null;

if (isFirebaseConfigured()) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);

    // 익명 로그인 자동 진행 (설치나 복잡한 가입 없이 사용자별 고유 UID로 클라우드 저장)
    signInAnonymously(auth).catch((err) => {
      console.warn("Firebase 익명 로그인 실패 (콘솔에서 Anonymous 활성화 필요):", err);
    });

    onAuthStateChanged(auth, (user) => {
      currentUser = user;
      if (user) {
        console.log("🔥 Firebase 연결 완료! 사용자 UID:", user.uid);
      }
    });
  } catch (error) {
    console.error("Firebase 초기화 에러:", error);
  }
} else {
  console.info("💡 Firebase 설정이 아직 완료되지 않아 로컬 모드(localStorage)로 동작합니다.");
}

export { db, auth, currentUser };

// ==========================================================================
// 클라우드 저장 및 불러오기 헬퍼 함수
// ==========================================================================

// 1. 사용자 알고리즘 설정(관심도) 저장
export async function saveUserSettingsToCloud(userId, weights) {
  if (!db || !userId) return false;
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, { weights, updatedAt: new Date() }, { merge: true });
    return true;
  } catch (err) {
    console.error("클라우드 설정 저장 실패:", err);
    return false;
  }
}

// 2. 사용자 알고리즘 설정 불러오기
export async function loadUserSettingsFromCloud(userId) {
  if (!db || !userId) return null;
  try {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data().weights;
    }
  } catch (err) {
    console.error("클라우드 설정 불러오기 실패:", err);
  }
  return null;
}

// 3. 커스텀 추천 카드 클라우드 등록 (공유 풀)
export async function addCustomCardToCloud(cardData) {
  if (!db) return null;
  try {
    const colRef = collection(db, 'customCards');
    const docRef = await addDoc(colRef, {
      ...cardData,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (err) {
    console.error("클라우드 카드 등록 실패:", err);
    return null;
  }
}

// 4. 클라우드에 등록된 커스텀 카드 목록 불러오기
export async function fetchCustomCardsFromCloud() {
  if (!db) return [];
  try {
    const colRef = collection(db, 'customCards');
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error("클라우드 카드 불러오기 실패:", err);
    return [];
  }
}

