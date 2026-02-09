import { motion } from "framer-motion";
import { TradingCalculator } from "../components/TradingCalculator";

export function CalculatorPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="container mx-auto pt-24 pb-12 px-4"
    >
      <TradingCalculator />
    </motion.div>
  );
}
