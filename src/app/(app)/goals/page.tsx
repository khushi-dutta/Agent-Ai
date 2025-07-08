'use client';
import { useState } from 'react';
import { useFinancialData } from '@/hooks/use-financial-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PlusCircle, Edit, Trash2, Target } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import type { FinancialData } from '@/lib/mcp-data';
import { Skeleton } from '@/components/ui/skeleton';
import { format, differenceInDays } from 'date-fns';

type Goal = FinancialData['goals'][0];

const goalSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, { message: "Goal name must be at least 3 characters." }),
  targetAmount: z.coerce.number().min(1, { message: "Target amount must be greater than 0." }),
  currentAmount: z.coerce.number().min(0, "Current amount cannot be negative."),
  targetDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date format." }),
});

type GoalFormData = z.infer<typeof goalSchema>;

export default function GoalsPage() {
  const { financialData, setFinancialData, loading } = useFinancialData();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
  });

  const handleOpenDialog = (goal: Goal | null = null) => {
    setEditingGoal(goal);
    if (goal) {
      reset({
        id: goal.id,
        name: goal.name,
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
        targetDate: goal.targetDate,
      });
    } else {
      reset({ name: '', targetAmount: 0, currentAmount: 0, targetDate: new Date().toISOString().split('T')[0], id: undefined });
    }
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingGoal(null);
    reset();
  }

  const onSubmit = (data: GoalFormData) => {
    const newGoals = [...financialData.goals];
    if (editingGoal) {
      const index = newGoals.findIndex(g => g.id === editingGoal.id);
      if (index !== -1) {
        newGoals[index] = { ...editingGoal, ...data };
      }
    } else {
      newGoals.push({ ...data, id: `goal_${Date.now()}` });
    }
    setFinancialData({ ...financialData, goals: newGoals });
    toast({
      title: `Goal ${editingGoal ? 'Updated' : 'Added'}`,
      description: `Your goal "${data.name}" has been successfully ${editingGoal ? 'updated' : 'saved'}.`,
    });
    handleCloseDialog();
  };
  
  const handleDeleteGoal = (goalId: string) => {
      const newGoals = financialData.goals.filter(g => g.id !== goalId);
      setFinancialData({ ...financialData, goals: newGoals });
      toast({
          title: "Goal Deleted",
          description: "The goal has been removed.",
          variant: "destructive"
      });
  };
  
  if (loading || !financialData) {
      return (
          <div className="space-y-6">
              <div className="flex justify-between items-center">
                  <Skeleton className="h-10 w-1/3" />
                  <Skeleton className="h-10 w-32" />
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Skeleton className="h-56 rounded-xl" />
                  <Skeleton className="h-56 rounded-xl" />
                  <Skeleton className="h-56 rounded-xl" />
              </div>
          </div>
      )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-headline font-bold">Your Financial Goals</h1>
          <p className="text-muted-foreground">Track your progress and stay motivated.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog(null)}>
              <PlusCircle className="mr-2" />
              Add New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={handleCloseDialog}>
            <DialogHeader>
              <DialogTitle>{editingGoal ? 'Edit Goal' : 'Add New Goal'}</DialogTitle>
              <DialogDescription>
                {editingGoal ? 'Update the details of your goal.' : 'Set a new financial target to work towards.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Goal Name</Label>
                    <Input id="name" {...register('name')} />
                    {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetAmount">Target Amount (₹)</Label>
                    <Input id="targetAmount" type="number" {...register('targetAmount')} />
                     {errors.targetAmount && <p className="text-xs text-destructive">{errors.targetAmount.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentAmount">Current Amount (₹)</Label>
                    <Input id="currentAmount" type="number" {...register('currentAmount')} />
                     {errors.currentAmount && <p className="text-xs text-destructive">{errors.currentAmount.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetDate">Target Date</Label>
                    <Input id="targetDate" type="date" {...register('targetDate')} />
                     {errors.targetDate && <p className="text-xs text-destructive">{errors.targetDate.message}</p>}
                  </div>
                </div>
                 <DialogFooter>
                    <Button type="button" variant="ghost" onClick={handleCloseDialog}>Cancel</Button>
                    <Button type="submit">{editingGoal ? 'Save Changes' : 'Add Goal'}</Button>
                </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {financialData.goals.map((goal) => {
          const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
          const daysLeft = differenceInDays(new Date(goal.targetDate), new Date());
          
          return (
            <Card key={goal.id} className="flex flex-col transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="font-headline text-xl">{goal.name}</CardTitle>
                    <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenDialog(goal)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Goal</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete the goal "{goal.name}"? This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteGoal(goal.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
                <CardDescription>
                  Target: {format(new Date(goal.targetDate), "MMMM d, yyyy")}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-2">
                  <Progress value={progress > 100 ? 100 : progress} />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span className="font-medium text-primary">
                      {progress.toFixed(0)}% Complete
                    </span>
                    <span>
                      {daysLeft >= 0 ? `${daysLeft} days left` : 'Target date passed'}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-baseline bg-muted/50 p-4 mt-4">
                <div>
                    <p className="text-xs text-muted-foreground">Saved</p>
                    <p className="font-bold text-lg">₹{goal.currentAmount.toLocaleString('en-IN')}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-muted-foreground">Target</p>
                    <p className="font-bold text-lg">₹{goal.targetAmount.toLocaleString('en-IN')}</p>
                </div>
              </CardFooter>
            </Card>
          )
        })}
      </div>
       {financialData.goals.length === 0 && (
            <div className="col-span-full mt-10">
                <Card className="flex flex-col items-center justify-center text-center p-12 min-h-[300px] border-dashed">
                    <div className="p-4 bg-primary/10 rounded-full mb-4 ring-8 ring-primary/5">
                        <Target className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="font-headline text-2xl mb-2">No Goals Yet</CardTitle>
                    <CardDescription className="max-w-xs mx-auto mb-6">
                        What are you saving for? A new car, a vacation, or a down payment? Add your first goal to get started!
                    </CardDescription>
                    <Button onClick={() => handleOpenDialog(null)}>
                        <PlusCircle className="mr-2" />
                        Add Your First Goal
                    </Button>
                </Card>
            </div>
        )}
    </div>
  );
}
