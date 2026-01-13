/**
 * Table Component
 * Reusable data table
 */

'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface TableProps {
  children: ReactNode;
  className?: string;
}

export function Table({ children, className }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className={cn('w-full border-collapse', className)}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className }: TableProps) {
  return (
    <thead className={cn('bg-gray-50 border-b', className)}>{children}</thead>
  );
}

export function TableRow({ children, className }: TableProps) {
  return (
    <tr className={cn('border-b hover:bg-gray-50 transition-colors', className)}>
      {children}
    </tr>
  );
}

export function TableHead({ children, className }: TableProps) {
  return (
    <th className={cn('px-4 py-3 text-left text-sm font-semibold text-gray-700', className)}>
      {children}
    </th>
  );
}

interface TableCellProps extends TableProps {
  colSpan?: number;
}

export function TableCell({ children, className, colSpan }: TableCellProps) {
  return (
    <td className={cn('px-4 py-3 text-sm text-gray-900', className)} colSpan={colSpan}>
      {children}
    </td>
  );
}

export function TableBody({ children, className }: TableProps) {
  return <tbody className={className}>{children}</tbody>;
}

