import { useMemo } from "react";

declare function useWalletBalances(): WalletBalance[];
declare function usePrices(): Prices;

// Blockchain defined as enum based on the switch values
type Blockchain = "Osmosis" | "Ethereum" | "Arbitrum" | "Zilliqa" | "Neo";

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain;
}

interface FormattedWalletBalance extends WalletBalance {
  formattedAmount: string;
  usdValue: number;
}

type Prices = Record<string, number>;

const PRIORITY: Record<Blockchain, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

// 'getPriority' defined outside the component and constant mapping to avoid re-creation on each render
const getPriority = (chain: Blockchain): number => PRIORITY[chain] ?? -99;

// Use BoxProps and rest directly
const WalletPage: React.FC<BoxProps> = ({ ...rest }) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  // Simplify filter and sort
  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance) => balance.amount > 0)
      .sort(
        (lhs, rhs) => getPriority(rhs.blockchain) - getPriority(lhs.blockchain)
      );
    // Remove prices from dependencies
  }, [balances]);

  // Combining formattedBalances and usdValue computation into a single map to avoid double iteration
  const displayRows: FormattedWalletBalance[] = useMemo(() => {
    return sortedBalances.map((balance: WalletBalance) => {
      const price = prices[balance.currency] ?? 0;
      const usdValue = price * balance.amount;

      return {
        ...balance,
        usdValue,
        formattedAmount: balance.amount.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 8,
        }),
      };
    });
  }, [sortedBalances, prices]);

  return (
    <div {...rest}>
      {/* Map only handle rendering */}
      {displayRows.map((balance, idx) => (
        <WalletRow
          // Stable key: currency + blockchain
          key={`${balance.currency}:${balance.blockchain}:${idx}`}
          amount={balance.amount}
          usdValue={balance.usdValue}
          formattedAmount={balance.formattedAmount}
        />
      ))}
    </div>
  );
};
