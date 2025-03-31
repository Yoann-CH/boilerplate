import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function SkeletonUsersTable() {
  // Créer 5 lignes de squelette pour visualiser le chargement
  const skeletonRows = Array.from({ length: 5 }, (_, i) => (
    <TableRow key={i} className="animate-pulse">
      <TableCell>
        <Skeleton className="h-10 w-10 rounded-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-[140px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-[200px]" />
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <Skeleton className="h-6 w-[70px] rounded-full" />
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-[120px]" />
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </TableCell>
    </TableRow>
  ));

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Avatar</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Date de création</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {skeletonRows}
        </TableBody>
      </Table>
    </div>
  );
} 