import { create } from "zustand";
import { devtools } from "zustand/middleware";
import axios from "axios";

const url = "https://tonapi.io/v2/accounts/";
const key = import.meta.env.VITE_TON_API_KEY;

interface Balance {
  balance: string;
  price: PriceInfo;
  wallet_address: WalletAddress;
  jetton: JettonInfo;
  tonBalance: string;
  usdBalance: string;
}

interface PriceInfo {
  prices: {
    TON: number;
    USD: number;
  };
  diff_24h: DiffInfo;
  diff_7d: DiffInfo;
  diff_30d: DiffInfo;
}

interface DiffInfo {
  USD: string;
  TON: string;
}

interface WalletAddress {
  address: string;
  is_scam: boolean;
  is_wallet: boolean;
}

interface JettonInfo {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  image: string;
  verification: "whitelist" | "blacklist" | "unknown"; // ограничим возможные значения
}


interface JettonsStore {
  jettonsData: Balance[];
  isLoaded: boolean;
  getJettons: (address: string, callback?: () => void) => Promise<void>;
}


const useTokens = create<JettonsStore>()(
  devtools((set, get) => ({
    jettonsData: [],
    isLoaded: false,
    getJettons: async (address, callback) => {
      const { isLoaded } = get();

      if (isLoaded) {
        if (callback) callback();
        return;
      }

      try {
        const response = await axios.get(
          `${url}/${address}/jettons?currencies=ton,usd&supported_extensions=custom_payload`,
          {
            headers: {
              Authorization: `Bearer ${key}`,
            },
          }
        );
        if (response.status === 200) {
          const jettons = response.data;

          const formattedJettonsData = jettons.balances.map((el: Balance) => {
            const balance = Number(el.balance); // Преобразуем баланс к числу
            const tonToUsdRate = Number(el.price.prices.USD); // Преобразуем цену к числу
            const decimals = el.jetton.decimals; // Получаем decimals для токена

            // Конвертируем баланс в TON с учетом decimals и округляем до 3 знаков
            const tonBalance = (balance / Math.pow(10, decimals)).toFixed(2);

            // Конвертируем баланс в USD и округляем до 2 знаков
            const usdBalance = (parseFloat(tonBalance) * tonToUsdRate).toFixed(
              2
            );

            return {
              ...el,
              tonBalance,
              usdBalance,
            };
          });

          set(
            { jettonsData: formattedJettonsData, isLoaded: true },
            false,
            "jettonsData/formatted"
          );
        }
        if (callback) {
          callback();
        }
      } catch (error) {
        console.error(`Ошибка при получении Jettons: ${error}`);
      }
    },
  }))
);


export default useTokens;
