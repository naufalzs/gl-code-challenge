// Missing 'blockchain' property in WalletBalance interface
interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps {}

// Props only extends BoxProps without adding any fields, use BoxProps directly instead
const WalletPage: React.FC<Props> = (props: Props) => {
  // 'children' is never used
  // destructure only '...rest' directly instead of using 'props'
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // 'blockchain' should be explicitly defined (preferably as enum based on the switch values)
  // 'getPriority' is pure and stateless function. Define it outside the component as a constant mapping to avoid re-creation on each render
  const getPriority = (blockchain: any): number => {
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
        return 20;
      case "Neo":
        return 20;
      default:
        return -99;
    }
  };

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        // 'balancePriority' is declared but never used
        const balancePriority = getPriority(balance.blockchain);

        // lhsPriority is undefined and will cause runtime error if not deleted
        if (lhsPriority > -99) {
          // This condition only returns balances with amount <= 0 — likely a logic error or mistyped comparison
          if (balance.amount <= 0) {
            return true;
          }
        }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);

        // If leftPriority is higher than rightPriority, return -1 result left comes before right (high priority appears earlier)
        // If rightPriority is higher than leftPriority, return 1 result left comes after right (low priority appears later)
        // The logic ensures that higher priorities are listed first, which means sorting in descending order
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
      });

    // 'prices' is not used inside function; remove it from dependencies to avoid unnecessary recomputation
  }, [balances, prices]);

  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      // 'toFixed()' without specifying precision defaults to 0 decimal places; may cause incorrect monetary formatting
      formatted: balance.amount.toFixed(),
    };
  });

  // The map uses FormattedWalletBalance type, but 'sortedBalances' only contains WalletBalance
  // Should map over 'formattedBalances' instead to access 'formatted' property safely
  const rows = sortedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      // 'usd value' should be calculated together with 'formattedBalances' so that this map only handle rendering
      // Consider combining formattedBalances and usdValue computation into a single map to avoid double iteration
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          // classes is undefined and will cause runtime error if not deleted
          className={classes.row}
          // key should be filled with a stable key and unique key instead of the array index to prevent unnecessary re-renders
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  return <div {...rest}>{rows}</div>;
};
