import { useAccount } from "ckd-react";

export default function UseAccountExample() {
  const account = useAccount();

  return <pre>{JSON.stringify(account, null, 2)}</pre>;
}
