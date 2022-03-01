import { useCkd } from "ckd-react";

export default function UseCkdExample() {
  const ckd = useCkd();

  return (
    <pre>
      {JSON.stringify(
        {
          connected: ckd.connected,
          "signedIn()": ckd.signedIn(),
        },
        null,
        2
      )}
    </pre>
  );
}
