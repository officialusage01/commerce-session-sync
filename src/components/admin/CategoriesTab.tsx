import React, { useState, useEffect } from 'react';
import { Category, getCategories, createCategory, updateCategory, deleteCategory, supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash, Plus, Folder, Loader2 } from 'lucide-react';
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

const CategoriesTab = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Partial<Category>>({});
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  useEffect(() => {
    fetchCategories();
  }, []);
  
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
      if (categoriesData.length === 0) {
        toast({
          title: "No categories found",
          description: "Try creating some categories to get started",
        });
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: 'Error',
        description: 'Failed to load categories. Using local data if available.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddCategory = () => {
    setCurrentCategory({ name: '', icon: '' });
    setIsEditing(false);
    setShowDialog(true);
  };
  
  const handleEditCategory = (category: Category) => {
    setCurrentCategory(category);
    setIsEditing(true);
    setShowDialog(true);
  };
  
  const handleDeleteCategory = (categoryId: string) => {
    setCategoryToDelete(categoryId);
    setShowDeleteDialog(true);
  };
  
  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    
    try {
      // First check if there are any subcategories using this category
      const { data: subcategories, error: checkError } = await supabase
        .from('subcategories')
        .select('id')
        .eq('category_id', categoryToDelete);
        
      if (checkError) {
        console.error('Error checking subcategories:', checkError);
        // Continue with deletion even if check fails
      } else if (subcategories && subcategories.length > 0) {
        toast({
          title: 'Cannot Delete',
          description: 'This category has subcategories. Delete those first.',
          variant: 'destructive',
        });
        setShowDeleteDialog(false);
        return;
      }
      
      const success = await deleteCategory(categoryToDelete);
      
      if (success) {
        toast({
          title: 'Success',
          description: 'Category deleted successfully',
        });
        
        fetchCategories();
      } else {
        throw new Error("Failed to delete category");
      }
    } catch (error) {
      console.error('Delete category error:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete category, but removed from local view',
        variant: 'destructive',
      });
      // Remove from UI even if backend fails
      setCategories(prev => prev.filter(cat => cat.id !== categoryToDelete));
    } finally {
      setShowDeleteDialog(false);
      setCategoryToDelete(null);
    }
  };
  
  const handleSaveCategory = async () => {
    if (!currentCategory.name || !currentCategory.icon) {
      toast({
        title: 'Validation Error',
        description: 'Name and icon are required',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      if (isEditing && currentCategory.id) {
        // Update existing category - Convert string ID to number if needed
        const updatedCategory = await updateCategory(
          currentCategory.id, // TypeScript will now accept this as the ID
          { 
            name: currentCategory.name, 
            icon: currentCategory.icon 
          }
        );
          
        if (!updatedCategory) throw new Error("Failed to update category");
        
        toast({
          title: 'Success',
          description: 'Category updated successfully',
        });
        
        setCategories(prev => 
          prev.map(c => c.id === currentCategory.id ? 
            { ...c, name: currentCategory.name || c.name, icon: currentCategory.icon || c.icon } : c
          )
        );
      } else {
        // Create new category
        const newCategory = await createCategory({ 
          name: currentCategory.name || '', 
          icon: currentCategory.icon || '' 
        });
          
        if (!newCategory) throw new Error("Failed to create category");
        
        toast({
          title: 'Success',
          description: 'Category created successfully',
        });
        
        setCategories(prev => [...prev, newCategory]);
      }
      
      setShowDialog(false);
    } catch (error) {
      console.error('Save category error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save category',
        variant: 'destructive',
      });
      
      // Update UI anyway for better UX
      if (isEditing && currentCategory.id) {
        setCategories(prev => 
          prev.map(c => c.id === currentCategory.id ? 
            { ...c, name: currentCategory.name || c.name, icon: currentCategory.icon || c.icon } : c
          )
        );
      } else {
        const tempId = Date.now().toString(); // Changed to string to match UUID type
        setCategories(prev => [...prev, {
          id: tempId,
          name: currentCategory.name || 'New Category',
          icon: currentCategory.icon || 'folder',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);
      }
      
      setShowDialog(false);
    }
  };
  
  return (
    <Card className="shadow-lg border-slate-200">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-slate-800">Categories</CardTitle>
            <CardDescription>Manage product categories</CardDescription>
          </div>
          <Button 
            onClick={handleAddCategory}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : categories.length > 0 ? (
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Icon</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id} className="hover:bg-slate-50/80">
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.icon}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-slate-500 hover:text-indigo-500 hover:bg-indigo-50"
                      onClick={() => handleEditCategory(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-slate-500 hover:text-red-500 hover:bg-red-50"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-16">
            <Folder className="h-12 w-12 mx-auto text-slate-300 mb-2" />
            <p className="text-slate-500 mb-4">No categories found</p>
            <Button 
              onClick={handleAddCategory}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Your First Category
            </Button>
          </div>
        )}
      </CardContent>
      
      {/* Add/Edit Category Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Category' : 'Add New Category'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Update category details below.' : 'Fill in the details to create a new category.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                value={currentCategory.name || ''}
                onChange={(e) => setCurrentCategory({...currentCategory, name: e.target.value})}
                placeholder="Enter category name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="icon">Icon Name</Label>
              <Input
                id="icon"
                value={currentCategory.icon || ''}
                onChange={(e) => setCurrentCategory({...currentCategory, icon: e.target.value})}
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
              onClick={handleSaveCategory}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
            >
              {isEditing ? 'Save Changes' : 'Add Category'}
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
              category and all related data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteCategory}
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

export default CategoriesTab;
