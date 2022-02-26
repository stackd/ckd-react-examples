import { useDero } from "ckd-react";

export default function UseDeroExample() {
  const dero = useDero();

  return <pre>{JSON.stringify(dero, null, 2)}</pre>;
}
