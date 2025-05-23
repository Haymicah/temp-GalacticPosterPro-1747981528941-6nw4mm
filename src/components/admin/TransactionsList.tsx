import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';
import { Transaction } from '../../types/admin';
import { cn } from '../../lib/utils';

interface TransactionsListProps {
  transactions: Transaction[];
}

export function TransactionsList({ transactions }: TransactionsListProps) {
  return (
    <div className="space-y-4">
      {transactions.map((transaction, index) => (
        <motion.div
          key={transaction.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={cn(
            "flex items-center justify-between p-3 rounded-lg",
            "bg-terminal-black/20 hover:bg-terminal-black/40 transition-colors"
          )}
        >
          <div className="flex items-center space-x-4">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              transaction.type === 'incoming' && "bg-green-900/20 text-green-500",
              transaction.type === 'outgoing' && "bg-red-900/20 text-red-500",
              transaction.type === 'subscription' && "bg-blue-900/20 text-blue-500",
              transaction.type === 'refund' && "bg-yellow-900/20 text-yellow-500"
            )}>
              {transaction.type === 'incoming' && <ArrowUpRight className="w-4 h-4" />}
              {transaction.type === 'outgoing' && <ArrowDownRight className="w-4 h-4" />}
              {transaction.type === 'subscription' && <RefreshCw className="w-4 h-4" />}
              {transaction.type === 'refund' && <ArrowDownRight className="w-4 h-4" />}
            </div>
            <div>
              <div className="font-bold">{transaction.description}</div>
              <div className="text-xs opacity-75">
                {format(new Date(transaction.created_at), 'PPp')}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className={cn(
              "font-mono font-bold",
              transaction.type === 'incoming' && "text-green-500",
              transaction.type === 'outgoing' && "text-red-500",
              transaction.type === 'subscription' && "text-blue-500",
              transaction.type === 'refund' && "text-yellow-500"
            )}>
              {transaction.type === 'incoming' && '+'}
              {transaction.type === 'outgoing' && '-'}
              {transaction.type === 'refund' && '-'}
              ${transaction.amount.toFixed(2)}
            </div>
            <div className="text-xs opacity-75">
              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}