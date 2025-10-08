import {
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonRowProps {
  rows?: number;
  col?: number;
}

const SkeletonRowComponent = ({ rows = 3, col = 4 }: SkeletonRowProps) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from({ length: col }).map((_, colIndex) => (
            <TableCell key={colIndex}>
              <Skeleton className="h-4 w-[80%]" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

export default SkeletonRowComponent;
