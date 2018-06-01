export const VAPID_PUBLIC_KEY = "BHn00d_6fnohGvH7qt91DmK3t6FhJGXPThdJ5ixYd_iU6X0noS0-KkpKfTIhgM141g8pXTFgh3VLzAxLPrk0Yps";

export function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
