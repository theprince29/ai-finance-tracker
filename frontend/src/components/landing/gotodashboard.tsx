import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button";
const GotoDashboard = () => {
  const router = useRouter();
  return (
    <Button
      onClick={() => router.push("/finance")}
      className="group relative inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      Go to Dashboard
    </Button>
  );
};

export default GotoDashboard;