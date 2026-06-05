// firebase-reviews.js
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

let db = null;

export function initFirebaseReviews(firebaseDb) {
    db = firebaseDb;
    console.log("Firebase Reviews initialized");
}

// Load all reviews from Firestore
export async function loadReviewsFromFirebase() {
    if (!db) {
        console.log("Firestore not initialized");
        return [];
    }
    
    try {
        const reviewsRef = collection(db, 'reviews');
        const q = query(reviewsRef, orderBy('dateAdded', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const reviews = [];
        querySnapshot.forEach((doc) => {
            reviews.push({ firebaseId: doc.id, ...doc.data() });
        });
        
        console.log(`Loaded ${reviews.length} reviews from Firebase`);
        return reviews;
    } catch (error) {
        console.error('Error loading reviews from Firebase:', error);
        return [];
    }
}

// Add a new review to Firestore
export async function addReviewToFirebase(reviewData) {
    if (!db) return null;
    
    try {
        const reviewsRef = collection(db, 'reviews');
        const docRef = await addDoc(reviewsRef, {
            ...reviewData,
            dateAdded: new Date().toISOString().split('T')[0],
            timestamp: new Date()
        });
        
        console.log(`Review added to Firebase with ID: ${docRef.id}`);
        return { firebaseId: docRef.id, ...reviewData };
    } catch (error) {
        console.error('Error adding review to Firebase:', error);
        return null;
    }
}

// Update a review in Firestore
export async function updateReviewInFirebase(reviewId, reviewData) {
    if (!db) return false;
    
    try {
        const reviewRef = doc(db, 'reviews', reviewId);
        await updateDoc(reviewRef, {
            ...reviewData,
            updatedAt: new Date()
        });
        console.log(`Review updated in Firebase: ${reviewId}`);
        return true;
    } catch (error) {
        console.error('Error updating review in Firebase:', error);
        return false;
    }
}

// Delete a review from Firestore
export async function deleteReviewFromFirebase(reviewId) {
    if (!db) return false;
    
    try {
        const reviewRef = doc(db, 'reviews', reviewId);
        await deleteDoc(reviewRef);
        console.log(`Review deleted from Firebase: ${reviewId}`);
        return true;
    } catch (error) {
        console.error('Error deleting review from Firebase:', error);
        return false;
    }
}

// Migrate localStorage reviews to Firebase
export async function migrateLocalStorageToFirebase() {
    const stored = localStorage.getItem('musicReviews');
    if (!stored) return { success: false, count: 0 };
    
    const localReviews = JSON.parse(stored);
    let successCount = 0;
    
    for (const review of localReviews) {
        const { id, ...reviewData } = review;
        const result = await addReviewToFirebase(reviewData);
        if (result) successCount++;
    }
    
    console.log(`Migrated ${successCount} reviews to Firebase`);
    return { success: true, count: successCount };
}