// Shows where the customer is: Order details -> Shipping -> Confirmation.
// current = 1, 2 or 3
const STEPS = ["Order details", "Shipping", "Confirmation"];

export default function Stepper({ current }) {
  return (
    <ol className="steps" aria-label="Checkout progress">
      {STEPS.map((label, index) => {
        const number = index + 1;
        let cls = "step";
        if (number < current) cls = "step done";
        if (number === current) cls = "step active";
        return (
          <li key={label} className={cls}>
            <span className="step-dot">{number < current ? "✓" : number}</span>
            <span className="step-label">{label}</span>
          </li>
        );
      })}
    </ol>
  );
}
