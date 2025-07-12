import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Search, Filter, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from './LoadingSpinner';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  searchable?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  title?: string;
  className?: string;
  onRowClick?: (row: T) => void;
  actions?: (row: T) => React.ReactNode;
  emptyMessage?: string;
}

type SortConfig<T> = {
  key: keyof T;
  direction: 'asc' | 'desc';
} | null;

export const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  searchable = true,
  sortable = true,
  filterable = false,
  pagination = true,
  pageSize = 10,
  title,
  className,
  onRowClick,
  actions,
  emptyMessage = 'No data available'
}: DataTableProps<T>) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Filter and search data
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Apply search
    if (searchTerm && searchable) {
      filtered = filtered.filter(row =>
        columns.some(col => {
          const value = row[col.key];
          return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Apply column filters
    if (filterable) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          filtered = filtered.filter(row =>
            row[key]?.toString().toLowerCase().includes(value.toLowerCase())
          );
        }
      });
    }

    return filtered;
  }, [data, searchTerm, filters, columns, searchable, filterable]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;

    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, pagination]);

  // Handle sorting
  const handleSort = (key: keyof T) => {
    if (!sortable) return;

    setSortConfig(current => {
      if (current?.key === key) {
        return current.direction === 'asc' 
          ? { key, direction: 'desc' }
          : null;
      }
      return { key, direction: 'asc' };
    });
  };

  // Handle filter change
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  // Pagination calculations
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, sortedData.length);

  return (
    <Card className={cn('w-full', className)}>
      {(title || searchable || filterable) && (
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {title && <CardTitle className="text-xl">{title}</CardTitle>}
            
            <div className="flex flex-col sm:flex-row gap-2">
              {searchable && (
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-full sm:w-64"
                  />
                </div>
              )}
              
              {filterable && (
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      )}

      <CardContent className="p-0">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    {columns.map((column) => (
                      <th
                        key={column.key as string}
                        className={cn(
                          'px-4 py-3 text-left text-sm font-medium text-muted-foreground',
                          column.className,
                          sortable && column.sortable !== false && 'cursor-pointer hover:text-foreground',
                          column.width && `w-${column.width}`
                        )}
                        onClick={() => sortable && column.sortable !== false && handleSort(column.key)}
                      >
                        <div className="flex items-center gap-1">
                          {column.label}
                          {sortable && column.sortable !== false && (
                            <div className="flex flex-col">
                              <ChevronUp 
                                className={cn(
                                  'h-3 w-3 transition-colors',
                                  sortConfig?.key === column.key && sortConfig.direction === 'asc'
                                    ? 'text-foreground'
                                    : 'text-muted-foreground/50'
                                )}
                              />
                              <ChevronDown 
                                className={cn(
                                  'h-3 w-3 -mt-1 transition-colors',
                                  sortConfig?.key === column.key && sortConfig.direction === 'desc'
                                    ? 'text-foreground'
                                    : 'text-muted-foreground/50'
                                )}
                              />
                            </div>
                          )}
                        </div>
                      </th>
                    ))}
                    {actions && (
                      <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground w-10">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length === 0 ? (
                    <tr>
                      <td 
                        colSpan={columns.length + (actions ? 1 : 0)} 
                        className="px-4 py-8 text-center text-muted-foreground"
                      >
                        {emptyMessage}
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((row, index) => (
                      <tr
                        key={index}
                        className={cn(
                          'border-b transition-colors',
                          onRowClick && 'cursor-pointer hover:bg-muted/50'
                        )}
                        onClick={() => onRowClick?.(row)}
                      >
                        {columns.map((column) => (
                          <td
                            key={column.key as string}
                            className={cn(
                              'px-4 py-3 text-sm',
                              column.className
                            )}
                          >
                            {column.render 
                              ? column.render(row[column.key], row)
                              : row[column.key]?.toString() || '-'
                            }
                          </td>
                        ))}
                        {actions && (
                          <td className="px-4 py-3 text-right">
                            {actions(row)}
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {pagination && totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex} to {endIndex} of {sortedData.length} results
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

// Quick table for simple data display
export const SimpleTable = <T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  className
}: {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  className?: string;
}) => (
  <DataTable
    data={data}
    columns={columns}
    loading={loading}
    className={className}
    searchable={false}
    sortable={false}
    filterable={false}
    pagination={false}
  />
);