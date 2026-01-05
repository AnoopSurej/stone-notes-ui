import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SortBy, SortDir } from "@/hooks/useNotes";

interface SortControlProps {
  sortBy: SortBy;
  sortDir: SortDir;
  onSortByChange: (sortBy: SortBy) => void;
  onSortDirChange: (sortDir: SortDir) => void;
}

const sortOptions = [
  {
    value: "createdAt-desc",
    label: "Created (newest)",
    sortBy: "createdAt" as SortBy,
    sortDir: "desc" as SortDir,
  },
  {
    value: "createdAt-asc",
    label: "Created (oldest)",
    sortBy: "createdAt" as SortBy,
    sortDir: "asc" as SortDir,
  },
  {
    value: "updatedAt-desc",
    label: "Updated (newest)",
    sortBy: "updatedAt" as SortBy,
    sortDir: "desc" as SortDir,
  },
  {
    value: "title-asc",
    label: "Title (A-Z)",
    sortBy: "title" as SortBy,
    sortDir: "asc" as SortDir,
  },
  {
    value: "title-desc",
    label: "Title (Z-A)",
    sortBy: "title" as SortBy,
    sortDir: "desc" as SortDir,
  },
];

export function SortControl({
  sortBy,
  sortDir,
  onSortByChange,
  onSortDirChange,
}: SortControlProps) {
  const currentValue = `${sortBy}-${sortDir}`;

  const handleChange = (value: string) => {
    const option = sortOptions.find((opt) => opt.value === value);
    if (option) {
      onSortByChange(option.sortBy);
      onSortDirChange(option.sortDir);
    }
  };

  return (
    <Select value={currentValue} onValueChange={handleChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
