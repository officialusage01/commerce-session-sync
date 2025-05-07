import React, { useState, useEffect } from 'react';
import { 
  Category, 
  Subcategory, 
  getCategories, 
  getSubcategories, 
  createSubcategory, 
  updateSubcategory,
  supabase 
} from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash, Plus, Tag, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SubcategoriesTab = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSubcategory, setCurrentSubcategory] = useState<Partial<Subcategory>>({});
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [subcategoryToDelete, setSubcategoryToDelete] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  useEffect(() => {
    loadCategories();
  }, []);
  
  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const categoriesData = await getCategories();
      setCategories(categoriesData);
      
      if (categoriesData.length > 0) {
        setSelectedCategory(categoriesData[0].id);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      toast({
        title: 'Error',
        description: 'Failed to load categories',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (selectedCategory) {
      loadSubcategories(selectedCategory);
    }
  }, [selectedCategory]);
  
  const loadSubcategories = async (categoryId: string) => {
    try {
      setIsLoading(true);
      const subcategoriesData = await getSubcategories(categoryId);
      setSubcategories(subcategoriesData);
    } catch (error) {
      console.error('Error loading subcategories:', error);
      toast({
        title: 'Error',
        description: 'Failed to load subcategories',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddSubcategory = () => {
    setCurrentSubcategory({ 
      name: '', 
      icon: '',
      category_id: selectedCategory || undefined
    });
    setIsEditing(false);
    setShowDialog(true);
  };
  
  const handleEditSubcategory = (subcategory: Subcategory) => {
    setCurrentSubcategory(subcategory);
    setIsEditing(true);
    setShowDialog(true);
  };
  
  const handleDeleteSubcategory = (subcategoryId: string) => {
    setSubcategoryToDelete(subcategoryId);
    setShowDeleteDialog(true);
  };
  
  const confirmDeleteSubcategory = async () => {
    if (!subcategoryToDelete) return;
    
    try {
      // First check if there are any products using this subcategory
      const { data: products, error: checkError } = await supabase
        .from('products')
        .select('id')
        .eq('subcategory_id', subcategoryToDelete);
        
      if (checkError) throw checkError;
      
      if (products && products.length > 0) {
        toast({
          title: 'Cannot Delete',
          description: 'This subcategory has products. Delete those first.',
          variant: 'destructive',
        });
        setShowDeleteDialog(false);
        return;
      }
      
      const { error } = await supabase
        .from('subcategories')
        .delete()
        .eq('id', subcategoryToDelete);
        
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Subcategory deleted successfully',
      });
      
      if (selectedCategory) {
        loadSubcategories(selectedCategory);
      }
    } catch (error) {
      console.error('Delete subcategory error:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete subcategory',
        variant: 'destructive',
      });
    } finally {
      setShowDeleteDialog(false);
      setSubcategoryToDelete(null);
    }
  };
  
  const handleSaveSubcategory = async () => {
    if (!currentSubcategory.name || !currentSubcategory.icon || !currentSubcategory.category_id) {
      toast({
        title: 'Validation Error',
        description: 'All fields are required',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      if (isEditing && currentSubcategory.id) {
        // Update existing subcategory
        const updatedSubcategory = await updateSubcategory(
          currentSubcategory.id,
          { 
            name: currentSubcategory.name, 
            icon: currentSubcategory.icon,
            category_id: currentSubcategory.category_id
          }
        );
          
        if (!updatedSubcategory) throw new Error("Failed to update subcategory");
        
        toast({
          title: 'Success',
          description: 'Subcategory updated successfully',
        });
        
        // Update in UI directly for responsive feel
        setSubcategories(prev => 
          prev.map(s => s.id === currentSubcategory.id ? 
            { 
              ...s, 
              name: currentSubcategory.name || s.name, 
              icon: currentSubcategory.icon || s.icon,
              category_id: currentSubcategory.category_id || s.category_id
            } : s
          )
        );
      } else {
        // Create new subcategory
        const newSubcategory = await createSubcategory({ 
          name: currentSubcategory.name || '', 
          icon: currentSubcategory.icon || '',
          category_id: currentSubcategory.category_id || ''
        });
          
        if (!newSubcategory) throw new Error("Failed to create subcategory");
        
        toast({
          title: 'Success',
          description: 'Subcategory created successfully',
        });
        
        // Add to UI directly
        setSubcategories(prev => [...prev, newSubcategory]);
      }
      
      setShowDialog(false);
    } catch (error: any) {
      console.error('Error saving subcategory:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save subcategory',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <Card className="shadow-lg border-slate-200">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-slate-800">Subcategories</CardTitle>
            <CardDescription>Manage product subcategories</CardDescription>
          </div>
          <Button 
            onClick={handleAddSubcategory}
            disabled={!selectedCategory}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Subcategory
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Label className="text-sm font-medium mb-2 block">Filter by Category</Label>
          <Select 
            value={selectedCategory || ''} 
            onValueChange={(value) => setSelectedCategory(value)}
          >
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : selectedCategory ? (
          subcategories.length > 0 ? (
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Icon</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subcategories.map((subcategory) => (
                  <TableRow key={subcategory.id} className="hover:bg-slate-50/80">
                    <TableCell className="font-medium">{subcategory.name}</TableCell>
                    <TableCell>{subcategory.icon}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-slate-500 hover:text-indigo-500 hover:bg-indigo-50"
                        onClick={() => handleEditSubcategory(subcategory)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-slate-500 hover:text-red-500 hover:bg-red-50"
                        onClick={() => handleDeleteSubcategory(subcategory.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 px-4 border border-dashed border-slate-200 rounded-lg">
              <Tag className="h-12 w-12 mx-auto text-slate-300 mb-2" />
              <p className="text-slate-500 mb-4">No subcategories in this category</p>
              <Button 
                onClick={handleAddSubcategory}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Your First Subcategory
              </Button>
            </div>
          )
        ) : (
          <div className="text-center py-12 text-slate-500">
            Select a category to manage subcategories
          </div>
        )}
      </CardContent>
      
      {/* Add/Edit Subcategory Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Subcategory' : 'Add New Subcategory'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Update subcategory details below.' : 'Fill in the details to create a new subcategory.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={currentSubcategory.category_id || ''} 
                onValueChange={(value) => setCurrentSubcategory({
                  ...currentSubcategory, 
                  category_id: value
                })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Subcategory Name</Label>
              <Input
                id="name"
                value={currentSubcategory.name || ''}
                onChange={(e) => setCurrentSubcategory({...currentSubcategory, name: e.target.value})}
                placeholder="Enter subcategory name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="icon">Icon Name</Label>
              <Input
                id="icon"
                value={currentSubcategory.icon || ''}
                onChange={(e) => setCurrentSubcategory({...currentSubcategory, icon: e.target.value})}
                placeholder="e.g., laptop, shirt, sofa"
              />
              <p className="text-xs text-slate-500">
                Use Lucide icon names like: laptop, smartphone, headphones, etc.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveSubcategory}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
            >
              {isEditing ? 'Save Changes' : 'Add Subcategory'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              subcategory and all related data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteSubcategory}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default SubcategoriesTab;
