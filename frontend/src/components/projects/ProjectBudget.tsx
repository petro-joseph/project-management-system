
import React, { useState } from 'react';
import { Project, ProjectExpense } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Wallet, Receipt, PiggyBank, Plus, Edit, Trash, Calculator } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface ProjectBudgetProps {
  project: Project;
  onUpdate?: (updatedProject: Project) => void;
}

const ProjectBudget: React.FC<ProjectBudgetProps> = ({ project, onUpdate }) => {
  const [showBudgetEdit, setShowBudgetEdit] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<number | null>(null);
  
  const [budgetForm, setBudgetForm] = useState({
    total: project.budget?.total || 0,
    currency: project.budget?.currency || 'USD'
  });
  
  const [expenseForm, setExpenseForm] = useState({
    description: '',
    amount: 0,
    date: new Date(),
    category: 'general'
  });
  
  const expenseCategories = [
    'general',
    'labor',
    'materials',
    'equipment',
    'software',
    'travel',
    'consulting',
    'marketing',
    'other'
  ];

  if (!project.budget) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Wallet className="h-5 w-5 mr-2" />
            Budget Tracking
          </CardTitle>
          {onUpdate && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setShowBudgetEdit(true);
              }}
            >
              Initialize Budget
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No budget information available for this project.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { total, spent, currency, expenses } = project.budget;
  const percentSpent = (spent / total) * 100;
  const remaining = total - spent;
  
  // Format currency based on the provided currency code
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };
  
  const handleUpdateBudget = () => {
    if (!onUpdate) return;
    
    const updatedProject = {
      ...project,
      budget: project.budget 
        ? { 
            ...project.budget, 
            total: budgetForm.total,
            currency: budgetForm.currency
          }
        : {
            total: budgetForm.total,
            spent: 0,
            currency: budgetForm.currency,
            expenses: []
          }
    };
    
    onUpdate(updatedProject);
    setShowBudgetEdit(false);
    toast.success("Budget updated successfully");
  };
  
  const handleAddExpense = () => {
    if (!onUpdate) return;
    
    const newExpense: ProjectExpense = {
      id: Date.now(),
      description: expenseForm.description,
      amount: expenseForm.amount,
      date: expenseForm.date.toISOString(),
      category: expenseForm.category
    };
    
    const newExpenses = [...(project.budget.expenses || []), newExpense];
    const newSpent = newExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    const updatedProject = {
      ...project,
      budget: {
        ...project.budget,
        expenses: newExpenses,
        spent: newSpent
      }
    };
    
    onUpdate(updatedProject);
    setShowAddExpense(false);
    setExpenseForm({
      description: '',
      amount: 0,
      date: new Date(),
      category: 'general'
    });
    toast.success(`Expense "${newExpense.description}" added successfully`);
  };
  
  const handleUpdateExpense = () => {
    if (!onUpdate || editingExpenseId === null) return;
    
    const updatedExpenses = project.budget.expenses.map(expense => 
      expense.id === editingExpenseId 
        ? {
            ...expense,
            description: expenseForm.description,
            amount: expenseForm.amount,
            date: expenseForm.date.toISOString(),
            category: expenseForm.category
          }
        : expense
    );
    
    const newSpent = updatedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    const updatedProject = {
      ...project,
      budget: {
        ...project.budget,
        expenses: updatedExpenses,
        spent: newSpent
      }
    };
    
    onUpdate(updatedProject);
    setEditingExpenseId(null);
    toast.success(`Expense "${expenseForm.description}" updated successfully`);
  };
  
  const handleDeleteExpense = (expenseId: number) => {
    if (!onUpdate) return;
    
    const updatedExpenses = project.budget.expenses.filter(expense => expense.id !== expenseId);
    const newSpent = updatedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    const updatedProject = {
      ...project,
      budget: {
        ...project.budget,
        expenses: updatedExpenses,
        spent: newSpent
      }
    };
    
    onUpdate(updatedProject);
    toast.success("Expense deleted successfully");
  };
  
  const handleEditExpense = (expense: ProjectExpense) => {
    setExpenseForm({
      description: expense.description,
      amount: expense.amount,
      date: new Date(expense.date),
      category: expense.category
    });
    setEditingExpenseId(expense.id);
  };
  
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Wallet className="h-5 w-5 mr-2" />
            Budget Tracking
          </CardTitle>
          {onUpdate && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowBudgetEdit(true)}
              >
                <Calculator className="h-4 w-4 mr-2" />
                Edit Budget
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowAddExpense(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Total Budget</div>
              <div className="text-2xl font-semibold">{formatCurrency(total)}</div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Spent</div>
              <div className="text-2xl font-semibold">{formatCurrency(spent)}</div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Remaining</div>
              <div className="text-2xl font-semibold">{formatCurrency(remaining)}</div>
            </div>
          </div>
          
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <div className="text-sm">
                Budget Utilization ({percentSpent.toFixed(1)}%)
              </div>
              <div className="text-sm font-medium">
                {formatCurrency(spent)} / {formatCurrency(total)}
              </div>
            </div>
            <Progress 
              value={percentSpent} 
              className="h-2"
              indicatorClassName={percentSpent > 90 ? "bg-destructive" : percentSpent > 70 ? "bg-amber-500" : undefined}
            />
          </div>
          
          <h4 className="text-lg font-medium mt-6 mb-4 flex items-center">
            <Receipt className="h-5 w-5 mr-2" />
            Expense History
          </h4>
          
          {expenses && expenses.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    {onUpdate && <TableHead className="w-[100px]">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                          {expense.category}
                        </span>
                      </TableCell>
                      <TableCell>{format(new Date(expense.date), 'MMM d, yyyy')}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(expense.amount)}</TableCell>
                      {onUpdate && (
                        <TableCell>
                          <div className="flex space-x-1 justify-end">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0" 
                              onClick={() => handleEditExpense(expense)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0" 
                              onClick={() => handleDeleteExpense(expense.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-4 text-center border rounded-lg">
              <p className="text-muted-foreground">No expenses have been recorded for this project.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Budget Dialog */}
      <Dialog open={showBudgetEdit} onOpenChange={setShowBudgetEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Budget</DialogTitle>
            <DialogDescription>
              Update the budget details for this project.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="budget-amount" className="text-sm font-medium">Total Budget</label>
              <div className="flex space-x-2">
                <Select
                  value={budgetForm.currency}
                  onValueChange={(value) => setBudgetForm({ ...budgetForm, currency: value })}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="JPY">JPY</SelectItem>
                    <SelectItem value="CAD">CAD</SelectItem>
                    <SelectItem value="AUD">AUD</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  id="budget-amount"
                  type="number"
                  placeholder="Enter budget amount"
                  value={budgetForm.total}
                  onChange={(e) => setBudgetForm({ 
                    ...budgetForm, 
                    total: parseFloat(e.target.value) || 0 
                  })}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBudgetEdit(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateBudget} disabled={budgetForm.total <= 0}>
              Save Budget
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Expense Dialog */}
      <Dialog 
        open={showAddExpense || editingExpenseId !== null} 
        onOpenChange={(open) => {
          if (!open) {
            setShowAddExpense(false);
            setEditingExpenseId(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingExpenseId !== null ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
            <DialogDescription>
              {editingExpenseId !== null 
                ? 'Update the expense details below.' 
                : 'Add a new expense to track your project spending.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="expense-description" className="text-sm font-medium">Description</label>
              <Input
                id="expense-description"
                placeholder="Enter expense description"
                value={expenseForm.description}
                onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="expense-amount" className="text-sm font-medium">Amount ({currency})</label>
              <Input
                id="expense-amount"
                type="number"
                placeholder="Enter amount"
                value={expenseForm.amount}
                onChange={(e) => setExpenseForm({ 
                  ...expenseForm, 
                  amount: parseFloat(e.target.value) || 0 
                })}
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="expense-category" className="text-sm font-medium">Category</label>
              <Select
                value={expenseForm.category}
                onValueChange={(value) => setExpenseForm({ ...expenseForm, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {expenseCategories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="expense-date" className="text-sm font-medium">Date</label>
              <Input
                id="expense-date"
                type="date"
                value={expenseForm.date.toISOString().split('T')[0]}
                onChange={(e) => setExpenseForm({ 
                  ...expenseForm, 
                  date: new Date(e.target.value) 
                })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowAddExpense(false);
                setEditingExpenseId(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={editingExpenseId !== null ? handleUpdateExpense : handleAddExpense}
              disabled={!expenseForm.description || expenseForm.amount <= 0}
            >
              {editingExpenseId !== null ? 'Update Expense' : 'Add Expense'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectBudget;
