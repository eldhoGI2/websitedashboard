import { CONFIG } from './config.js';

export async function fetchFinance() {
    try {
        const res = await fetch(CONFIG.CRYPTO_API_URL);
        const data = await res.json();
        return {
            btc: data.bitcoin.usd,
            eth: data.ethereum.usd
        };
    } catch (err) {
        return null;
    }
}